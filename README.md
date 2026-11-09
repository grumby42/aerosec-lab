# AeroSec Lab

A single-file, offline-first browser CTF platform for space, aviation, and maritime cybersecurity.
Open `aerosec-lab.html` in any modern browser — no server, no dependencies, works from `file://` and Android Chrome.

- 83 procedurally generated challenges across 16 tracks (astrodynamics, ADCS, comms/RF, PNT & GNSS, ground-segment tabletops, exploitation, NIST 800-53 controls, ADS-B).
- Every challenge is mapped to the Aerospace Corporation **SPARTA** framework (technique IDs, countermeasures, NRS methodology links) with honest out-of-scope notes where SPARTA does not apply.
- Fact-checked Hands-On Extensions (online resources, Docker reproductions, hardware options) with per-citation `fact_check_status`.
- Build id and ship-time UTC are stamped in the file header, in `BUILD_ID`/`BUILD_UTC`, and in an on-screen badge.

**Safety:** receive-and-decode only — no over-the-air transmission. See [docs/SAFETY-AND-COMPLIANCE.md](docs/SAFETY-AND-COMPLIANCE.md). Planned gap work: [docs/ROADMAP.md](docs/ROADMAP.md).

Author: Ted Gransbury · [grumbylearns.io](https://grumbylearns.io)

## Live demo (GitHub Pages)

Once Pages is enabled, the lab is playable in-browser at:
**https://grumby42.github.io/aerosec-lab/**

`index.html` is a byte-identical copy of `aerosec-lab.html` served at the Pages root,
and `.nojekyll` tells GitHub to serve the file untouched. To enable: repo **Settings →
Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / root**.

> Note: GitHub Pages is **public**. All challenge content and answer logic (client-side
> JavaScript) becomes world-readable. That is intended for a portfolio artifact; it means
> the lab is a teaching tool, not a scored/graded CTF.

## AI coach (AEGIS) — local only

The optional AI coach needs an Anthropic API key. **The public site never asks for one**:
the coach is enabled only when `aerosec-lab.html` is opened locally (`file://`). Locally, the
key is held in tab-scoped `sessionStorage`, sent only to `api.anthropic.com`, and a
Content-Security-Policy pins all network access to that host.

## Release checks

```
node tools/playtest.js aerosec-lab.html   # engine/verify regression (438 checks) + index.html drift guard
node tools/ux-smoke.js index.html         # real-browser UX smoke: load, routing, links, mobile nav, legacy + tabletop pass
node tools/security-gate.js               # public build never requests/stores an API key; CSP clean; local coach intact
```
