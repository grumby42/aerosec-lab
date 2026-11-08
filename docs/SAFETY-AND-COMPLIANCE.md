# Safety, Legal & Compliance Reference

*AeroSec Lab companion document · for app build AS-29.23 · stamped 2026-11-08T19:39Z (UTC)*

This lab is for authorized education and research only. It is not affiliated with or
endorsed by RTCA, EUROCAE, EASA, IACS, BIMCO, NASA, The Aerospace Corporation,
DEF CON, or any vendor named in this repository.

---

## 1. RF bright line — no over-the-air transmission

**Every exercise in this lab runs entirely in software.** Nothing here requires a radio,
and nothing should ever be transmitted over the air.

- **Receive and decode: fine.** Listening to ADS-B (1090 MHz), AIS (161.975 / 162.025 MHz),
  or satellite downlinks with a receive-only SDR is a normal hobbyist and research activity.
- **Transmit: software loopback only.** Any "inject", "spoof" or "replay" exercise is done in
  software, for example a GNU Radio file or ZMQ source/sink, or by generating frames
  into a file or virtual interface.
- **Never transmit** on 1090 / 978 MHz, AIS VHF, GNSS bands, aeronautical VHF voice
  (118–137 MHz), or any other aeronautical or maritime safety frequency. An amateur radio
  licence does not change this, because these bands sit outside the amateur allocations.

Unauthorized transmission on these bands can break U.S. law, including:

| Provision | Subject |
|---|---|
| 47 U.S.C. § 301 | Station licence required to transmit |
| 47 U.S.C. § 333 | Willful or malicious interference |
| 47 CFR Part 87 / Part 80 | Aviation and maritime (incl. AIS) station rules and certified equipment |
| 18 U.S.C. § 32 | Interfering with air navigation facilities |
| 18 U.S.C. § 1367 | Interference with satellite operation |

GNSS and other jammers are illegal to operate, market or sell in the U.S.
([FCC jammer enforcement](https://www.fcc.gov/general/jammer-enforcement)). Other
countries have equivalent rules.

> Advanced, optional: some professional labs use a cabled SDR transmitting into a dummy
> load or attenuators inside a shielded enclosure. Leakage is easy to get wrong, so this lab
> does not require it and does not provide instructions for it.

---

## 2. Compliance frameworks referenced

Everything below is a paraphrased summary. No standard text is reproduced here. Read
the primary documents themselves; several of them are sold, not free.

### Aviation
- **RTCA DO-326A / EUROCAE ED-202A** — *Airworthiness Security Process Specification*.
  Companions: **DO-356A / ED-203A** (methods and considerations) and **DO-355A / ED-204A**
  (continuing airworthiness). EASA recognizes this set as an acceptable means of
  compliance through **AMC 20-42**.

### Maritime
- **IACS UR E26 Rev.1** (cyber resilience of ships) and **UR E27 Rev.1** (cyber resilience of
  on-board systems and equipment). These are classification-society requirements for
  **new ships contracted for construction on or after 1 July 2024**. They do not apply to
  existing ships.
- **The Guidelines on Cyber Security Onboard Ships, Version 5 (14 Nov 2024)**, produced by
  a joint industry group that includes BIMCO, ICS, INTERCARGO, INTERTANKO, OCIMF,
  IUMI and others.

### Space
- **The Aerospace Corporation SPARTA** — the technique and countermeasure IDs used
  throughout the lab's challenges.

---

## 3. Data and trademarks

- **Recorded RF data.** Record your own IQ data with a receive-only SDR, or use sample files
  that ship with open-source decoder projects. Check each file's licence before you
  redistribute it. Aggregator services generally share *decoded* feeds under their own
  terms, not raw IQ.
- **Trademarks.** All product and event names (HackRF, PCAN, Saleae, FlightAware, ADSBHub,
  Hack-A-Sat, DEF CON, etc.) are trademarks of their respective owners. No logos or
  insignia are used.
- **Estimates.** Any prices or effort figures in this repository are the author's approximate
  estimates, in USD, dated when written. They will drift.

---

*Sources:*
[FCC jammer enforcement](https://www.fcc.gov/general/jammer-enforcement) ·
[47 CFR 87.145](https://www.law.cornell.edu/cfr/text/47/87.145) ·
[18 U.S.C. § 1367 (DOJ)](https://www.justice.gov/jm/criminal-resource-manual-1065-interference-operation-satellite-18-usc-1367) ·
[18 U.S.C. § 32](https://codes.findlaw.com/us/title-18-crimes-and-criminal-procedure/18-usc-sect-32.html) ·
[EASA AMC 20 (AMC 20-42)](https://www.easa.europa.eu/en/document-library/easy-access-rules/online-publications/easy-access-rules-acceptable-means?page=21) ·
[IACS UR E26 Rev.1](https://iacs.s3.af-south-1.amazonaws.com/wp-content/uploads/2022/02/04140503/UR-E26-Rev.1-Nov-2023-CR.pdf) ·
[MarineLink — IACS revised URs](https://marinelink.com/news/iacs-enhances-cyber-safety-unified-508443) ·
[INTERCARGO — Guidelines v5](https://intercargo.org/guidelines-cyber-security-onboard-ships)
