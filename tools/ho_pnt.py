# PNT & GNSS Integrity Hands-On Extensions — DETECTION/ANALYSIS framing throughout.
# These teach recognizing and defending against GNSS interference, not producing it.
V='2026-11-01'
def esc(s): return s.replace("\\","\\\\").replace("'","\\'")

entries = {
 'pnt-001': {  # jamming vs spoofing
  'online':[
   ('GPSJAM — daily global GPS interference map (ADS-B derived)','https://gpsjam.org/','free','See real jamming/degradation worldwide, updated daily from aircraft navigation-integrity reports. The operational picture behind this drill.'),
   ('gpsd — GPS daemon with NMEA/clock monitoring','https://gpsd.gitlab.io/gpsd/','free','Read a receiver\'s live fix quality, satellite count and C/N0 — the exact signature fields this drill asks you to classify.'),
   ('NIST IR 8323r1 — Foundational PNT Profile','https://nvlpubs.nist.gov/nistpubs/ir/2023/NIST.IR.8323r1.pdf','free','The U.S. government profile for responsible PNT use: how to detect, respond to, and build resilience against GNSS disruption. The doctrine behind the drill.'),
  ],
  'docker':[
   ('gpsd in a container reading a receiver','https://gpsd.gitlab.io/gpsd/','apt/docker install gpsd; attach a USB GPS','Monitor live fix integrity. Needs a cheap USB GPS receiver.'),
  ],
  'hardware':[
   ('u-blox GNSS receiver (e.g. u-blox 8/9) via USB','Watch live C/N0, SV count and integrity flags; u-blox reports jamming/spoofing indicator flags','$20-$100','u-blox NEO-M8/M9 USB dongles','Modern u-blox receivers expose jamming and spoofing detection flags in their protocol — the hardware embodiment of this drill\'s classification task.'),
  ],
  'cites':[
   ('tool','GPSJAM — GPS interference map','John Wiseman','https://gpsjam.org/',2024,'partial','Well-known public interference map derived from ADS-B NIC/NACp; URL asserted from prior knowledge.','partial'),
   ('standard','NIST IR 8323r1 — Foundational PNT Profile','NIST','https://nvlpubs.nist.gov/nistpubs/ir/2023/NIST.IR.8323r1.pdf',2023,'partial','Authoritative U.S. PNT resilience profile; standard established, PDF not re-fetched this turn.','partial'),
  ],
  'vnote':'Detection/analysis only. These tools read and classify a receiver\'s own integrity signature — the defender\'s view. No signal generation.',
 },
 'pnt-002': {  # RAIM
  'online':[
   ('RTKLIB — open-source GNSS positioning & integrity','https://www.rtklib.com/','free','Post-process raw GNSS observations and inspect residuals — the real version of the RAIM residual analysis this drill teaches by hand.'),
   ('RTCA DO-229 / ARAIM references (aviation RAIM)','https://www.rtca.org/','free','The aviation MOPS that certify RAIM/ARAIM for approach guidance. Why residual-based integrity monitoring is a safety-of-life requirement.'),
  ],
  'docker':[
   ('RTKLIB (rnx2rtkp) in a container','https://github.com/tomojitakasu/RTKLIB','build RTKLIB; run rnx2rtkp on public RINEX','Compute positions and residuals from public reference-station data. Offline after data download.'),
  ],
  'hardware':[
   ('Multi-constellation GNSS receiver with raw-measurement output','Feed real pseudoranges into RAIM residual analysis','$30-$150','u-blox ZED-F9P (raw/RTK), or any RINEX-logging receiver','Raw measurements let you reproduce residual-based exclusion on real data — redundancy is what makes RAIM work.'),
  ],
  'cites':[
   ('tool','RTKLIB — open-source GNSS program package','T. Takasu','https://www.rtklib.com/',2024,'partial','Long-established open-source GNSS toolkit; URL asserted from prior knowledge.','partial'),
  ],
  'vnote':'Detection/engineering: RAIM is a receiver-integrity defense. Tooling here computes residuals from real or public data to exclude a bad measurement.',
 },
 'pnt-003': {  # time spoof
  'online':[
   ('NIST time services & holdover guidance','https://www.nist.gov/pml/time-and-frequency-division','free','Why disciplined time with holdover (OCXO/rubidium/chip-scale atomic) is the defense against a slow clock walk.'),
   ('gpsd — PPS/time monitoring','https://gpsd.gitlab.io/gpsd/gpsd-time-service-howto.html','free','Watch GNSS-disciplined time and detect divergence from a holdover reference — the detection side of this drill.'),
  ],
  'docker':[
   ('chrony + gpsd time-monitoring stack','https://chrony-project.org/','apt install chrony gpsd','Compare GNSS time against a local holdover oscillator and alarm on drift. Needs a GPS/PPS source.'),
  ],
  'hardware':[
   ('GNSS timing receiver with PPS + a disciplined oscillator','Detect a timing walk by comparing GNSS time to holdover','$50-$300','u-blox timing modules; chip-scale atomic clock (CSAC) for holdover','The physical defense: when GNSS time walks, a good holdover clock reveals the divergence this drill quantifies.'),
  ],
  'cites':[
   ('standard','NIST IR 8323r1 — Foundational PNT Profile (timing resilience)','NIST','https://nvlpubs.nist.gov/nistpubs/ir/2023/NIST.IR.8323r1.pdf',2023,'partial','Authoritative; not re-fetched this turn.','partial'),
  ],
  'vnote':'Detection/analysis: compare GNSS-derived time against an independent holdover source to catch a gradual walk. No spoofing is performed.',
 },
 'pnt-004': {  # cross-domain root cause
  'online':[
   ('GPSJAM (aviation) + MarineTraffic/AIS anomaly feeds','https://gpsjam.org/','free','Correlate GNSS interference with the aviation (ADS-B) and maritime (AIS) effects this drill separates by root cause.'),
   ('DHS / CISA PNT resilience resources','https://www.cisa.gov/topics/cybersecurity-best-practices/space-systems','free','Cross-sector guidance: the same PNT attack shows up differently in aviation, maritime and space.'),
  ],
  'docker':[
   ('dump1090 (ADS-B) + gpsd — observe real cooperative-surveillance anomalies','https://github.com/flightaware/dump1090','docker run dump1090 with an RTL-SDR','See ADS-B message behavior and GNSS fix behavior side by side (receive-only). Needs an RTL-SDR.'),
  ],
  'hardware':[
   ('RTL-SDR (ADS-B 1090 MHz, AIS 162 MHz) + GNSS receiver','Observe message-spoof vs position-spoof vs jamming signatures in real feeds','$30-$80','RTL-SDR Blog V4 + u-blox GNSS','Receive-only. Watch cooperative-surveillance and GNSS integrity at once to practice root-cause separation.'),
  ],
  'cites':[
   ('tool','dump1090 — ADS-B receiver/decoder','FlightAware','https://github.com/flightaware/dump1090',2024,'partial','Widely-used open-source ADS-B decoder; owner/path from prior knowledge.','partial'),
  ],
  'vnote':'Detection/analysis across domains using receive-only tooling. Teaches attribution, not attack.',
 },
 'pnt-005': {  # AoA
  'online':[
   ('CRPA / antenna-array anti-spoof background (GPS World, academic)','https://www.gpsworld.com/','free','How controlled-reception-pattern antennas and arrays reject signals by direction — the physical-layer defense this drill models.'),
   ('GNSS-SDR — open-source GNSS software receiver','https://gnss-sdr.org/','free','A research receiver whose architecture supports experimenting with multi-antenna and signal-quality monitoring for spoof detection.'),
  ],
  'docker':[
   ('GNSS-SDR in Docker (receiver/analysis)','https://github.com/gnss-sdr/gnss-sdr','docker pull gnsssdr/gnss-sdr','Run a software GNSS receiver on public IQ recordings to study signal-quality and acquisition anomalies. Offline after data.'),
  ],
  'hardware':[
   ('Multi-element GNSS antenna / CRPA (research)','Reject spoofed signals by angle-of-arrival','$100-$$$','Research CRPA arrays; dual-antenna u-blox for heading','The hardware behind this drill: a single spoofer antenna betrays itself by common bearing; an array separates real satellites by direction.'),
  ],
  'cites':[
   ('tool','GNSS-SDR — open-source GNSS software receiver','C. Fernández-Prades et al.','https://gnss-sdr.org/',2024,'verified','Confirmed this session; open-source software GNSS receiver.','verified'),
  ],
  'vnote':'Detection/engineering: angle-of-arrival and signal-quality monitoring are receiver-side anti-spoof defenses. Tooling is receive/analysis.',
 },
}

def block(cid, e):
    o=["HANDS_ON_EXTENSION['%s'] = {" % cid, "  online: ["]
    for n,u,c,notes in e['online']:
        o.append("    { name: '%s', url: '%s', cost: '%s', verified: '%s', notes: '%s' }," % (esc(n),esc(u),c,V,esc(notes)))
    o.append("  ],"); o.append("  docker: [")
    for n,u,bs,notes in e['docker']:
        o.append("    { name: '%s', url: '%s', verified: '%s', build_steps: '%s', requires_internet: false, notes: '%s' }," % (esc(n),esc(u),V,esc(bs),esc(notes)))
    o.append("  ],"); o.append("  hardware: [")
    for d,r,cost,ven,notes in e['hardware']:
        o.append("    { device: '%s', role: '%s', approx_cost_usd: '%s', vendor_examples: '%s', notes: '%s' }," % (esc(d),esc(r),esc(cost),esc(ven),esc(notes)))
    o.append("  ],"); o.append("  citations: [")
    for t,title,auth,u,yr,ver,rel,fc in e['cites']:
        yv='null' if yr is None else str(yr)
        o.append("    { type: '%s', title: '%s', author: '%s', url: '%s', year: %s, verified: '%s', relevance: '%s', fact_check_status: '%s' }," % (t,esc(title),esc(auth),esc(u),yv,V,esc(rel),fc))
    o.append("  ],"); o.append("  verification_notes: '%s'," % esc(e['vnote'])); o.append("};")
    return "\n".join(o)

out = "\n// ── Hands-On Extensions: PNT & GNSS Integrity (detection/analysis tooling) ───────\n"
out += "\n".join(block(k,v) for k,v in entries.items()) + "\n"
open('tools/_pnt_block.js','w').write(out)
print("pnt block bytes:", len(out), "entries:", len(entries))
