# Week 3 - Competency Claim

## Competency Focus
Data cleaning, debugging, and basic analysis in Python.

## Claim
In Week 3, I demonstrated competency in debugging and cleaning real-world messy CSV data using Python. I identified multiple bugs in the analysis script, explained their causes, and implemented targeted fixes that made the script robust and reproducible.

## Evidence
- I fixed a `ValueError` caused by non-numeric values in `experience_years` (for example, `"fifteen"`), using safe parsing logic.
- I corrected the average-experience calculation so it uses only valid cleaned values and avoids divide-by-zero errors.
- I improved role cleaning and normalization so inconsistent casing and blank roles are handled consistently.
- I fixed the top-5 satisfaction logic so the script returns the highest scores, not the lowest.
- I added plain-English comments in the script to document what each cleaning step and loop is doing.

## Reflection
This week showed me that debugging is not just fixing crashes; it is also about improving data quality assumptions and making outputs trustworthy. I learned to check edge cases, verify results after each fix, and document my reasoning clearly so others can follow the analysis process.
