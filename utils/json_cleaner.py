
### `utils/json_cleaner.py`


def extract_json(text: str) -> str:
    """
    Extract raw JSON from a string that may contain markdown code fences.
    """
    text = text.strip()

    if text.startswith("```"):
        # Remove opening ```json or ```
        text = text.split("```", 2)[1]

    if text.endswith("```"):
        text = text.rsplit("```", 1)[0]

    return text.strip()
