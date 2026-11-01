// ═══════════════════════════════════════════════════════════════════════════════
// DETECTION ENGINEERING TRACK (queue item 6) — SpaceCOP-style onboard monitoring.
// SPARTA v4.0 shipped SpaceCOP (DHS S&T funded, open-source for NASA cFS): it turns
// SPARTA Indicators of Behavior into onboard detections of command rate, message-ID
// allowlists, command parameters, timing and resource use. This drill teaches the
// analyst half: read an onboard command/telemetry log and name the IOB that fired.
// ═══════════════════════════════════════════════════════════════════════════════
CHALLENGES['det-001'] = {
  name: 'Onboard IOB Detection',
  generate(seed) {
    const rng = mkRng(seed);
    const kinds = ['RATE', 'ALLOWLIST', 'WINDOW', 'PARAM'];
    const kind = rng.choice(kinds);
    const allow = [0x1801, 0x1803, 0x1806, 0x180A, 0x1812];
    const names = { 0x1801: 'HK_REQ', 0x1803: 'ADCS_MODE', 0x1806: 'PAYLOAD_CTRL', 0x180A: 'THERM_SETPT', 0x1812: 'TLM_RATE' };
    const contactStart = rng.int(10, 20), contactEnd = contactStart + rng.int(12, 18); // ticks
    const N = 60;
    const rows = [];
    const anomTick = rng.int(contactStart + 2, contactEnd - 2);
    let detail = '';
    for (let t = 0; t < N; t++) {
      const inWin = t >= contactStart && t <= contactEnd;
      // baseline: during contact, ~1 cmd every 2-3 ticks; outside, none
      const base = inWin && rng.next() < 0.45;
      if (base) {
        const mid = rng.choice(allow);
        let p = mid === 0x180A ? rng.int(15, 30) : mid === 0x1812 ? rng.int(1, 8) : rng.int(0, 3);
        rows.push({ t, mid, name: names[mid], p, n: 1 });
      }
    }
    // inject the anomaly
    if (kind === 'RATE') { // burst of 9 identical commands in one tick
      const mid = 0x1803; rows.push({ t: anomTick, mid, name: names[mid], p: 1, n: 9 }); detail = `9 ADCS_MODE commands arrive in a single tick (baseline is ≤1 command per tick).`;
    } else if (kind === 'ALLOWLIST') { // unknown message id
      const mid = 0x18F7; rows.push({ t: anomTick, mid, name: 'UNKNOWN', p: 0, n: 1 }); detail = `A message ID that is not in the flight software's accepted command set.`;
    } else if (kind === 'WINDOW') { // valid command outside any contact window
      const t = rng.int(contactEnd + 5, N - 3); const mid = 0x1806; rows.push({ t, mid, name: names[mid], p: 1, n: 1 }); detail = `A valid, well-formed command arrives when no ground contact is scheduled.`;
    } else { // out-of-range parameter
      const mid = 0x180A; rows.push({ t: anomTick, mid, name: names[mid], p: 95, n: 1 }); detail = `THERM_SETPT carries a setpoint far outside its nominal 15–30 range.`;
    }
    rows.sort((a, b) => a.t - b.t);
    const anom = rows.find(r => (kind === 'RATE' && r.n === 9) || (kind === 'ALLOWLIST' && r.mid === 0x18F7) || (kind === 'WINDOW' && (r.t < contactStart || r.t > contactEnd)) || (kind === 'PARAM' && r.p === 95));
    let table = ' tick │ msgID  │ name          │ param │ count\n──────┼────────┼───────────────┼───────┼──────\n';
    rows.forEach(r => { table += ` ${String(r.t).padStart(4)} │ 0x${r.mid.toString(16).toUpperCase()} │ ${r.name.padEnd(13)} │ ${String(r.p).padStart(5)} │ ${String(r.n).padStart(4)}\n`; });

    const problem = `CHALLENGE: ONBOARD IOB DETECTION

An onboard monitor (SpaceCOP-style) watches the command stream against SPARTA
Indicators of Behavior. Four detection rules are armed:

  RATE      — more commands in one tick than the baseline allows (baseline ≤ 1/tick)
  ALLOWLIST — a message ID not in the accepted command set
              (accepted: 0x1801 0x1803 0x1806 0x180A 0x1812)
  WINDOW    — any command received outside a scheduled ground contact
              (scheduled contact: ticks ${contactStart}–${contactEnd})
  PARAM     — a command parameter outside its nominal range
              (THERM_SETPT nominal 15–30)

ONBOARD COMMAND LOG:

${table}
Exactly one rule should fire. Name the rule and the tick.

ANSWER: RULE,tick  (e.g. WINDOW,41)`;

    return {
      problem,
      exp: {
        ans: `${kind},${anom.t}`,
        check: (a) => {
          const m = String(a || '').toUpperCase().match(/(RATE|ALLOWLIST|ALLOW|WINDOW|PARAM)[^0-9]*(\d+)/);
          if (!m) return false;
          const k = m[1] === 'ALLOW' ? 'ALLOWLIST' : m[1];
          return k === kind && parseInt(m[2], 10) === anom.t;
        },
      },
      meta: { kind, tick: anom.t, contactStart, contactEnd, detail },
    };
  },
  hints: [
    'Check the four rules in order against every row: count per tick, message ID in the allowlist, tick inside the contact window, parameter in range.',
    'Most rows are baseline: one command per tick, known IDs, inside the window, sane parameters. Look for the single row that breaks one rule.',
    'A count > 1 in one tick → RATE. An unfamiliar hex ID → ALLOWLIST. A tick outside the contact window → WINDOW. A wild THERM_SETPT → PARAM.',
    'Report the rule name and the tick of that row, e.g. "PARAM,23".',
  ],
};

META['det-001'] = {
  brief: `Onboard monitoring is the newest layer of space defense: SpaceCOP (debuted with SPARTA v4.0 at DEF CON 34) turns SPARTA Indicators of Behavior into detections on the spacecraft itself. Read an onboard command log and name the rule that fires.<br><br><strong>Answer format:</strong> RULE,tick.`,
  debrief: `The shift SpaceCOP represents is from "trust the link" to "monitor the vehicle": even a perfectly authenticated command stream can carry an attack (KA-SAT, IA-0007.02), so the spacecraft watches command rate, message-ID allowlists, parameter ranges, timing against the contact schedule, and resource use. Aerospace's own caution applies: an anomaly alone does not establish attribution — mode, mission phase and history give it context. This drill is the analyst half of that loop; the engineering half is writing the rules against a flight-software message dictionary.`,
  objectives: ['Apply four IOB-style detection rules to an onboard command log', 'Distinguish rate, allowlist, timing-window and parameter anomalies', 'Connect onboard monitoring to SPARTA CM0034 and to valid-but-unauthorized commanding'],
  pass: 'Name the correct rule and tick.',
  fail: 'Flagging a baseline burst of two legitimate commands as RATE (baseline tolerates it), or missing that an out-of-window command is still well-formed.',
  concepts: ['onboard monitoring', 'SpaceCOP', 'Indicators of Behavior', 'allowlist', 'contact window', 'cFS'],
  tools: ['no external tools needed for this drill'],
  aegis: 'Walk the log row by row with the four rules. Only one row violates one rule. Answer RULE,tick.',
};

SPARTA_TAGS['det-001'] = {
  techniques: [
    { id: 'IA-0007.02', name: 'Malicious Commanding via Valid GS', tactic: 'Initial Access', tactic_id: 'ST0003', url: 'https://sparta.aerospace.org/technique/IA-0007/02/', status: 'verified', note: 'Onboard IOB monitoring is the defensive counterpart: it catches commanding that is authenticated but anomalous.' },
  ],
  countermeasures: [
    { id: 'CM0034', name: 'Monitor Critical Telemetry/Audit Logs', url: 'https://sparta.aerospace.org/countermeasures/CM0034/', status: 'partial' },
  ],
  note: 'SpaceCOP (SPARTA v4.0 / DEF CON 34, DHS S&T funded, open source for NASA cFS) operationalizes SPARTA IOBs as onboard detections — this drill trains reading those detections.',
};

COMPLIANCE['det-001'] = { posture: 'detection', frameworks: [{ id: 'SPARTA-CM0034', name: 'SPARTA CM0034: Monitor Critical Telemetry/Audit Logs', note: 'Onboard detection of anomalous commanding.' }, { id: 'NIST-800-53-SI-4', name: 'NIST 800-53 — SI-4: System Monitoring', note: 'Monitoring tailored to the space segment (onboard, store-and-forward).' }, { id: 'NIST-800-53-AU-6', name: 'NIST 800-53 — AU-6: Audit Record Review, Analysis, and Reporting', note: 'Reviewing the onboard command/audit log.' }], references: [{ type: 'article', title: 'Aerospace Corp — Experience the convergence of space and cyber threats at DEF CON 34 (SpaceCOP)', url: 'https://aerospace.org/kickstage/experience-convergence-space-and-cyber-threats-def-con-34', year: 2026 }, { type: 'article', title: 'SPARTA v4.0 — Breaking New Ground (SpaceCOP section)', url: 'https://medium.com/the-aerospace-corporation/sparta-v4-0-breaking-new-ground-b2d3b7ab832f', year: 2026 }] };
