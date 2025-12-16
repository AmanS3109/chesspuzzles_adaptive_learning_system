import { TutorEngine } from './tutor.js';
import { UIController } from './ui.js';

let puzzleDB = [];
let currentPuzzle = null;
let struggleTimer = null;

const tutor = new TutorEngine();
const ui = new UIController('board', onUserMove);

// Initialization
async function init() {
    try {
        const response = await fetch('/data/puzzles.json');

        if (!response.ok) {
            throw new Error(`Failed to load puzzles.json (HTTP ${response.status})`);
        }

        puzzleDB = await response.json();

        ui.initBoard();
        loadNextLevel();

        document
            .getElementById('btn-next')
            .addEventListener('click', loadNextLevel);

    } catch (err) {
        console.error(err);
        ui.showFeedback("Error loading data. Check console.", "error");
    }
}

// Core Flow
function loadNextLevel() {
    currentPuzzle = tutor.selectNextPuzzle(puzzleDB);

    const orientation = currentPuzzle.fen.includes(' w ') ? 'white' : 'black';

    ui.loadPuzzle(currentPuzzle.fen, orientation);
    ui.updateStats(tutor.userRating, currentPuzzle.rating, tutor.streak);

    document.getElementById('btn-next').classList.add('hidden');
    ui.showFeedback(
        `${orientation === 'white' ? 'White' : 'Black'} to move (mate in 1)`,
        "neutral"
    );

    startStruggleDetection(currentPuzzle);
}

function startStruggleDetection(puzzle) {
    if (struggleTimer) clearTimeout(struggleTimer);

    const thresholdSeconds = tutor.calculateTimeThreshold(puzzle.rating);
    console.log(`Struggle threshold: ${thresholdSeconds}s`);

    struggleTimer = setTimeout(() => {
        const sourceSquare = puzzle.moves[0].slice(0, 2);
        ui.showHint(sourceSquare);
    }, thresholdSeconds * 1000);
}

// UI
function onUserMove(source, target) {
    if (struggleTimer) clearTimeout(struggleTimer);

    const userMove = source + target;
    const correctMove = currentPuzzle.moves[0];

    if (userMove === correctMove) {
        handleSuccess();
    } else {
        handleFailure();
    }
}

function handleSuccess() {
    // Update internal state FIRST
    tutor.applyCooldown(currentPuzzle.id, 3);
    tutor.updateModel(currentPuzzle.rating, true);

    // Update UI
    ui.showFeedback("Excellent! Solved.", "success");
    ui.updateStats(tutor.userRating, currentPuzzle.rating, tutor.streak);

    // Allow next puzzle
    document.getElementById('btn-next').classList.remove('hidden');
}

function handleFailure() {
    // Update internal state FIRST
    tutor.applyCooldown(currentPuzzle.id, 2);
    tutor.updateModel(currentPuzzle.rating, false);

    // Update UI
    ui.showFeedback("Not quite. Try again!", "error");

    // Undo move visually
    setTimeout(() => {
        ui.undoLastMove();
    }, 400);
}

init();
