# quiz_app_mbp

Simple browser-based quiz scoresheet for MBP.

## Project structure

```
quiz_app_mbp/
├─ quiz_scoresheet_app.html   # Single-page app (HTML/CSS/JS)
└─ README.md                  # Project documentation
```

## How to run

1. Open `quiz_scoresheet_app.html` directly in a web browser.
2. (Optional) Serve the folder with any static file server if your environment requires it.

## How to play / use

1. Enter the round number and team names.
2. For each question, choose the result for **Team 1** and **Team 2**:
   - **No option**: Correct / Wrong
   - **With option**: Correct / Wrong
   - **Pass**
   - **Challenge opponent**: Correct / Wrong
3. Scores update automatically; recent actions appear in the log.

## Scoring rules

- No option: **+5 / −1**
- With option: **+3 / −2**
- Pass: **0**
- Challenge opponent: **+4 / −5**

## Reset

Use the **Reset** button to clear all scores and the log.
