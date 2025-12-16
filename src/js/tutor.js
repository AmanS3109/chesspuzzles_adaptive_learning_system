export class TutorEngine {
    constructor(startingRating = 600) {
        // ---------------- Core State ----------------
        this.userRating = startingRating;
        this.streak = 0;

        // ---------------- Anti-Repetition ----------------
        // puzzleId -> remaining cooldown count
        this.cooldown = new Map();
    }

    // --------------------------------------------------
    // Internal: reduce cooldown counters each selection
    // --------------------------------------------------
    tickCooldowns() {
        if (!this.cooldown) {
            this.cooldown = new Map();
            return;
        }

        for (const [id, turns] of this.cooldown.entries()) {
            if (turns <= 1) {
                this.cooldown.delete(id);
            } else {
                this.cooldown.set(id, turns - 1);
            }
        }
    }

    // --------------------------------------------------
    // Puzzle Selection (Adaptive + Cooldown + Random)
    // --------------------------------------------------
    selectNextPuzzle(puzzleDatabase) {
        // Defensive guards
        if (!Array.isArray(puzzleDatabase) || puzzleDatabase.length === 0) {
            throw new Error("Puzzle database is empty or invalid");
        }

        this.tickCooldowns();

        const targetRating = this.userRating + 50;

        // Dynamic difficulty band
        const RANGE = Math.max(150, Math.abs(this.streak) * 50);

        // Prefer puzzles NOT on cooldown
        let candidates = puzzleDatabase.filter(p =>
            p &&
            p.id !== undefined &&
            !this.cooldown.has(p.id) &&
            Math.abs(p.rating - targetRating) <= RANGE
        );

        // Fallback: allow cooldown puzzles
        if (candidates.length === 0) {
            candidates = puzzleDatabase.filter(p =>
                Math.abs(p.rating - targetRating) <= RANGE
            );
        }

        // Final fallback: anything (never crash)
        if (candidates.length === 0) {
            candidates = puzzleDatabase;
        }

        // Random selection to avoid loops
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    // --------------------------------------------------
    // Time Threshold (Struggle Detection)
    // --------------------------------------------------
    calculateTimeThreshold(puzzleRating) {
        const expectedSeconds = 10 + puzzleRating / 100;
        return expectedSeconds * 2.5;
    }

    // --------------------------------------------------
    // Rating Update (ELO-like)
    // --------------------------------------------------
    updateModel(puzzleRating, isSolved) {
        const K = this.streak > 3 ? 16 : 32;

        const ratingDiff = puzzleRating - this.userRating;
        const expectedScore = 1 / (1 + Math.pow(10, ratingDiff / 400));
        const actualScore = isSolved ? 1 : 0;

        this.userRating += K * (actualScore - expectedScore);
        this.userRating = Math.round(this.userRating);

        if (isSolved) {
            this.streak = this.streak >= 0 ? this.streak + 1 : 1;
        } else {
            this.streak = this.streak <= 0 ? this.streak - 1 : -1;
        }

        return {
            newRating: this.userRating,
            streak: this.streak
        };
    }

    // Cooldown API (called from app.js)
    applyCooldown(puzzleId, turns = 3) {
        if (!this.cooldown) {
            this.cooldown = new Map();
        }
        this.cooldown.set(puzzleId, turns);
    }
}
