# Contributing

Issues and focused pull requests welcome.

Requirements: Node.js 22+ and npm.

```sh
npm ci
npm run check
npm run package
npm run preview
```

`npm run test:extension` runs an isolated VS Code smoke test against the packaged extension.

Use Conventional Commits. Hooversion maps `feat` to minor releases, `fix` and `perf` to patch releases, and `!` or a `BREAKING CHANGE:` footer to major releases. Other valid commit types do not publish a version. Keep pull requests small enough to review. Explain user-visible behavior, threat-model changes, and compatibility impact.

By contributing, you agree that your contribution is licensed under MIT.
