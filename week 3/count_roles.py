import csv
from collections import Counter
from pathlib import Path


INPUT_FILE = "demo_responses.csv"
OUTPUT_FILE = "role_counts.csv"
UNKNOWN_ROLE = "UNKNOWN"


def normalize_role(value: str | None) -> str:
    # This function cleans one role value:
    # - removes extra spaces
    # - uses UNKNOWN if role is empty
    # - converts text to uppercase so counting is case-insensitive
    role = (value or "").strip()
    if not role:
        return UNKNOWN_ROLE
    return role.upper()


def main() -> None:
    script_dir = Path(__file__).resolve().parent
    input_path = script_dir / INPUT_FILE
    output_path = script_dir / OUTPUT_FILE

    role_counts: Counter[str] = Counter()

    with open(input_path, newline="", encoding="utf-8") as infile:
        reader = csv.DictReader(infile)
        for row in reader:
            # This loop reads each row, cleans the role value, and adds 1 to that role's count.
            normalized_role = normalize_role(row.get("role"))
            role_counts[normalized_role] += 1

    sorted_counts = sorted(role_counts.items(), key=lambda item: item[0])

    print("Role counts:")
    for role, count in sorted_counts:
        print(f"{role}: {count}")

    with open(output_path, "w", newline="", encoding="utf-8") as outfile:
        writer = csv.writer(outfile)
        # The output file stores two columns: role and count.
        # Each row in the output is one cleaned role with its total number of responses.
        writer.writerow(["role", "count"])
        writer.writerows(sorted_counts)

    print(f"\nSaved counts to {output_path}")


if __name__ == "__main__":
    main()
