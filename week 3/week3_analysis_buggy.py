import csv
from pathlib import Path

# Load the survey data from a CSV file
filename = "week3_survey_messy.csv"
rows = []
NUMBER_WORDS = {
    "zero": 0,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "thirteen": 13,
    "fourteen": 14,
    "fifteen": 15,
    "sixteen": 16,
    "seventeen": 17,
    "eighteen": 18,
    "nineteen": 19,
    "twenty": 20,
}


def parse_experience_years(value):
    # This cleaning function tries to turn the experience field into a number.
    # It handles blanks, regular digits ("7"), and number words ("fifteen").
    # If the value cannot be cleaned into a number, it returns None.
    text = (value or "").strip().lower()
    if not text:
        return None
    if text.isdigit():
        return int(text)
    return NUMBER_WORDS.get(text)

data_path = Path(__file__).resolve().parent / filename

with open(data_path, newline="", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        # This loop reads each CSV row and stores it in memory for later analysis.
        rows.append(row)

# Count responses by role
# Normalize role names so "ux researcher" and "UX Researcher" are counted together
role_counts = {}

for row in rows:
    # This loop cleans role text so casing differences count as the same role.
    # It also labels missing roles as "Unknown" so blanks are tracked clearly.
    role_raw = (row.get("role") or "").strip()
    if not role_raw:
        role = "Unknown"
    else:
        role = " ".join(word.upper() if word.lower() == "ux" else word.title() for word in role_raw.split())
    if role in role_counts:
        role_counts[role] += 1
    else:
        role_counts[role] = 1

print("Responses by role:")
for role, count in sorted(role_counts.items()):
    print(f"  {role}: {count}")

# Calculate the average years of experience
total_experience = 0
valid_experience_count = 0

for row in rows:
    # This loop cleans experience_years and only includes valid numeric values
    # when computing the average.
    years = parse_experience_years(row.get("experience_years"))
    # If the years are None, continue to the next row
    if years is None:
        continue
    total_experience += years
    valid_experience_count += 1

avg_experience = total_experience / valid_experience_count if valid_experience_count else 0
print(f"\nAverage years of experience: {avg_experience:.1f}")

# Find the top 5 highest satisfaction scores
scored_rows = []
for row in rows:
    # This loop keeps only valid numeric satisfaction scores for ranking.
    score_text = (row.get("satisfaction_score") or "").strip()
    if score_text.isdigit():
        scored_rows.append((row.get("participant_name") or "Unknown", int(score_text)))

scored_rows.sort(key=lambda x: x[1], reverse=True)
top5 = scored_rows[:5]

print("\nTop 5 satisfaction scores:")
for name, score in top5:
    print(f"  {name}: {score}")

# Output note:
# This script does not write to an output file.
# It prints cleaned summary results directly to the terminal.
