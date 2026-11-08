# AeroSec Lab

A single-file, offline-first browser CTF platform for space, aviation, and maritime cybersecurity.
Open `aerosec-lab.html` in any modern browser — no server, no dependencies, works from `file://` and Android Chrome.

- 79 procedurally generated challenges across 13 tracks (astrodynamics, ADCS, comms/RF, PNT & GNSS, ground-segment tabletops, exploitation, NIST 800-53 controls, ADS-B).
- Every challenge is mapped to the Aerospace Corporation **SPARTA** framework (technique IDs, countermeasures, NRS methodology links) with honest out-of-scope notes where SPARTA does not apply.
- Fact-checked Hands-On Extensions (online resources, Docker reproductions, hardware options) with per-citation `fact_check_status`.
- Build id and ship-time UTC are stamped in the file header, in `BUILD_ID`/`BUILD_UTC`, and in an on-screen badge.

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

## Release checks

```
node tools/playtest.js aerosec-lab.html   # engine/verify regression (438 checks) + index.html drift guard
node tools/ux-smoke.js index.html         # real-browser UX smoke: load, routing, links, mobile nav, legacy + tabletop pass
```
