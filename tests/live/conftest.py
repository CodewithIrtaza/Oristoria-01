"""Load .env for live tests. Values are used but never printed or asserted on."""
from __future__ import annotations

from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]

load_dotenv(ROOT / ".env", override=False)
