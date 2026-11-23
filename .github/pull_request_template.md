## Checklist

- [ ] Fast tests pass (`<venv python> -m pytest -m "not live"`)
- [ ] Live check run for touched services (or marked pending in docs/STATUS.md)
- [ ] docs/STATUS.md updated
- [ ] No secrets in this diff (`.env` is never committed)
- [ ] Migrations reviewed (`migrations/NNN_name.sql` shown to the founder first)
