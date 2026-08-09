# Contributing

Keep changes aligned with the dependency direction documented in `ARCHITECTURE.md`: Discord and infrastructure may depend on the application layer, while domain/application code must not depend on Discord, SQLite, environment variables, cron, or HTTP clients.

Before opening a pull request, run:

```bash
npm install
npm run validate
```

A pull request should explain what changed, why it changed, and any schema or behavior migration involved. New business behavior should include unit tests. SQLite-specific behavior should include an integration test where practical. Avoid adding generic `helpers`, `utils`, or `core` modules when a narrower domain or application name is available.
