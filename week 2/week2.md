# Week 2 — Competency 2: Code literacy and documentation

This file sits **next to** `demo_word_count.py`, `demo_responses.csv`, and `.cursorrules` inside **`HCDE 530 Week 2 Project/`**.

## What this artifact is for

This week’s work is a **small, runnable example** of processing a **tabular data file** (CSV) with Python. The goal is to show **how to work with a data file in a disciplined way**—not to build production software. The sample responses in `demo_responses.csv` are **paraphrased demo content** inspired by real themes, suitable for class.

---

## Competency 2 — how I’m interpreting it here

**Code literacy** (for this project): being able to **open a script**, **follow the main steps** (read file → turn rows into something usable → compute something simple → print results), and **connect those steps to the columns** in the CSV.

**Documentation**: anything that helps **someone else (or future you)** understand **what the data is**, **what the script expects**, and **what the important lines are doing**—including short comments in code, clear variable names, and project-level notes (like this file or `.cursorrules`).

---

## What I actually practiced

- **Reading code** line by line to see the flow of the program before changing or running it.
- **Relating code to data**: matching `participant_id`, `role`, and `response` in the script to the headers in the CSV.
- **Running a script locally** to confirm the output matches what I expect from the file (row count, previews, summary stats).
- **Using the repo as documentation**: keeping the CSV and script together so the “story” of the analysis is easy to follow.

---

## What the code is doing (high level)

1. **Load** `demo_responses.csv` using Python’s CSV reader so each row becomes a **dictionary** keyed by column name.
2. **Define** a small function that counts words in a single response string.
3. **Loop** over each row, count words, and **print** a readable table (ID, role, word count, short preview of text).
4. **Summarize** with simple aggregate stats (how many responses, min / max / average word count).

The parts worth noticing for “data file literacy” are: **UTF-8 encoding**, **using column names instead of column indexes** (`DictReader`), and **keeping the printed output human-readable** so results can be sanity-checked quickly.

---

## Observations — strengths and limits

**Strengths**

- The workflow is **transparent**: you can see raw rows, per-row outputs, and a summary.
- **Column names** in the CSV align with the keys used in code, which reduces silent mistakes.
- **Small functions** (e.g., word counting) keep the main loop easier to read.

**Limits (honest)**

- Word counts are a **shallow** measure; they don’t capture meaning or quality of responses.
- Real research workflows often need **consent, de-identification, and data governance** steps that this demo does not cover—by design, for class scope.

---

## What I want collaborators (or instructors) to take away

- As an **HCD practitioner**, my priority is **clarity and traceability**: from data file → script → printed output.
- “Good documentation” here means **the next person can run it once and understand what happened** without being an engineer.

---

## Quick verify

From **`HCDE 530 Week 2 Project/`** (this folder), with Python 3:

```bash
python3 demo_word_count.py
```

If your terminal is at the **repository root** instead, run:

```bash
python3 "HCDE 530 Week 2 Project/demo_word_count.py"
```

You should see a header line, one line per participant, then a short summary block at the end.
