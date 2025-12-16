# ♟️ Frugal Adaptive Chess Learning System (FALS)

A **client-side, research-backed adaptive chess puzzle tutor** designed for children.  
The system maintains the learner’s **Flow state** using lightweight statistics — **no servers, no heavy ML, no expensive infrastructure**.

---

## 🚀 Project Motivation

Most adaptive learning platforms rely on:
- Heavy backend servers
- Complex machine learning models
- Large databases and analytics pipelines

These approaches are:
- Expensive
- Hard to scale
- Overkill for simple learning tasks like chess puzzles

### Our Question

> Can we build a **smart, adaptive learning system** that:
> - Runs entirely on the client
> - Adapts in real time
> - Is explainable and frugal
> - Works smoothly on low-end devices?

**FALS is our answer.**

---

## 🧠 Core Idea

FALS uses a **lightweight adaptive feedback loop** inspired by:
- Elo / Glicko rating systems
- Flow theory
- Zone of Proximal Development (ZPD)
- Educational data mining research

All logic runs **inside the browser** using JavaScript.

---
## ▶️ How to Run

From the project root:

```bash
python -m http.server 8000

