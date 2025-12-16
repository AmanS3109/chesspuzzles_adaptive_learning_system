import json
import random
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "data")
OUTPUT_FILE = os.path.join(DATA_DIR, "puzzles.json")

COUNT = 500  # Number of puzzles to generate for this demo


def fetch_puzzles():
    print(f"DTO: Fetching {COUNT} puzzles...")

    database = []

    # Sample "Mate in 1" patterns (demo dataset)
    patterns = [
        {
            "fen": "r1bqkbnr/pppp1ppp/2n5/2b1p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 4 4",
            "move": "f3f7",
            "rating": 600,
        },
        {
            "fen": "6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
            "move": "e1e8",
            "rating": 700,
        },
        {
            "fen": "rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2",
            "move": "d8h4",
            "rating": 800,
        },
        {
            "fen": "2r3k1/p4ppp/8/8/8/8/P4PPP/2R3K1 w - - 0 1",
            "move": "c1c8",
            "rating": 900,
        },
        {
            "fen": "1k6/ppp5/8/8/8/8/5PPP/4R1K1 w - - 0 1",
            "move": "e1e8",
            "rating": 1000,
        },
    ]

    # Generate variations to simulate a larger DB
    for i in range(COUNT):
        base = random.choice(patterns)

        puzzle = {
            "id": f"{i:04d}",
            "rating": base["rating"] + random.randint(-200, 200),
            "fen": base["fen"],
            "moves": [base["move"]],  # MVP: single best move
            "themes": ["mateIn1"],
        }

        database.append(puzzle)

    # Sort by rating (binary search friendly)
    database.sort(key=lambda x: x["rating"])

    # Ensure data directory exists
    os.makedirs(DATA_DIR, exist_ok=True)

    # Write to JSON file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(database, f, indent=2)

    print(f"SUCCESS: Database generated at {OUTPUT_FILE}")


if __name__ == "__main__":
    fetch_puzzles()