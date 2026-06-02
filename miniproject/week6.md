# Week 6 — Competency Claim (Mini Project 1)

This claim is about **Mini Project 1**: a Jupyter notebook analysis of the first 150 Kanto Pokémon from [PokéAPI](https://pokeapi.co/), published in `week6_mp1_starter.ipynb`. I pulled nested JSON with `requests`, reshaped it into a pandas DataFrame, answered three research questions about body size, type-linked stats, and Pokédex-ID “iconicity,” and paired each question with a Plotly visualization. Below are the competency domains that MP1 actually demonstrates—not all eight course domains apply here.

---

## C2: Code reading

MP1 demonstrates **C2 (Code reading)** because I can read the Python and pandas blocks in my notebook and explain what they do without running them blindly. When I call PokéAPI, I loop over Pokémon IDs, use `requests.get(url, timeout=20)`, check `response.raise_for_status()`, and pull fields out of nested JSON—`stats[i]["base_stat"]`, `types[0]["type"]["name"]`—into flat dictionary rows before building a DataFrame. I understand why that flattening step matters: the API returns one object per species, but analysis needs one row per Pokémon with columns like `primary_type` and `speed`. In Section 3, I can walk through a line like `df.groupby("primary_type")[["weight", "speed"]].corr()` and say it computes a separate weight–speed correlation within each type group, not a single number for the whole table. The same goes for the η² helper, which splits total sum of squares into between-type and within-type parts, and for the permutation loop that shuffles group labels to build a null distribution for comparing `total_stats` across ID bands. Being able to narrate those steps—in plain language, including what each function returns—is what code reading means for this project.

---

## C3: Data handling

MP1 demonstrates **C3 (Data handling)** because I load, clean, and reshape raw API data into an analysis-ready table using pandas. PokéAPI responses are nested JSON; I extract identifiers (`id`, `name`), physical fields (`height`, `weight`), progression (`base_experience`), type labels (`primary_type`, `secondary_type`), and six base stats, then engineer `total_stats` as the row-wise sum of those stats. Section 2 documents the shape of the result: 150 rows, 14 columns, with missing values concentrated in `secondary_type` because many Pokémon are single-type—I treat those nulls as structurally valid, not errors to impute away. Before analysis I use `head()`, `info()`, and `isnull().sum()` to confirm types and spot patterns; for Question 3 I bin `id` into thirds with `pd.cut` to create `iconic_group` (IDs 1–50, 51–100, 101–150). That pipeline—API JSON → flat records → typed DataFrame → derived columns for the questions I actually asked—is the core data-handling story of MP1.

---

## C4: API use

MP1 demonstrates **C4 (API use)** because the entire dataset is retrieved programmatically from a public web API rather than from a pre-downloaded CSV. I use the PokéAPI base URL (`https://pokeapi.co/api/v2/pokemon/{id}`) and `requests` to fetch all 150 species, handling HTTP status and timeouts so a failed call does not silently corrupt the table. Each response is parsed as JSON in Python; I map API field names and list indices to column names my analysis expects. That mirrors real API work: the schema lives on the server, the client must know which keys to read, and the analyst must decide how nested structures become tabular columns. MP1 also makes the data provenance explicit in Section 1 (source link, fields collected, scope limited to original 150), so anyone reading the notebook knows exactly what was pulled and how.

---

## C5: Visualization

MP1 demonstrates **C5 (Visualization)** because Section 4 pairs each research question with a purpose-built, labeled Plotly figure—not generic charts, but chart types chosen to match the question.

For **Question 1** (size, weight, and speed by type), I use a **log-scaled scatter** of weight versus speed, with height as marker size and primary type as color. That layout surfaces the overall negative association between weight and speed while showing that slopes and clusters differ by type—supporting the Section 3 finding that body size alone does not explain speed everywhere.

For **Question 2** (which stat is most tied to primary type), I use a horizontal **bar chart** of η² by base stat so the ranking is immediately readable; special attack ranks highest in this sample, while HP is comparatively weakly explained by type.

For **Question 3** (early Pokédex IDs vs overall power), I use a **box plot** of `total_stats` by `iconic_group` with all points overlaid, so readers see spread and outliers—not just a median line—when comparing groups of 50 Pokémon each.

Each figure has a finding-oriented title, labeled axes, a static PNG export for GitHub viewing, and a short chart-rationale note explaining why that chart type fits the question.

---

## C7: Critical evaluation and professional judgment

MP1 demonstrates **C7 (Critical evaluation and professional judgment)** because I interpret results with explicit assumptions and limits, and I separate what the data supports from what would need richer evidence. For Question 1, I report a weak-to-moderate negative correlation between weight/height and speed at the full-dataset level but note substantial heterogeneity by type—I do not claim “small Pokémon are always fast.” For Question 2, η² and a specialization index show that type carries structural information about stat profiles, but I frame that as design-relevant patterning, not a rule that every species of a type must match its average. For Question 3, I use Pokédex ID as a **proxy** for iconicity, which is imperfect: low ID correlates with early-game prominence, not direct measures of fame or player attachment. I report group means, Cohen’s *d*, and a permutation *p*-value for the contrast between the lowest and highest ID thirds, then caution that ID order may confound other design factors. Section 5 ties those threads together so a reader knows which takeaways are supported in this 150-species, base-stat-only slice versus what would need cross-generation data, popularity metrics, or causal modeling next. That habit—state the assumption, show the evidence, name the boundary—is the professional judgment MP1 is meant to practice.

---

## How the domains connect in one flow

MP1 is not five separate exercises. **C4** brings data in from PokéAPI; **C3** turns it into a clean, documented DataFrame; **C2** is what lets me trust and explain the pandas in Section 3; **C5** makes each analytical answer visible to someone who will not read every cell; **C7** is what keeps the notebook honest about proxies, scope, and interpretation. Together, that is my Week 6 competency claim for Mini Project 1.
