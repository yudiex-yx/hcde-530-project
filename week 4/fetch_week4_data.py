import csv
import json
import ssl
from collections import defaultdict
from pathlib import Path
from urllib.error import URLError
from urllib.parse import urlencode, urljoin
from urllib.request import urlopen

# Host for the Week 4 API; resource path is appended (see reviews URL below).
BASE_URL = "https://hcde530-week4-api.onrender.com/"
OUTPUT_FILE = "week4_category_helpful_votes.csv"
REVIEWS_LIMIT = 10


def fetch_json(url: str):
    """Fetch JSON from a URL, with a TLS fallback for local cert issues."""
    try:
        with urlopen(url, timeout=30) as response:
            return json.load(response)
    except ssl.SSLCertVerificationError:
        pass
    except URLError as error:
        if not isinstance(getattr(error, "reason", None), ssl.SSLError):
            raise

    insecure_context = ssl._create_unverified_context()  # retry fetch when cert verification fails locally
    with urlopen(url, context=insecure_context, timeout=30) as response:
        return json.load(response)


def extract_review_rows(payload):
    """Return a list of review dicts from the API response."""
    if isinstance(payload, list):
        return [item for item in payload if isinstance(item, dict)]
    if not isinstance(payload, dict):
        return []
    reviews = payload.get("reviews")
    if isinstance(reviews, list):
        return [item for item in reviews if isinstance(item, dict)]
    for key in ("data", "results", "items", "records"):
        value = payload.get(key)
        if isinstance(value, list):
            return [item for item in value if isinstance(item, dict)]
    return []


def get_value(record: dict, key_options: tuple[str, ...]):
    """Read a value from a record using flexible key matching."""
    normalized = {
        key.strip().lower().replace(" ", "").replace("_", ""): value
        for key, value in record.items()
    }
    for option in key_options:
        if option in normalized:
            return normalized[option]
    return None


def to_int(value, default: int = 0) -> int:
    if value is None:
        return default
    try:
        return int(str(value).strip())
    except ValueError:
        return default


def summarize(rows: list[dict], total_in_dataset: int | None) -> None:
    """Print a short overview of the fetched sample (useful for quick inspection)."""
    if not rows:
        print("No rows to summarize.")
        return

    votes_sum = sum(to_int(r.get("helpful_votes")) for r in rows)
    by_category: dict[str, int] = defaultdict(int)
    for r in rows:
        cat = str(r.get("category") or "Unknown").strip()
        by_category[cat] += to_int(r.get("helpful_votes"))

    print("\n--- Summary ---")
    if total_in_dataset is not None:
        print(f"API reports {total_in_dataset} reviews total; this file uses {len(rows)} rows (limit={REVIEWS_LIMIT}).")
    else:
        print(f"Fetched {len(rows)} reviews (limit={REVIEWS_LIMIT}).")
    print(f"Sum of helpful votes in this sample: {votes_sum}")
    print("Helpful votes by research category (this sample):")
    for cat in sorted(by_category.keys(), key=lambda c: (-by_category[c], c)):
        print(f"  - {cat}: {by_category[cat]}")


def main():
    # Same resource as https://hcde530-week4-api.onrender.com/reviews?limit=10
    reviews_url = urljoin(BASE_URL, "reviews")
    query_url = f"{reviews_url}?{urlencode({'limit': REVIEWS_LIMIT})}"

    try:
        payload = fetch_json(query_url)
    except Exception as error:
        print(f"Failed to fetch data from API: {error}")
        payload = {}

    total_in_dataset = payload.get("total") if isinstance(payload, dict) else None
    records = extract_review_rows(payload)
    if not records:
        print("No records found in API response. Creating CSV with header only.")

    parsed: list[dict] = []
    for record in records:
        app = get_value(record, ("app", "application", "product"))
        category = get_value(record, ("category", "researchcategory"))
        helpful_votes = get_value(
            record,
            ("helpfulvotes", "helpfulvote", "voteshelpful"),
        )

        if category is None and helpful_votes is None:
            continue

        app_text = str(app).strip() if app is not None else ""
        category_text = str(category).strip() if category is not None else "Unknown"
        votes_int = to_int(helpful_votes)

        parsed.append(
            {
                "app": app_text,
                "category": category_text,
                "helpful_votes": votes_int,
            }
        )

    parsed.sort(key=lambda r: r["helpful_votes"], reverse=True)
    summarize(parsed, total_in_dataset if isinstance(total_in_dataset, int) else None)

    output_rows = [
        {
            "app": r["app"],
            "category": r["category"],
            "helpful_votes": r["helpful_votes"],
        }
        for r in parsed
    ]

    for row in output_rows:
        print(
            f"{row['app'] or '(unknown app)'} | {row['category']} | "
            f"helpful votes: {row['helpful_votes']}"
        )

    output_path = Path(__file__).resolve().parent / OUTPUT_FILE
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=["app", "category", "helpful_votes"])
        writer.writeheader()
        writer.writerows(output_rows)

    print(f"\nSaved {len(output_rows)} rows to {output_path}")


if __name__ == "__main__":
    main()
