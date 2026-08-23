const limitationBox = {
  background: '#fdecea',
  border: '1px solid #e74c3c',
  borderRadius: '8px',
  padding: '12px 16px',
  marginTop: '12px',
}

const infoBox = {
  background: '#eaf2fd',
  border: '1px solid #3498db',
  borderRadius: '8px',
  padding: '12px 16px',
  marginTop: '12px',
}

export default function VpcProblems() {
  return (
    <section style={{ marginBottom: '50px' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px' }}>What VPC Can't Solve</h2>

      <style>
        {`
          @keyframes blinkRed {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
          .vpc-blocked { animation: blinkRed 1.4s ease-in-out infinite; }
          .vpc-active-pulse { animation: pulseGreen 2s ease-in-out infinite; }
          @keyframes pulseGreen {
            0%, 100% { stroke-width: 3; }
            50% { stroke-width: 5; }
          }
        `}
      </style>

      {/* ================= SECTION A: vPC/MLAG basics — ToR design ================= */}
      <h3>1. vPC / MLAG: Two Switches, One Logical Entity</h3>
      <p>
        vPC (Cisco) or MLAG (multi-vendor term) lets two physical switches behave as a{' '}
        <b>single logical switch</b>. A dedicated <b>peer-link</b> between the two switches
        synchronizes MAC tables and state, so both switches can forward for the same
        downstream device at the same time — without either of them thinking there's a loop.
      </p>
      <p>
        This is exactly why a typical Data Center rack is built Top-of-Rack (ToR): every
        bare metal server, Kubernetes node, and hypervisor is dual-homed to <b>both</b> ToR
        switches, and — because the pair behaves as one logical switch (a cluster) —{' '}
        <b>both uplinks stay active</b> at the same time. No STP blocking happens inside a
        single vPC pair.
      </p>

      <svg viewBox="0 0 900 480" style={{ width: '100%', maxWidth: '900px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
        <text x="10" y="25" fontSize="16" fill="#333">Typical DC Rack Layout — Top-Of-Rack</text>

        {/* ============ RACK 1 ============ */}
        <text x="130" y="55" fontSize="14" fill="#333">Rack#1</text>
        <rect x="30" y="65" width="290" height="390" rx="4" fill="none" stroke="#3498db" strokeWidth="3" />

        {/* ToR cluster box */}
        <rect x="42" y="75" width="266" height="90" rx="14" fill="#f3ecfb" stroke="#8e44ad" strokeWidth="2" />
        <rect x="55" y="88" width="240" height="30" rx="5" fill="#3498db" />
        <text x="120" y="108" fontSize="12" fill="#fff">ToR Switch1</text>
        <rect x="55" y="125" width="240" height="30" rx="5" fill="#3498db" />
        <text x="120" y="145" fontSize="12" fill="#fff">ToR Switch2</text>
        <line className="vpc-active-pulse" x1="175" y1="118" x2="175" y2="125" stroke="#8e44ad" strokeWidth="4" />

        {/* server rows rack1 */}
        <rect x="55" y="175" width="240" height="26" rx="4" fill="#2ecc71" />
        <text x="95" y="193" fontSize="11" fill="#fff">Bare Metal Server</text>
        <rect x="55" y="206" width="240" height="26" rx="4" fill="#2ecc71" />
        <text x="95" y="224" fontSize="11" fill="#fff">Bare Metal Server</text>
        <rect x="55" y="237" width="240" height="26" rx="4" fill="#2ecc71" />
        <text x="95" y="255" fontSize="11" fill="#fff">Bare Metal Server</text>

        <rect x="55" y="268" width="240" height="26" rx="4" fill="#f1c40f" />
        <text x="105" y="286" fontSize="11" fill="#333">Kubernetes Node</text>
        <rect x="55" y="299" width="240" height="26" rx="4" fill="#f1c40f" />
        <text x="105" y="317" fontSize="11" fill="#333">Kubernetes Node</text>
        <rect x="55" y="330" width="240" height="26" rx="4" fill="#f1c40f" />
        <text x="105" y="348" fontSize="11" fill="#333">Kubernetes Node</text>

        <rect x="55" y="361" width="240" height="26" rx="4" fill="#e74c3c" />
        <text x="120" y="379" fontSize="11" fill="#fff">Hypervisor</text>
        <rect x="55" y="392" width="240" height="26" rx="4" fill="#e74c3c" />
        <text x="120" y="410" fontSize="11" fill="#fff">Hypervisor</text>
        <rect x="55" y="423" width="240" height="26" rx="4" fill="#e74c3c" />
        <text x="120" y="441" fontSize="11" fill="#fff">Hypervisor</text>

        {/* Rack1 servers dual-homed to both ToR switches (curved fan-in look via straight lines) */}
        <line className="vpc-active-pulse" x1="120" y1="165" x2="120" y2="175" stroke="#2ecc71" strokeWidth="2" />
        <line className="vpc-active-pulse" x1="230" y1="165" x2="230" y2="175" stroke="#2ecc71" strokeWidth="2" />

        {/* ============ RACK N ============ */}
        <text x="740" y="55" fontSize="14" fill="#333">Rack#N</text>
        <rect x="610" y="65" width="290" height="390" rx="4" fill="none" stroke="#3498db" strokeWidth="3" />

        <rect x="622" y="75" width="266" height="90" rx="14" fill="#f3ecfb" stroke="#8e44ad" strokeWidth="2" />
        <rect x="635" y="88" width="240" height="30" rx="5" fill="#3498db" />
        <text x="700" y="108" fontSize="12" fill="#fff">ToR Switch1</text>
        <rect x="635" y="125" width="240" height="30" rx="5" fill="#3498db" />
        <text x="700" y="145" fontSize="12" fill="#fff">ToR Switch2</text>
        <line className="vpc-active-pulse" x1="755" y1="118" x2="755" y2="125" stroke="#8e44ad" strokeWidth="4" />

        <rect x="635" y="175" width="240" height="26" rx="4" fill="#2ecc71" />
        <text x="675" y="193" fontSize="11" fill="#fff">Bare Metal Server</text>
        <rect x="635" y="206" width="240" height="26" rx="4" fill="#2ecc71" />
        <text x="675" y="224" fontSize="11" fill="#fff">Bare Metal Server</text>
        <rect x="635" y="237" width="240" height="26" rx="4" fill="#2ecc71" />
        <text x="675" y="255" fontSize="11" fill="#fff">Bare Metal Server</text>

        <rect x="635" y="268" width="240" height="26" rx="4" fill="#f1c40f" />
        <text x="685" y="286" fontSize="11" fill="#333">Kubernetes Node</text>
        <rect x="635" y="299" width="240" height="26" rx="4" fill="#f1c40f" />
        <text x="685" y="317" fontSize="11" fill="#333">Kubernetes Node</text>
        <rect x="635" y="330" width="240" height="26" rx="4" fill="#f1c40f" />
        <text x="685" y="348" fontSize="11" fill="#333">Kubernetes Node</text>

        <rect x="635" y="361" width="240" height="26" rx="4" fill="#e74c3c" />
        <text x="700" y="379" fontSize="11" fill="#fff">Hypervisor</text>
        <rect x="635" y="392" width="240" height="26" rx="4" fill="#e74c3c" />
        <text x="700" y="410" fontSize="11" fill="#fff">Hypervisor</text>
        <rect x="635" y="423" width="240" height="26" rx="4" fill="#e74c3c" />
        <text x="700" y="441" fontSize="11" fill="#fff">Hypervisor</text>

        {/* ============ CORE / vPC PAIR (middle) ============ */}
        <rect x="365" y="150" width="170" height="140" rx="16" fill="#fff" stroke="#4c5966" strokeWidth="2" />
        <text x="395" y="140" fontSize="12" fill="#333">vPC Pair</text>
        <rect x="380" y="165" width="140" height="45" rx="6" fill="#8e44ad" />
        <text x="405" y="192" fontSize="12" fill="#fff">Core Switch1</text>
        <rect x="380" y="220" width="140" height="45" rx="6" fill="#8e44ad" />
        <text x="405" y="247" fontSize="12" fill="#fff">Core Switch2</text>
        <line className="vpc-active-pulse" x1="450" y1="210" x2="450" y2="220" stroke="#f1c40f" strokeWidth="4" />

        {/* Rack1 ToR <-> Core links (active-active, all 4) */}
        <line className="vpc-active-pulse" x1="308" y1="90" x2="380" y2="185" stroke="#2ecc71" strokeWidth="2" />
        <line className="vpc-active-pulse" x1="308" y1="90" x2="380" y2="240" stroke="#2ecc71" strokeWidth="2" />
        <line className="vpc-active-pulse" x1="308" y1="130" x2="380" y2="185" stroke="#2ecc71" strokeWidth="2" />
        <line className="vpc-active-pulse" x1="308" y1="130" x2="380" y2="240" stroke="#2ecc71" strokeWidth="2" />

        {/* Rack N ToR <-> Core links */}
        <line className="vpc-active-pulse" x1="622" y1="90" x2="520" y2="185" stroke="#2ecc71" strokeWidth="2" />
        <line className="vpc-active-pulse" x1="622" y1="90" x2="520" y2="240" stroke="#2ecc71" strokeWidth="2" />
        <line className="vpc-active-pulse" x1="622" y1="130" x2="520" y2="185" stroke="#2ecc71" strokeWidth="2" />
        <line className="vpc-active-pulse" x1="622" y1="130" x2="520" y2="240" stroke="#2ecc71" strokeWidth="2" />

        <text x="360" y="310" fontSize="11" fill="#555">All ToR-to-Core links stay ACTIVE-ACTIVE</text>
        <text x="380" y="326" fontSize="11" fill="#555">— vPC removes STP blocking here</text>
      </svg>

      <div style={infoBox}>
        <b>What vPC/MLAG solves:</b> Removes the "one blocked link" problem <i>within a single
        pair</i> of switches. Servers get dual-active uplinks instead of one active + one
        standby. The Core layer (Core Switch1 + Core Switch2) can form its own vPC pair too,
        connecting multiple racks upward.
      </div>

      {/* ================= SECTION B: Domain to Domain — still active/active ================= */}
      <h3 style={{ marginTop: '35px' }}>2. Two vPC Domains Talking to Each Other — Still Active/Active</h3>
      <p>
        Now group Switch1 + Switch2 into one vPC domain — call it <b>"SW12"</b> — and
        Switch3 + Switch4 into another vPC domain, <b>"SW34"</b>. Endpoint1 sits below SW12,
        Endpoint2 sits below SW34. Between the two domains there are 4 physical cross-links:
        SW1&ndash;SW3, SW1&ndash;SW4, SW2&ndash;SW3, SW2&ndash;SW4.
      </p>
      <p>
        A common misconception is that this forms a loop and STP has to block one of these
        4 links. That's <b>not correct</b>. Because SW1+SW2 act as one logical switch (via
        their peer-link) and SW3+SW4 also act as one logical switch, from a loop-prevention
        perspective this still looks like just <b>one logical link</b> between two logical
        switches — not four separate paths. vPC's own consistency checks and peer-link
        synchronization keep <b>all 4 physical links active-active</b> at the same time.
        Traffic from Endpoint1 can load-balance across any of the 4 links to reach Endpoint2.
      </p>

      <svg viewBox="0 0 700 300" style={{ width: '100%', maxWidth: '700px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
        <rect x="60" y="20" width="580" height="80" rx="16" fill="none" stroke="#8e44ad" strokeWidth="2" strokeDasharray="6,4" />
        <text x="20" y="65" fontSize="13" fill="#8e44ad">SW34</text>

        <rect x="120" y="40" width="160" height="45" rx="6" fill="#3498db" />
        <text x="165" y="67" fontSize="13" fill="#fff">Switch3</text>
        <rect x="420" y="40" width="160" height="45" rx="6" fill="#3498db" />
        <text x="465" y="67" fontSize="13" fill="#fff">Switch4</text>
        <line x1="280" y1="62" x2="420" y2="62" stroke="#8e44ad" strokeWidth="3" />

        <rect x="60" y="150" width="580" height="80" rx="16" fill="none" stroke="#8e44ad" strokeWidth="2" strokeDasharray="6,4" />
        <text x="20" y="195" fontSize="13" fill="#8e44ad">SW12</text>

        <rect x="120" y="170" width="160" height="45" rx="6" fill="#3498db" />
        <text x="165" y="197" fontSize="13" fill="#fff">Switch1</text>
        <rect x="420" y="170" width="160" height="45" rx="6" fill="#3498db" />
        <text x="465" y="197" fontSize="13" fill="#fff">Switch2</text>
        <line x1="280" y1="192" x2="420" y2="192" stroke="#8e44ad" strokeWidth="3" />

        <line className="vpc-active-pulse" x1="200" y1="170" x2="200" y2="85" stroke="#2ecc71" strokeWidth="3" />
        <line className="vpc-active-pulse" x1="200" y1="170" x2="500" y2="85" stroke="#2ecc71" strokeWidth="3" />
        <line className="vpc-active-pulse" x1="500" y1="170" x2="200" y2="85" stroke="#2ecc71" strokeWidth="3" />
        <line className="vpc-active-pulse" x1="500" y1="170" x2="500" y2="85" stroke="#2ecc71" strokeWidth="3" />

        <text x="270" y="125" fontSize="12" fill="#2ecc71">All 4 links ACTIVE (load-balanced)</text>

        <rect x="120" y="255" width="160" height="35" rx="5" fill="#95a5a6" />
        <text x="150" y="278" fontSize="12" fill="#fff">Endpoint1</text>
        <rect x="420" y="255" width="160" height="35" rx="5" fill="#95a5a6" />
        <text x="450" y="278" fontSize="12" fill="#fff">Endpoint2</text>
        <line x1="200" y1="215" x2="200" y2="255" stroke="#333" strokeWidth="1.5" />
        <line x1="500" y1="215" x2="500" y2="255" stroke="#333" strokeWidth="1.5" />
      </svg>
            <p style={{ marginTop: '20px' }}>
        Here's the same thing from a <b>logical point of view</b> — this is how vPC's
        consistency mechanism actually "sees" the topology. SW1+SW2 collapse into a single
        logical switch <b>"SW12"</b>, and SW3+SW4 collapse into a single logical switch{' '}
        <b>"SW34"</b>. The 4 physical cross-links become one <b>logical bundle</b> (like a
        multi-chassis port-channel) between these two logical switches — which is exactly
        why there's no loop to break here.
      </p>

      <svg viewBox="0 0 700 220" style={{ width: '100%', maxWidth: '700px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
        <text x="10" y="20" fontSize="13" fill="#333">Logical View</text>

        <rect x="80" y="60" width="200" height="90" rx="16" fill="#f3ecfb" stroke="#8e44ad" strokeWidth="2" />
        <text x="140" y="55" fontSize="13" fill="#8e44ad">SW12 (logical)</text>
        <circle cx="180" cy="105" r="30" fill="#3498db" />
        <text x="155" y="110" fontSize="13" fill="#fff">SW12</text>

        <rect x="420" y="60" width="200" height="90" rx="16" fill="#f3ecfb" stroke="#8e44ad" strokeWidth="2" />
        <text x="480" y="55" fontSize="13" fill="#8e44ad">SW34 (logical)</text>
        <circle cx="520" cy="105" r="30" fill="#3498db" />
        <text x="495" y="110" fontSize="13" fill="#fff">SW34</text>

        {/* logical bundle - multiple parallel lines representing the 4 physical links as one bundle */}
        <line className="vpc-active-pulse" x1="280" y1="90" x2="420" y2="90" stroke="#2ecc71" strokeWidth="3" />
        <line className="vpc-active-pulse" x1="280" y1="100" x2="420" y2="100" stroke="#2ecc71" strokeWidth="3" />
        <line className="vpc-active-pulse" x1="280" y1="110" x2="420" y2="110" stroke="#2ecc71" strokeWidth="3" />
        <line className="vpc-active-pulse" x1="280" y1="120" x2="420" y2="120" stroke="#2ecc71" strokeWidth="3" />

        <text x="300" y="170" fontSize="12" fill="#2ecc71">Looks like ONE logical bundle — no loop possible</text>
        <text x="300" y="188" fontSize="11" fill="#555">(the 4 physical links underneath are just its members)</text>
      </svg>


      {/* ================= SECTION C: Back-to-Back vPC ================= */}


      <h3 style={{ marginTop: '25px' }}>4. The Real Limit: A 3rd vPC Pair Breaks the Model</h3>
      <p>
        The problem shows up when the data center grows even further and a <b>3rd vPC
        pair</b> (Core Switch5 + Core Switch6) needs to be introduced and interconnected with
        the other two. Now you don't just have one logical link between two logical switches
        anymore — you have <b>three independent vPC domains</b> trying to interconnect with
        each other (Pair1&ndash;Pair2, Pair2&ndash;Pair3, Pair1&ndash;Pair3). vPC's
        consistency/peer-link mechanism is only designed to keep 2 switches in sync as one
        logical entity — it has no concept of keeping 3+ independent domains loop-free with
        each other. The moment three (or more) domains interconnect like this, a genuine loop
        exists again, and you're forced to bring back <b>Spanning Tree</b> between the domains
        to block one of the connections.
      </p>

      <svg viewBox="0 0 700 320" style={{ width: '100%', maxWidth: '700px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
        <rect x="30" y="20" width="180" height="100" rx="12" fill="none" stroke="#8e44ad" strokeWidth="2" />
        <text x="45" y="15" fontSize="12" fill="#8e44ad">vPC Pair 1 (Root)</text>
        <rect x="45" y="35" width="150" height="30" rx="5" fill="#8e44ad" />
        <text x="65" y="55" fontSize="11" fill="#fff">Core Switch1</text>
        <rect x="45" y="75" width="150" height="30" rx="5" fill="#8e44ad" />
        <text x="65" y="95" fontSize="11" fill="#fff">Core Switch2</text>

        <rect x="490" y="20" width="180" height="100" rx="12" fill="none" stroke="#8e44ad" strokeWidth="2" />
        <text x="520" y="15" fontSize="12" fill="#8e44ad">vPC Pair 2</text>
        <rect x="505" y="35" width="150" height="30" rx="5" fill="#8e44ad" />
        <text x="525" y="55" fontSize="11" fill="#fff">Core Switch3</text>
        <rect x="505" y="75" width="150" height="30" rx="5" fill="#8e44ad" />
        <text x="525" y="95" fontSize="11" fill="#fff">Core Switch4</text>

        <rect x="260" y="180" width="180" height="100" rx="12" fill="none" stroke="#8e44ad" strokeWidth="2" />
        <text x="290" y="175" fontSize="12" fill="#8e44ad">vPC Pair 3</text>
        <rect x="275" y="195" width="150" height="30" rx="5" fill="#8e44ad" />
        <text x="295" y="215" fontSize="11" fill="#fff">Core Switch5</text>
        <rect x="275" y="235" width="150" height="30" rx="5" fill="#8e44ad" />
        <text x="295" y="255" fontSize="11" fill="#fff">Core Switch6</text>

        <line className="vpc-active-pulse" x1="210" y1="50" x2="490" y2="50" stroke="#2ecc71" strokeWidth="3" />
        <line className="vpc-active-pulse" x1="120" y1="120" x2="300" y2="195" stroke="#2ecc71" strokeWidth="3" />
        <line className="vpc-blocked" x1="580" y1="120" x2="400" y2="195" stroke="#e74c3c" strokeWidth="3" strokeDasharray="8,5" />
        <text className="vpc-blocked" x="470" y="165" fontSize="18" fill="#e74c3c">✕ BLK</text>

        <text x="330" y="300" fontSize="12" fill="#e74c3c">3rd pair completes a loop → STP needed again</text>
      </svg>

      <div style={limitationBox}>
        <b>Conclusion — What VPC Can't Solve:</b> vPC/MLAG works cleanly for one domain, and
        even for two domains talking to each other. But it caps out at that scale. As soon as
        a network needs a <b>3rd independent vPC domain</b> interconnected with the others,
        loops form again and Spanning Tree comes back into the picture. This is exactly why{' '}
        <b>vPC/MLAG is not a hyperscale solution</b> — it works well for small/medium
        designs, but breaks down as a data center keeps scaling to hundreds of racks and
        dozens of switch pairs.
      </div>

      <div style={infoBox}>
        <b>EVPN's angle on this:</b> EVPN doesn't rely on pairing switches together or on
        STP at all. Every leaf and spine link stays active through pure L3 ECMP routing in
        the underlay, and BGP EVPN provides loop-free any-to-any reachability in the overlay.
        Adding a 3rd, 10th, or 100th pair of leafs never re-introduces this blocking problem —
        it scales natively to hyperscale size.
      </div>
    </section>
  )
}