# Matchly AI Smart Match Engine - Scoring Formula

Matchly AI calculates a transparent composite compatibility score out of 100 based on five configurable parameters:

$$ \text{Final Match Score} = (W_{req} \times S_{req}) + (W_{sem} \times S_{sem}) + (W_{exp} \times S_{exp}) + (W_{pref} \times S_{pref}) + (W_{edu} \times S_{edu}) $$

## Default Weights Configuration (`backend/app/config.py`)

| Component | Default Weight | Description |
| :--- | :--- | :--- |
| **Required Skills ($S_{req}$)** | **40%** (0.40) | Core mandatory qualifications matching. Full credit for exact matches, 50% credit for partial semantic matches. |
| **Semantic Similarity ($S_{sem}$)** | **25%** (0.25) | Dense vector cosine similarity of experience vs. responsibilities and summary vs. overview. |
| **Experience Match ($S_{exp}$)** | **20%** (0.20) | Comparison between minimum target years required and candidate detected experience. |
| **Preferred Skills ($S_{pref}$)** | **10%** (0.10) | Bonus technologies and secondary qualifications. |
| **Education Match ($S_{edu}$)** | **5%** (0.05) | Academic credential validation (Degree level and relevant discipline). |

## Skill Classification

- **MATCHED**: Canonical skill appears directly in resume, OR cosine similarity to candidate experience $\ge 0.70$.
- **PARTIAL**: Cosine similarity to candidate experience is between $0.35$ and $0.70$, or shares canonical domain taxonomy.
- **MISSING**: No relevant skill or domain context found ($< 0.35$ similarity).

## Match Index Tiers

- **80% - 100%**: Strong Match (Green)
- **60% - 79%**: Good Match (Blue)
- **40% - 59%**: Moderate Match (Amber / Orange)
- **0% - 39%**: Low Match (Red)
