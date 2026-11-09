# Parallel sessions — how to work this repo without conflicts

Two sessions work this repo at once. The app is a **single 1.9 MB file**, so concurrent
edits to it conflict every time: every build restamps the same header / `BUILD_ID` lines
and every new engine is spliced at the same anchor (`const App = {`). These rules keep
the sessions from colliding. Read this before touching `aerosec-lab.html`.

## 1. Who edits the app file

**Exactly one session edits `aerosec-lab.html` / `index.html` at a time — the "app owner".**
Right now the app owner is the depth/security session (release gates, capstones, UX).
Any other session contributes app content **without editing the app file**:

- Author new content as a self-contained JS insert block in `contrib/<name>.js`
  (engine → `CHALLENGES['id']`, plus `META`, `SPARTA_TAGS`, `COMPLIANCE`,
  `HANDS_ON_EXTENSION` entries, and the `TRACKS` / `CATALOG` rows to add, in a
  comment header). `tools/` already shows the pattern.
- The app owner splices it in, runs the gates, stamps the build, and syncs `index.html`.
- This is how every track since AS-29.18 was built; it adds zero merge risk.

Hand-off of app ownership is explicit (say so in a commit message); never assumed.

## 2. Build stamp

Only the app owner increments `AS-29.x` and rewrites `BUILD_ID` / `BUILD_UTC`. A
companion doc may *reference* the build it was written against (`for app build AS-29.23`);
it must not restamp the app.

## 3. Shared files

- `README.md` — sectioned ownership. Add or edit your own section; don't rewrite others'.
  Git merges disjoint sections cleanly.
- `docs/` — docs session owns. `tools/` — app owner owns.

## 4. Before every push (both sessions)

```
git fetch origin main && git rebase origin/main     # never force-push
node tools/playtest.js aerosec-lab.html             # if you touched the app
node tools/ux-smoke.js index.html                   # if you touched the app
node tools/security-gate.js                         # if you touched the app
cmp aerosec-lab.html index.html                     # index.html must be byte-identical
```

A push rejected with "fetch first" means the other session shipped: rebase, re-run the
gates, push again. Don't resolve a conflict inside `aerosec-lab.html` by hand — if you hit
one, you edited the app without being the owner; back out and use `contrib/`.

## 5. Product direction (so the sessions don't pull apart)

The owner has set **depth over breadth** for the app: no new entry-level drills; new work
raises the difficulty ceiling (capstones, chained scenarios). Roadmap items that add new
tracks (maritime bus, avionics databus) are breadth and need the owner's explicit go-ahead
before they become app content — until then they belong in `docs/` and `contrib/`.
