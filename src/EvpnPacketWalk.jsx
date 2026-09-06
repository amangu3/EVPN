const infoBox = {
  background: '#eaf2fd',
  border: '1px solid #3498db',
  borderRadius: '8px',
  padding: '12px 16px',
  marginTop: '12px',
}

const keyBox = {
  background: '#fff8e1',
  border: '1px solid #f1c40f',
  borderRadius: '8px',
  padding: '12px 16px',
  marginTop: '12px',
}

export default function EvpnPacketWalk() {
  return (
    <section style={{ marginBottom: '50px' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px' }}>EVPN Packet Walk</h2>

      <style>
        {`
          @keyframes blinkDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
          .pw-blink { animation: blinkDot 1.1s ease-in-out infinite; }

          @keyframes routePulse { 0%, 100% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -20; } }
          .pw-route-line { stroke-dasharray: 6,5; animation: routePulse 1s linear infinite; }

          @keyframes popIn { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }
          .pw-pop-1 { animation: popIn 0.6s ease-out 0.6s both; }
          .pw-pop-2 { animation: popIn 0.6s ease-out 1.8s both; }

          @keyframes pulseGreen { 0%, 100% { stroke-width: 2; } 50% { stroke-width: 4; } }
          .pw-active { animation: pulseGreen 2s ease-in-out infinite; }
        `}
      </style>

      <p>
        Two things happen in an EVPN fabric: first the <b>control plane</b> quietly builds
        every VTEP's knowledge of "who is where", and only then does the <b>data plane</b>{' '}
        actually move a packet using that knowledge. Let's walk through both, using{' '}
        <b>Endpoint A</b> (behind VTEP1) sending traffic to <b>Endpoint B</b> (behind VTEP2).
      </p>

      {/* ============================================================ */}
      <h3 style={{ marginTop: '30px' }}>Phase 1 — Control Plane: BGP Learns Every Endpoint's Location</h3>
      <p>
        Before any data ever flows, each VTEP advertises its own <b>locally connected
        endpoints (MAC/IP)</b> to every other VTEP via <b>BGP EVPN Type-2 routes</b>. These
        updates ride over the L3 underlay through the core switches (acting purely as BGP
        peers/route-reflectors at this stage — no tenant traffic yet). By the time this phase
        finishes, <b>every VTEP has a full location database</b> for endpoints it has never
        physically seen.
      </p>

      <svg viewBox="0 0 900 380" style={{ width: '100%', maxWidth: '900px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
        <text x="10" y="20" fontSize="13" fill="#333">Phase 1 — BGP EVPN Route Exchange</text>

        {/* Core switches */}
        <rect x="230" y="45" width="180" height="50" rx="8" fill="#8e44ad" />
        <text x="255" y="75" fontSize="13" fill="#fff">Core Switch1</text>
        <rect x="490" y="45" width="180" height="50" rx="8" fill="#8e44ad" />
        <text x="515" y="75" fontSize="13" fill="#fff">Core Switch2</text>

        {/* VTEP1 */}
        <rect x="80" y="180" width="200" height="55" rx="8" fill="#3498db" />
        <text x="100" y="203" fontSize="13" fill="#fff">VTEP1</text>
        <text x="100" y="222" fontSize="11" fill="#fff">Loopback 1.1.1.1/32</text>

        {/* VTEP2 */}
        <rect x="620" y="180" width="200" height="55" rx="8" fill="#3498db" />
        <text x="640" y="203" fontSize="13" fill="#fff">VTEP2</text>
        <text x="640" y="222" fontSize="11" fill="#fff">Loopback 2.2.2.2/32</text>

        {/* underlay links */}
        <line x1="180" y1="180" x2="300" y2="95" stroke="#ccc" strokeWidth="2" />
        <line x1="180" y1="180" x2="560" y2="95" stroke="#ccc" strokeWidth="2" />
        <line x1="720" y1="180" x2="300" y2="95" stroke="#ccc" strokeWidth="2" />
        <line x1="720" y1="180" x2="560" y2="95" stroke="#ccc" strokeWidth="2" />

        {/* BGP route advertisement — pulsing dashed lines both directions */}
        <path className="pw-route-line" d="M 200,180 C 300,140 500,140 700,190" fill="none" stroke="#f1c40f" strokeWidth="2.5" />
        <path className="pw-route-line" d="M 700,220 C 500,270 300,270 200,220" fill="none" stroke="#2ecc71" strokeWidth="2.5" />

        <circle className="pw-blink" cx="450" cy="150" r="5" fill="#f1c40f" />
        <text x="330" y="140" fontSize="11" fill="#8a6d00">BGP EVPN Type-2: "A is at VTEP 1.1.1.1"</text>
        <text x="330" y="285" fontSize="11" fill="#1e7e34">BGP EVPN Type-2: "B, C are at VTEP 2.2.2.2"</text>

        {/* Endpoints */}
        <rect x="90" y="270" width="150" height="55" rx="6" fill="#2ecc71" />
        <text x="115" y="292" fontSize="11" fill="#fff">Endpoint A</text>
        <text x="115" y="307" fontSize="10" fill="#fff">MAC A / 10.10.10.10</text>
        <line x1="180" y1="235" x2="165" y2="270" stroke="#333" strokeWidth="1.5" />

        <rect x="640" y="270" width="150" height="55" rx="6" fill="#2ecc71" />
        <text x="665" y="292" fontSize="11" fill="#fff">Endpoint B</text>
        <text x="665" y="307" fontSize="10" fill="#fff">MAC B / 10.10.10.20</text>
        <line x1="720" y1="235" x2="705" y2="270" stroke="#333" strokeWidth="1.5" />

        {/* Result databases popping in */}
        <g className="pw-pop-1">
          <rect x="20" y="340" width="260" height="34" rx="6" fill="#fff8e1" stroke="#f1c40f" />
          <text x="30" y="361" fontSize="11" fill="#8a6d00">VTEP1's table now knows: B, C → VTEP 2.2.2.2</text>
        </g>
        <g className="pw-pop-2">
          <rect x="620" y="340" width="260" height="34" rx="6" fill="#fff8e1" stroke="#f1c40f" />
          <text x="630" y="361" fontSize="11" fill="#8a6d00">VTEP2's table now knows: A → VTEP 1.1.1.1</text>
        </g>
      </svg>

      <div style={infoBox}>
        <b>Key point:</b> This entire phase happens <i>before</i> any real traffic flows.
        Once complete, VTEP1 already knows exactly which remote VTEP to send traffic to for
        Endpoint B — no flooding or discovery needed when the actual packet arrives.
      </div>

      {/* ============================================================ */}
      <h3 style={{ marginTop: '40px' }}>Phase 2 — Data Plane: The Actual Packet Walk</h3>
      <p>
        Now Endpoint A sends a frame destined for Endpoint B. Watch what changes at each hop:
      </p>

      <svg viewBox="0 0 900 420" style={{ width: '100%', maxWidth: '900px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
        <text x="10" y="20" fontSize="13" fill="#333">Phase 2 — Encapsulate → Route (ECMP) → Decapsulate</text>

        {/* Core switches */}
        <rect x="230" y="45" width="180" height="50" rx="8" fill="#8e44ad" />
        <text x="255" y="75" fontSize="13" fill="#fff">Core Switch1</text>
        <rect x="490" y="45" width="180" height="50" rx="8" fill="#8e44ad" />
        <text x="515" y="75" fontSize="13" fill="#fff">Core Switch2</text>
        <text x="20" y="65" fontSize="11" fill="#555">Core only does an</text>
        <text x="20" y="80" fontSize="11" fill="#555">outer-IP lookup —</text>
        <text x="20" y="95" fontSize="11" fill="#555">it has no idea this</text>
        <text x="20" y="110" fontSize="11" fill="#555">is EVPN traffic.</text>

        {/* VTEP1 */}
        <rect x="80" y="180" width="200" height="55" rx="8" fill="#3498db" />
        <text x="100" y="203" fontSize="13" fill="#fff">VTEP1</text>
        <text x="100" y="222" fontSize="11" fill="#fff">Loopback 1.1.1.1/32</text>

        {/* VTEP2 */}
        <rect x="620" y="180" width="200" height="55" rx="8" fill="#3498db" />
        <text x="640" y="203" fontSize="13" fill="#fff">VTEP2</text>
        <text x="640" y="222" fontSize="11" fill="#fff">Loopback 2.2.2.2/32</text>

        {/* underlay ECMP links - both active */}
        <line className="pw-active" x1="180" y1="180" x2="300" y2="95" stroke="#2ecc71" strokeWidth="2" />
        <line className="pw-active" x1="180" y1="180" x2="560" y2="95" stroke="#2ecc71" strokeWidth="2" />
        <line className="pw-active" x1="720" y1="180" x2="300" y2="95" stroke="#2ecc71" strokeWidth="2" />
        <line className="pw-active" x1="720" y1="180" x2="560" y2="95" stroke="#2ecc71" strokeWidth="2" />
        <text x="330" y="140" fontSize="11" fill="#2ecc71">ECMP — either core switch works, both paths equal-cost</text>

        {/* Endpoints */}
        <rect x="90" y="270" width="150" height="55" rx="6" fill="#2ecc71" />
        <text x="115" y="292" fontSize="11" fill="#fff">Endpoint A</text>
        <text x="115" y="307" fontSize="10" fill="#fff">MAC A / 10.10.10.10</text>
        <line x1="180" y1="235" x2="165" y2="270" stroke="#333" strokeWidth="1.5" />

        <rect x="640" y="270" width="150" height="55" rx="6" fill="#2ecc71" />
        <text x="665" y="292" fontSize="11" fill="#fff">Endpoint B</text>
        <text x="665" y="307" fontSize="10" fill="#fff">MAC B / 10.10.10.20</text>
        <line x1="720" y1="235" x2="705" y2="270" stroke="#333" strokeWidth="1.5" />

        {/* Step labels */}
        <g className="pw-pop-1">
          <rect x="30" y="345" width="280" height="60" rx="6" fill="#eafaf1" stroke="#2ecc71" />
          <text x="40" y="362" fontSize="11" fill="#1e7e34">① VTEP1: table lookup → "B is at 2.2.2.2".</text>
          <text x="40" y="378" fontSize="11" fill="#1e7e34">Encapsulates: outer IP src 1.1.1.1,</text>
          <text x="40" y="394" fontSize="11" fill="#1e7e34">dst 2.2.2.2 + UDP 4789 + VNI.</text>
        </g>
        <g className="pw-pop-2">
          <rect x="590" y="345" width="280" height="60" rx="6" fill="#eafaf1" stroke="#2ecc71" />
          <text x="600" y="362" fontSize="11" fill="#1e7e34">③ VTEP2: sees itself as dst IP,</text>
          <text x="600" y="378" fontSize="11" fill="#1e7e34">decapsulates, reads VNI, delivers</text>
          <text x="600" y="394" fontSize="11" fill="#1e7e34">original inner frame to Endpoint B.</text>
        </g>
        <rect x="360" y="345" width="180" height="60" rx="6" fill="#eaf2fd" stroke="#3498db" />
        <text x="370" y="362" fontSize="11" fill="#1c5a85">② Core: routes purely on</text>
        <text x="370" y="378" fontSize="11" fill="#1c5a85">outer dst IP 2.2.2.2 — inner</text>
        <text x="370" y="394" fontSize="11" fill="#1c5a85">frame is invisible to it.</text>

        {/* Traveling packet - changes color to represent encapsulated state */}
        <circle r="9" fill="#e67e22">
          <animateMotion
            dur="4.5s"
            repeatCount="indefinite"
            path="M 165,270 L 180,207 L 440,70 L 720,207 L 705,270"
          />
        </circle>
      </svg>

      <div style={keyBox}>
        <b>Step-by-step:</b>
        <ol style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
          <li>Endpoint A sends a plain Ethernet frame to VTEP1.</li>
          <li><b>VTEP1</b> checks its BGP-learned table, finds Endpoint B lives behind VTEP 2.2.2.2, and <b>encapsulates</b> the frame (VXLAN header with the VNI, UDP header, outer IP header — src 1.1.1.1, dst 2.2.2.2).</li>
          <li>The encapsulated packet is now just a normal <b>IP packet</b> as far as the underlay is concerned. Each <b>Core switch</b> does a routing lookup only on the <b>outer destination IP (2.2.2.2)</b> — it has zero visibility into the tenant's inner frame. With ECMP, either core switch (or path) is equally valid.</li>
          <li>The packet arrives at <b>VTEP2</b>, which recognizes itself as the destination IP, <b>decapsulates</b> the packet, reads the VNI to identify the correct L2 domain/VRF, and delivers the original inner frame to Endpoint B.</li>
        </ol>
      </div>

      <div style={infoBox}>
        <b>Why this design scales:</b> The core switches never learn or care about tenant
        MACs/IPs — they only ever route on loopback addresses. All the "intelligence" about
        where each endpoint lives stays at the edge (VTEPs), learned entirely through BGP in
        Phase 1. This separation is exactly what lets an EVPN-VXLAN fabric scale to hundreds
        of leafs without the core ever needing bigger MAC tables.
      </div>
    </section>
  )
}