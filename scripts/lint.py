#!/usr/bin/env python3
"""Dependency-free lint checks for the repository's Python and JSON files."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IGNORED_PARTS = {
    ".git",
    ".pytest_cache",
    ".venv",
    "__pycache__",
    "dist",
    "node_modules",
}
MAX_LINE_LENGTH = 100


def source_files() -> list[Path]:
    return sorted(
        path
        for path in ROOT.rglob("*.py")
        if not IGNORED_PARTS.intersection(path.relative_to(ROOT).parts)
    )


def lint_python(path: Path) -> list[str]:
    source = path.read_text(encoding="utf-8")
    relative = path.relative_to(ROOT)
    errors: list[str] = []

    try:
        compile(source, str(relative), "exec")
    except SyntaxError as exc:
        return [f"{relative}:{exc.lineno}: syntax error: {exc.msg}"]

    if source and not source.endswith("\n"):
        errors.append(f"{relative}: missing final newline")

    for number, line in enumerate(source.splitlines(), 1):
        if len(line) > MAX_LINE_LENGTH:
            errors.append(f"{relative}:{number}: line exceeds {MAX_LINE_LENGTH} characters")
        if line != line.rstrip():
            errors.append(f"{relative}:{number}: trailing whitespace")
        if "\t" in line:
            errors.append(f"{relative}:{number}: tab character")

    return errors


def lint_json(path: Path) -> list[str]:
    relative = path.relative_to(ROOT)
    try:
        json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        return [f"{relative}: invalid JSON: {exc}"]
    return []


def main() -> int:
    python_files = source_files()
    json_files = [
        ROOT / "apps/web/package.json",
        ROOT / "apps/web/tsconfig.json",
    ]
    errors = [error for path in python_files for error in lint_python(path)]
    errors.extend(error for path in json_files for error in lint_json(path))

    if errors:
        for error in errors:
            print(error, file=sys.stderr)
        print(f"lint failed with {len(errors)} error(s)", file=sys.stderr)
        return 1

    print(f"lint passed: {len(python_files)} Python files, {len(json_files)} JSON files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
