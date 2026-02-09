import json
from jsonschema import validate, ValidationError
from pathlib import Path


def load_schema(schema_name: str) -> dict:
    schema_path = Path("schemas") / schema_name
    with open(schema_path, "r") as f:
        return json.load(f)


def validate_json(instance: dict, schema_name: str):
    schema = load_schema(schema_name)
    validate(instance=instance, schema=schema)
