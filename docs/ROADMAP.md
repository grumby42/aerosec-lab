# Roadmap — protocol gaps and hands-on options

*AeroSec Lab companion document · for app build AS-29.23 · stamped 2026-11-08T19:39Z (UTC)*

Read [SAFETY-AND-COMPLIANCE.md](SAFETY-AND-COMPLIANCE.md) first. Nothing in this roadmap
involves over-the-air transmission.

---

## 1. What the lab already covers

The current build has 83 challenges across 16 tracks. Space-segment and RF content is
already substantial: CCSDS framing, cFS and OpenC3 COSMOS commanding, GNU Radio
signal work, PNT/GNSS spoofing, and ADS-B security with dump1090. New work extends
those existing tracks rather than duplicating them.

## 2. Planned additions (gaps only)

| Priority | Addition | Why it's a gap |
|---|---|---|
| 1 | **Maritime bus & protocol track** | Almost no NMEA coverage and no CAN, IACS or Guidelines content in the current build |
| 2 | **Avionics databus extension** (to the ADS-B track) | No ARINC 429 or ARINC 664 Part 7 (AFDX) coverage; DO-326A is only touched lightly |
| 3 | **Cross-domain capstone** | No end-to-end ship → space → ground → aircraft scenario, and no Zeek-based traffic analysis |
| — | Link-budget work | Folded into the existing Comms track rather than a new track |

All three run in-browser or on plain Linux. None needs hardware.

### 2.1 Maritime track — planned scope
- **NMEA 0183:** ASCII sentences (for example GGA and RMC; AIS payloads arrive in `!AIVDM`
  sentences). The standard electrical layer is EIA-422, typically at 4800 baud, with
  38,400 baud for AIS. Practice uses a virtual serial pair from `socat`, with no adapter.
- **NMEA 2000:** CAN-based at 250 kbit/s, carrying data as PGNs. Practice uses Linux virtual
  CAN (`vcan`) with SocketCAN and `can-utils`. The N2K standard itself is proprietary,
  so exercises describe its structure without reproducing it.
- **IEC 61162-450:** IEC 61162-1 sentences carried over shipboard Ethernet in UDP multicast.
- **AIS decoding** from recorded files with [AIS-catcher](https://github.com/jvde-github/AIS-catcher),
  building on the lab's existing AIS content.
- **Governance:** IACS UR E26/E27 Rev.1 and the Guidelines on Cyber Security Onboard Ships
  (v5), mapped to the exercises.

### 2.2 Avionics databus extension — planned scope
- **ARINC 429:** a unidirectional, point-to-point avionics databus (one transmitter, multiple
  receivers). Exercises cover word structure (label, SDI, data, SSM, parity) as data only.
- **ARINC 664 Part 7 (AFDX):** deterministic avionics Ethernet with virtual links and redundant
  networks. *AFDX is an Airbus trademark.* Linux traffic shaping can only approximate it
  for learning, not emulate it, and it is not timing-accurate.
- **DO-326A / ED-202A:** a deeper walk through the airworthiness security process.

### 2.3 Cross-domain capstone — planned scope
A multi-hop scenario built on the maritime and avionics additions. The learner traces
one message through each segment, identifies trust boundaries, and analyzes the
captured traffic.

---

## 3. Free tools referenced

| Tool | Use | Note |
|---|---|---|
| [NASA cFS](https://github.com/nasa/cFS) | Flight software | Builds for Linux (pc-linux). No official NASA Docker image |
| [OpenC3 COSMOS](https://github.com/OpenC3/cosmos) | Ground C2 | Created at Ball Aerospace, now developed by OpenC3. Runs as Docker containers. Check its licence (OpenC3 Builder's License) |
| [cFS Basecamp](https://github.com/cfs-tools/cfs-basecamp) | Learning cFS | Successor to OpenSatKit. Uses its own Python GUI, not COSMOS |
| [dump1090](https://github.com/antirez/dump1090) | ADS-B decode | `--ifile` decodes recorded IQ. The repo ships a sample file, `testfiles/modes1.bin` |
| [AIS-catcher](https://github.com/jvde-github/AIS-catcher) | AIS decode | Accepts file input |
| GNU Radio | Signal processing | File or ZMQ loopback; no radio needed |
| Zeek, Suricata | Traffic analysis | Run in containers |
| Security Onion | Monitoring platform | Installs as an ISO/VM (uses Docker internally) |

**Recorded IQ data:** use the dump1090 sample file above, or record your own with a
receive-only SDR. Decoded-data aggregators do not publish raw IQ.

---

## 4. Optional hardware (receive and bench only)

*None of this is required. Prices are approximate, USD, checked Nov 2026, and they drift.*

| Item | Role | Approx. price |
|---|---|---|
| [RTL-SDR Blog V4](https://www.rtl-sdr.com/rtl-sdr-blog-v4-dongle-initial-release/) | Receive-only SDR (ADS-B, AIS, satellite downlinks) | ~$30–40 |
| [LimeSDR Mini 2.0](https://limemicro.com/sdr/limesdr-mini-2-0/) | Full-duplex, 1 TX / 1 RX; software and cabled use only | see vendor |
| [HackRF One](https://github.com/greatscottgadgets/hackrf/blob/master/docs/source/hackrf_one.rst) | **Half-duplex** SDR, 1 MHz–6 GHz; software and cabled use only | see vendor |
| [Ettus USRP B200 / B210](https://www.ettus.com/product-categories/USRP-Bus-Series/page/2/) | Lab-grade SDR | ~$1,460 / ~$2,390 |
| [PEAK PCAN-USB](https://gridconnect.com/products/can-usb-adapter-pcan-usb) | Physical CAN / NMEA 2000 bench | ~$256–314 |
| [Saleae Logic](https://www.tequipment.net/Saleae-pricelist/) | Bus inspection (UART, I²C, SPI, CAN) | ~$499–1,499 |
| Raspberry Pi 4 / 5 | Bench endpoint | from ~$35 / ~$45, rising with memory |
| [PyCubed](https://github.com/pycubed/hardware) | Open-source CubeSat avionics | You fabricate the boards yourself; cost varies |
| ARINC 429 interface | Physical avionics bus | Specialist vendors (e.g., Astronics Ballard Technology); quote-based |

---

*This roadmap is a statement of intent, not a delivery commitment.*
