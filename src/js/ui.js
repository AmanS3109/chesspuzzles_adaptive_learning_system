export class UIController {
    constructor(boardId, onMoveCallback) {
        this.game = new Chess();
        this.board = null;
        this.boardId = boardId;
        this.onMoveCallback = onMoveCallback;
        this.hintTimer = null;
    }

    // ---------------- Board Setup ----------------

    initBoard() {
        this.board = Chessboard(this.boardId, {
            draggable: true,
            position: 'start',
            pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png',
            onDragStart: (source, piece) => this.validateDrag(source, piece),
            onDrop: (source, target) => this.handleDrop(source, target)
        });
    }

    loadPuzzle(fen, orientation) {
        this.game.load(fen);
        this.board.position(fen);
        this.board.orientation(orientation);
        this.clearFeedback();
    }

    // ---------------- Move Handling ----------------

    validateDrag(source, piece) {
        if (this.game.game_over()) return false;

        // Allow dragging only the side to move
        if (
            (this.game.turn() === 'w' && piece.startsWith('b')) ||
            (this.game.turn() === 'b' && piece.startsWith('w'))
        ) {
            return false;
        }
    }

    handleDrop(source, target) {
        const move = this.game.move({
            from: source,
            to: target,
            promotion: 'q'
        });

        if (move === null) return 'snapback';

        // Notify controller
        this.onMoveCallback(source, target);
    }

    // ---------------- Feedback ----------------

    showFeedback(message, type) {
        const el = document.getElementById('feedback-banner');
        el.innerText = message;
        el.className = `feedback-${type}`;
    }

    clearFeedback() {
        const el = document.getElementById('feedback-banner');
        el.innerText = '';
        el.className = 'feedback-neutral';
    }

    showHint(sourceSquare) {
        const square = document.querySelector(
            `#${this.boardId} .square-${sourceSquare}`
        );

        if (square) square.classList.add('highlight-hint');

        this.showFeedback("💡 Need a hint? Look for a check!", "warn");
    }

    // ---------------- Stats ----------------

    updateStats(rating, puzzleRating, streak) {
        document.getElementById('user-rating').innerText = rating;
        document.getElementById('puzzle-rating').innerText = puzzleRating;
        document.getElementById('streak').innerText = streak;
    }

    // ---------------- Utility ----------------

    undoLastMove() {
        if (this.game.history().length > 0) {
            this.game.undo();
            this.board.position(this.game.fen());
        }
    }
}
