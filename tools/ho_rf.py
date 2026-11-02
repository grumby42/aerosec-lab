# Writes the RF Foundations Hands-On Extensions as a JS insert block.
# All receive/analysis tooling (no transmit). Written as data, not prose, to keep it tight.
V='2026-11-01'
def esc(s): return s.replace("\\","\\\\").replace("'","\\'")

entries = {
 'rf-001': {
  'online':[
   ('SDR++ — cross-platform SDR receiver (waterfall)','https://github.com/AlexandreRouma/SDRPlusPlus','free','Open-source receiver with a clear waterfall. Tune a local FM or the 137 MHz NOAA APT band and read band edges and center frequency against the display — the exact skill this drill teaches.'),
   ('gqrx — SDR receiver (Linux/macOS)','https://gqrx.dk/','free','Classic receive/analysis front end for RTL-SDR and friends; good for first-light waterfall reading.'),
   ('SatNOGS Network — browse real satellite observation waterfalls','https://network.satnogs.org/','free','Thousands of recorded pass waterfalls from a global receive-only ground-station network. Read real signals without any hardware.'),
  ],
  'docker':[
   ('GNU Radio in Docker — signal-processing toolkit','https://hub.docker.com/r/ghcr.io/gnuradio/gnuradio','gr clone + docker run; see wiki.gnuradio.org','Build the demodulate-and-decode chain yourself; the drill is the mental model, GNU Radio makes it executable. Offline once pulled.'),
  ],
  'hardware':[
   ('RTL-SDR receiver (RTL2832U) + wideband antenna','Receive real signals to read on a waterfall','$30-$60','RTL-SDR Blog V4 kit','Receive-only USB dongle — the standard first SDR. No transmit capability, which is the correct first tool for reading spectrum.'),
  ],
  'cites':[
   ('tool','SDR++','Alexandre Rouma','https://github.com/AlexandreRouma/SDRPlusPlus',2024,'verified','Open-source SDR receiver; confirmed this session.','verified'),
   ('project','SatNOGS / Libre Space Foundation','Libre Space Foundation','https://satnogs.org/',2024,'verified','Open-source receive-only ground-station network; confirmed this session.','verified'),
  ],
  'vnote':'All receive/analysis tooling. The drill (read center frequency off a waterfall) is fully in-browser; these extend it to real spectrum with a receive-only dongle.',
 },
 'rf-002': {
  'online':[
   ('GNU Radio — modulation building blocks','https://www.gnuradio.org/','free','ASK/FSK/PSK modulator and demodulator blocks let you generate and then identify each modulation, closing the loop on this drill.'),
   ('PySDR — "A Guide to SDR and DSP using Python" (Marc Lichtman)','https://pysdr.org/','free','Free online textbook covering modulation, IQ, and demodulation with runnable Python. The definitive free bridge from these drills to real DSP.'),
  ],
  'docker':[
   ('GNU Radio in Docker','https://wiki.gnuradio.org/index.php/Docker','docker pull per wiki','Run the modulation flowgraphs without a local install. Offline once pulled.'),
  ],
  'hardware':[
   ('RTL-SDR receiver','Observe real ASK/FSK/PSK signals (e.g. ADS-B is PPM, many IoT links are FSK)','$30-$60','RTL-SDR Blog V4','Receive-only. Identify real-world modulations against what the drill taught.'),
  ],
  'cites':[
   ('book','PySDR: A Guide to SDR and DSP using Python','Dr. Marc Lichtman','https://pysdr.org/',2024,'partial','Well-established free SDR/DSP textbook; URL asserted from prior knowledge, not re-fetched this turn.','partial'),
   ('tool','GNU Radio','GNU Radio project','https://www.gnuradio.org/',2024,'verified','Confirmed this session.','verified'),
  ],
  'vnote':'Fully in-browser drill; hardware is receive-only enrichment.',
 },
 'rf-003': {
  'online':[
   ('GNU Radio — symbol timing recovery (clock sync blocks)','https://wiki.gnuradio.org/index.php/Symbol_Sync','free','The real version of this drill: GNU Radio\'s Symbol Sync block recovers the symbol rate the way you estimated it by hand.'),
   ('PySDR — pulse shaping & synchronization chapter','https://pysdr.org/content/sync.html','free','Explains symbol rate, samples-per-symbol and timing recovery with runnable examples.'),
  ],
  'docker':[
   ('GNU Radio in Docker','https://wiki.gnuradio.org/index.php/Docker','docker pull per wiki','Experiment with samples-per-symbol vs symbol rate on real captures. Offline once pulled.'),
  ],
  'hardware':[
   ('RTL-SDR receiver','Capture a real burst and estimate its baud from the shortest run','$30-$60','RTL-SDR Blog V4','Receive-only.'),
  ],
  'cites':[
   ('book','PySDR — Synchronization','Dr. Marc Lichtman','https://pysdr.org/content/sync.html',2024,'partial','Established free resource; path asserted from prior knowledge.','partial'),
  ],
  'vnote':'Fully in-browser; extensions are receive/analysis only.',
 },
 'rf-004': {
  'online':[
   ('GNU Radio — line coding / differential blocks','https://wiki.gnuradio.org/index.php/Differential_Encoder','free','NRZI/differential and Manchester encode-decode as flowgraph blocks; verify your by-hand answers against them.'),
   ('PySDR — digital modulation & coding','https://pysdr.org/content/digital_modulation.html','free','Covers line coding and why self-clocking schemes (Manchester) matter for recovery.'),
  ],
  'docker':[
   ('GNU Radio in Docker','https://wiki.gnuradio.org/index.php/Docker','docker pull per wiki','Run encode/decode round-trips. Offline once pulled.'),
  ],
  'hardware':[
   ('No hardware required','Line coding is a pure bit-manipulation exercise','$0','N/A','Encode/decode is software-only; a receive-only SDR is optional to see coded signals in the wild.'),
  ],
  'cites':[
   ('standard','IEEE 802.3 — Manchester encoding (10BASE-T)','IEEE','',None,'partial','Universally established standard; no free canonical URL cited to avoid a broken link.','partial'),
  ],
  'vnote':'Software-only drill; no transmit tooling involved.',
 },
 'rf-005': {
  'online':[
   ('ccsdspy — read/parse CCSDS space packets in Python','https://github.com/CCSDSPy/ccsdspy','free','The capture-before-inject discipline is about understanding frame structure first. ccsdspy parses real CCSDS telemetry framing so you can reverse a format before reasoning about integrity.'),
   ('CCSDS 355.0-B — Space Data Link Security Protocol (SDLS)','https://public.ccsds.org/Pubs/355x0b2.pdf','free','The standard that defines the authentication, anti-replay and integrity the drill shows a naive replay failing against. This is the defensive answer to the whole exercise.'),
   ('Scapy — packet crafting & dissection (analysis)','https://scapy.net/','free','For reading and validating frame structure/checksums during analysis. The drill focuses on understanding the format, not transmitting.'),
  ],
  'docker':[
   ('ccsdspy via pip in any Python container','https://pypi.org/project/ccsdspy/','pip install ccsdspy','Parse CCSDS frames offline. Offline after install.'),
  ],
  'hardware':[
   ('No hardware required','Frame parsing and checksum reasoning are software-only','$0','N/A','This drill is analysis: parse a captured frame, understand sequence numbers and the integrity check. No transmit hardware is used or needed.'),
  ],
  'cites':[
   ('tool','ccsdspy — IO interface for CCSDS data in Python','CCSDSPy maintainers','https://github.com/CCSDSPy/ccsdspy',2024,'partial','Real, maintained library (referenced in the Hacker\'s SAT index); owner/path from prior knowledge.','partial'),
   ('standard','CCSDS 355.0-B — Space Data Link Security Protocol','CCSDS','https://public.ccsds.org/Pubs/355x0b2.pdf',2022,'partial','Authoritative CCSDS Blue Book for link-layer security; standard is established, specific PDF path not re-fetched this turn.','partial'),
  ],
  'vnote':'Analysis-focused: parse and understand frame structure and integrity. The lab deliberately teaches the defensive lesson (why anti-replay + integrity defeat a naive replay), consistent with the single-file, no-transmit design.',
 },
}

def block(cid, e):
    o=[]
    o.append("HANDS_ON_EXTENSION['%s'] = {" % cid)
    o.append("  online: [")
    for n,u,c,notes in e['online']:
        o.append("    { name: '%s', url: '%s', cost: '%s', verified: '%s', notes: '%s' }," % (esc(n),esc(u),c,V,esc(notes)))
    o.append("  ],")
    o.append("  docker: [")
    for n,u,bs,notes in e['docker']:
        o.append("    { name: '%s', url: '%s', verified: '%s', build_steps: '%s', requires_internet: false, notes: '%s' }," % (esc(n),esc(u),V,esc(bs),esc(notes)))
    o.append("  ],")
    o.append("  hardware: [")
    for d,r,cost,ven,notes in e['hardware']:
        o.append("    { device: '%s', role: '%s', approx_cost_usd: '%s', vendor_examples: '%s', notes: '%s' }," % (esc(d),esc(r),esc(cost),esc(ven),esc(notes)))
    o.append("  ],")
    o.append("  citations: [")
    for t,title,auth,u,yr,ver,rel,fc in e['cites']:
        yv = 'null' if yr is None else str(yr)
        o.append("    { type: '%s', title: '%s', author: '%s', url: '%s', year: %s, verified: '%s', relevance: '%s', fact_check_status: '%s' }," % (t,esc(title),esc(auth),esc(u),yv,V,esc(rel),fc))
    o.append("  ],")
    o.append("  verification_notes: '%s'," % esc(e['vnote']))
    o.append("};")
    return "\n".join(o)

out = "\n// ── Hands-On Extensions: RF Foundations (receive/analysis tooling) ───────────────\n"
out += "\n".join(block(k,v) for k,v in entries.items()) + "\n"
open('tools/_rf_block.js','w').write(out)
print("rf block bytes:", len(out), "entries:", len(entries))
