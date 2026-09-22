# Changelog

## 0.3.0 — 2026-09-22

- Support current Copilot application-scoped telemetry settings through a shared local receiver and immutable window-to-project routing.
- Fix setup readback and accept Copilot SDK environment mirrors while rejecting conflicting destinations or content capture.
- Verify real Copilot Pro usage in two separate projects with GPT-5.6 Luna and GPT-5 mini.
- Move the public repository and release builds to GitHub.

## 0.2.0 — 2026-09-22

- USD usage value from Copilot-reported credits, with clearly marked token-price estimates when missing.
- Cost breakdowns by project, model and session, plus status bar and CSV export.
- Cache-read/write accounting, long-context prices and explicit partial coverage.
- Graphite and blue theme, simplified heading controls and removal of the header/footer copy.

## 0.1.0 — 2026-09-22

- Project-scoped Copilot Chat usage via a private local OTLP collector.
- Dashboard, sidebar, status bar, project comparison and session activity.
- Token/model breakdowns, 7/14/30-day filtering and CSV export.
- Explicit sample preview, privacy allowlist, duplicate suppression and incomplete-data reporting.
- Dark, light, high-contrast, keyboard and narrow-layout support.
