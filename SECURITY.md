# Security policy

## Supported versions

Security fixes target the latest `0.x` release until a newer minor line is published.

## Reporting a vulnerability

Use GitHub private vulnerability reporting or open a private GitHub Security Advisory for `openhoo/hoosage`. Do not publish exploit details in an issue.

Include affected version, operating system, VS Code version, minimal reproduction, impact, and any suggested mitigation. Expect acknowledgement within five business days. Release timing depends on severity and fix complexity.

Never include production credentials, private repository content, or personal data in a report.

## Local-first design

Hoosage is local-first: it binds a loopback-only OTLP listener on `127.0.0.1` and stores history under VS Code globalStorage. It never sends telemetry off-machine.
