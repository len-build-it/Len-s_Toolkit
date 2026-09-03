# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-09-03

### Fixed
- Version no longer hardcoded; reads dynamically from package.json
- `installRules()` no longer creates `.agents/rules/` when `.agents/` doesn't exist
- `.gitignore` now respects `--force` flag consistently
- `plan` command now respects `--force` flag to overwrite existing plans
- All filesystem operations now throw descriptive errors instead of raw stack traces
- Typo "Renses" → "Lenses" in council skill

### Added
- Comprehensive unit tests for all installer functions
- CLI integration tests
- Runtime Node.js version check (>=18.0.0)
- CHANGELOG.md

## [1.0.0] - 2026-09-03

### Added
- Initial release: Council, Implementation Plan, and Ponytail skill suite
- Interactive and non-interactive CLI (`--yes`, `--global`, `--force`)
- Agent rules: GEMINI.md, AGENTS.md, .cursorrules
- Dev configs: .editorconfig, .gitignore
