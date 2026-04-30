import csv


INPUT_FILE = "responses.cvs"
OUTPUT_FILE = "responses_cleaned.cvs"


cleaned_rows = []

with open(INPUT_FILE, newline="", encoding="utf-8") as infile:
    reader = csv.DictReader(infile)
    fieldnames = reader.fieldnames or []

    for row in reader:
        name_value = (row.get("name") or "").strip()
        if not name_value:
            continue

        row["name"] = name_value

        role_value = row.get("role")
        if role_value is not None:
            row["role"] = role_value.upper()

        cleaned_rows.append(row)

with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as outfile:
    writer = csv.DictWriter(outfile, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(cleaned_rows)

print(f"Cleaned {len(cleaned_rows)} rows and saved to {OUTPUT_FILE}")
