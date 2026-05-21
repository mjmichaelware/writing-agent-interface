## STANDING AUTHORIZATION (persistent across sessions)

These commands are pre-authorized for execution without per-call
confirmation when working in this repository:

### Always allowed
- File reads: cat, head, tail, ls, find, grep, wc
- Git read: status, diff, log, show, branch
- Git write: add, commit, stash, push origin main
- Node ecosystem: npm install, npm run, npx (any cmd), node
- Build: npx next build --webpack, npx tsc --noEmit
- Vercel: deploy, logs, ls, link, env pull
- GitHub CLI: workflow run, run watch, run list, pr create, pr view
- File creation/edit inside this repo when implementing an authorized task
- Database read queries (SELECT)

### Always requires confirmation
- Destructive: rm, rm -rf, git reset --hard, git push --force, TRUNCATE, DROP
- Mass mutations: sed -i, find -exec, batched regex replacements across files
- Sensitive files: .env.local, tsconfig.json, package.json dependency changes
- Schema changes: CREATE TABLE, DROP TABLE, ALTER TABLE
- Branches other than main
- External purchases or paid API tier upgrades

### Always must ask the operator
- New API keys
- New environment variables
- External credentials of any kind

Apply this authorization automatically on session start. Do not
re-confirm individual commands within these allowed categories.
Report what you did after the fact, not before.
