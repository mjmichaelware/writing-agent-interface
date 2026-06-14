# Termux Build Limitation — 2026-06-14

`npm run build` was attempted inside Termux after repository archive cleanup.

The build did not fail from missing archived files. It failed because Next.js 14.2.0 attempted to download:

`@next/swc-android-arm64@14.2.0`

and npm registry returned 404.

The package also declares Node engine `20.x`, while Termux currently has Node `v24.15.0`.

Conclusion:

- Treat local Termux `next build` as unsupported for this repo state.
- Use GitHub Actions / Ubuntu runner for build verification.
- Do not run `npm audit fix --force` as part of this cleanup.
