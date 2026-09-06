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

export default function EvpnArchitecture() {
  return (
    <section style={{ marginBottom: '50px' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px' }}>
        EVPN High-Level Architecture (HLA)
      </h2>

      <style>
        {`
          @keyframes pulseGreen {
            0%, 100% { stroke-width: 3; }
            50% { stroke-width: 5; }
          }
          .arch-active-pulse { animation: pulseGreen 2s ease-in-out infinite; }

          @keyframes fadeInGrow {
            0% { opacity: 0; transform: scale(0.7); }
            100% { opacity: 1; transform: scale(1); }
          }
          .layer-1 { animation: fadeInGrow 0.8s ease-out 0.2s both; }
          .layer-2 { animation: fadeInGrow 0.8s ease-out 1.2s both; }
          .layer-3 { animation: fadeInGrow 0.8s ease-out 2.2s both; }
          .layer-4 { animation: fadeInGrow 0.8s ease-out 3.2s both; }

          @keyframes blinkDot {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          .bgp-dot { animation: blinkDot 1s ease-in-out infinite; }
        `}
      </style>

      <h3>What EVPN Means, Architecturally</h3>
      <p>
        <b>EVPN = Ethernet VPN.</b> At a high level, the architecture rests on a few core ideas:
      </p>
      <ul>
        <li><b>Every switch becomes a router</b> and participates in a common <b>L3 underlay</b> — there's no L2 dependency between switches at this layer.</li>
        <li>Switches that connect directly to endpoints become <b>VTEPs</b> (VXLAN Tunnel Endpoints) and form <b>overlay tunnels</b> between each other, riding on top of the L3 underlay.</li>
        <li>An endpoint's <b>location</b> in the fabric (which VTEP it sits behind) is <b>distributed via BGP</b> — this is the control plane doing the learning, not flood-and-learn. In practice, <b>every VTEP builds and keeps its own local database</b> of "which endpoint lives behind which VTEP" — for example, VTEP2 knows <b>Endpoint A is reachable via VTEP 1.1.1.1</b>, even though Endpoint A isn't directly connected to it. This table is populated purely from BGP EVPN updates, not from data-plane flooding.</li>
        <li>The <b>encapsulation</b> used for the overlay tunnel can vary by design — VXLAN, GENEVE, MPLS, or SRv6 are all valid choices; EVPN as a control plane isn't tied to just one.</li>
      </ul>

      <h3 style={{ marginTop: '30px' }}>Topology Example</h3>
      <p>
        Core Switch1 and Core Switch2 form the <b>L3 spine</b> — every link from spine to leaf
        is a pure L3 (routed) link, fully meshed. VTEP1&ndash;VTEP4 are the leafs, each
        identified by its own <b>/32 loopback</b> (used as the tunnel source/destination for
        VXLAN). Endpoints A&ndash;E connect below the VTEPs — note that <b>two endpoints
        (B and C) can sit behind the same VTEP</b> (VTEP2), which is completely normal.
      </p>

      <svg viewBox="0 0 950 480" style={{ width: '100%', maxWidth: '950px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
        <text x="10" y="20" fontSize="13" fill="#333">EVPN HLA — L3 Underlay + VXLAN Overlay</text>

        {/* Core switches */}
        <rect x="230" y="45" width="180" height="50" rx="8" fill="#8e44ad" />
        <text x="265" y="75" fontSize="13" fill="#fff">Core Switch1</text>
        <rect x="540" y="45" width="180" height="50" rx="8" fill="#8e44ad" />
        <text x="575" y="75" fontSize="13" fill="#fff">Core Switch2</text>
        <text x="850" y="75" fontSize="14" fill="#8e44ad">L3</text>

        {/* VTEPs */}
        {[
          ['VTEP1', 'Loopback 1.1.1.1/32', 30],
          ['VTEP2', 'Loopback 2.2.2.2/32', 270],
          ['VTEP3', 'Loopback 3.3.3.3/32', 510],
          ['VTEP4', 'Loopback 4.4.4.4/32', 750],
        ].map(([name, lo, x], i) => (
          <g key={i}>
            <rect x={x} y="180" width="190" height="55" rx="8" fill="#3498db" />
            <text x={x + 15} y="203" fontSize="13" fill="#fff">{name}</text>
            <text x={x + 15} y="222" fontSize="11" fill="#fff">{lo}</text>
            <line className="arch-active-pulse" x1={x + 95} y1="180" x2="320" y2="95" stroke="#2ecc71" strokeWidth="2" />
            <line className="arch-active-pulse" x1={x + 95} y1="180" x2="630" y2="95" stroke="#2ecc71" strokeWidth="2" />
          </g>
        ))}

        {/* Endpoints */}
        <rect x="30" y="280" width="150" height="55" rx="6" fill="#2ecc71" />
        <text x="55" y="302" fontSize="11" fill="#fff">Endpoint A</text>
        <text x="55" y="317" fontSize="10" fill="#fff">MAC A / 10.10.10.10/24</text>
        <line x1="125" y1="235" x2="105" y2="280" stroke="#333" strokeWidth="1.5" />

        <rect x="240" y="280" width="150" height="55" rx="6" fill="#2ecc71" />
        <text x="265" y="302" fontSize="11" fill="#fff">Endpoint B</text>
        <text x="265" y="317" fontSize="10" fill="#fff">MAC B / 10.10.10.20/24</text>
        <line x1="365" y1="235" x2="315" y2="280" stroke="#333" strokeWidth="1.5" />

        <rect x="410" y="280" width="150" height="55" rx="6" fill="#e74c3c" />
        <text x="435" y="302" fontSize="11" fill="#fff">Endpoint C</text>
        <text x="435" y="317" fontSize="10" fill="#fff">MAC C / 10.20.20.30/24</text>
        <line x1="365" y1="235" x2="485" y2="280" stroke="#333" strokeWidth="1.5" />

        <rect x="600" y="280" width="150" height="55" rx="6" fill="#f1c40f" />
        <text x="625" y="302" fontSize="11" fill="#333">Endpoint D</text>
        <text x="625" y="317" fontSize="10" fill="#333">MAC D / 10.30.30.40/24</text>
        <line x1="605" y1="235" x2="675" y2="280" stroke="#333" strokeWidth="1.5" />

        <rect x="820" y="280" width="150" height="55" rx="6" fill="#2c3e50" />
        <text x="845" y="302" fontSize="11" fill="#fff">Endpoint E</text>
        <text x="845" y="317" fontSize="10" fill="#fff">MAC E / 10.40.40.50/24</text>
        <line x1="845" y1="235" x2="895" y2="280" stroke="#333" strokeWidth="1.5" />

        {/* BGP control plane strip - each VTEP's own local database */}
        <rect x="10" y="355" width="930" height="115" rx="8" fill="#fff8e1" stroke="#f1c40f" strokeWidth="2" />
        <text x="25" y="375" fontSize="13" fill="#8a6d00">
          Every VTEP holds its own local "Endpoint Location" database, synced via BGP EVPN
        </text>

        <text x="35" y="393" fontSize="11" fill="#8a6d00" fontWeight="bold">Endpoint</text>
        <text x="140" y="393" fontSize="11" fill="#8a6d00" fontWeight="bold">Location (VTEP)</text>
        <line x1="25" y1="398" x2="300" y2="398" stroke="#f1c40f" strokeWidth="1" />

        <circle className="bgp-dot" cx="30" cy="410" r="3" fill="#f1c40f" />
        <text x="40" y="414" fontSize="11" fill="#333">A</text>
        <text x="140" y="414" fontSize="11" fill="#333">VTEP 1.1.1.1</text>

        <circle className="bgp-dot" cx="30" cy="426" r="3" fill="#f1c40f" />
        <text x="40" y="430" fontSize="11" fill="#333">B</text>
        <text x="140" y="430" fontSize="11" fill="#333">VTEP 2.2.2.2</text>

        <circle className="bgp-dot" cx="30" cy="442" r="3" fill="#f1c40f" />
        <text x="40" y="446" fontSize="11" fill="#333">C</text>
        <text x="140" y="446" fontSize="11" fill="#333">VTEP 2.2.2.2</text>

        <circle className="bgp-dot" cx="30" cy="458" r="3" fill="#f1c40f" />
        <text x="40" y="462" fontSize="11" fill="#333">D</text>
        <text x="140" y="462" fontSize="11" fill="#333">VTEP 3.3.3.3</text>

        <text x="320" y="393" fontSize="11" fill="#8a6d00" fontWeight="bold">Endpoint</text>
        <text x="420" y="393" fontSize="11" fill="#8a6d00" fontWeight="bold">Location (VTEP)</text>
        <line x1="310" y1="398" x2="580" y2="398" stroke="#f1c40f" strokeWidth="1" />
        <circle className="bgp-dot" cx="315" cy="410" r="3" fill="#f1c40f" />
        <text x="325" y="414" fontSize="11" fill="#333">E</text>
        <text x="420" y="414" fontSize="11" fill="#333">VTEP 4.4.4.4</text>

        <text x="650" y="405" fontSize="11" fill="#555">Example: VTEP2 has never</text>
        <text x="650" y="421" fontSize="11" fill="#555">directly seen Endpoint A —</text>
        <text x="650" y="437" fontSize="11" fill="#555">it still knows "A → VTEP</text>
        <text x="650" y="453" fontSize="11" fill="#555">1.1.1.1" purely from a BGP</text>
        <text x="650" y="469" fontSize="11" fill="#555">EVPN Type-2 route update.</text>
      </svg>

      <div style={infoBox}>
        <b>Encapsulation options for the overlay tunnel:</b> VXLAN, GENEVE, MPLS, SRv6 — EVPN
        as a BGP control plane doesn't mandate one specific data-plane encapsulation. The most
        widely deployed choice in modern DC fabrics is <b>VXLAN</b>, covered in detail below.
      </div>

      {/* ============================================================= */}
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px', marginTop: '50px' }}>
        VXLAN — The Most Common EVPN Encapsulation
      </h2>

      <ul>
        <li><b>Most common encapsulation for EVPN</b> in modern data center fabrics.</li>
        <li>Encapsulates the original frame/packet inside three wrapping layers, from innermost to outermost:
          <ol>
            <li><b>VXLAN Header</b> (8 bytes)</li>
            <li><b>UDP Header</b> (8 bytes)</li>
            <li><b>IP Header (underlay)</b> (20 bytes)</li>
          </ol>
        </li>
        <li>Most important field: <b>VNI (VXLAN Network Identifier)</b>
          <ul>
            <li>24 bits</li>
            <li>Identifies the <b>L2 domain</b> for bridging</li>
            <li>Identifies the <b>VRF</b> for routing</li>
          </ul>
        </li>
      </ul>

      <h3 style={{ marginTop: '25px' }}>Watching a Packet Get Encapsulated</h3>
      <p>
        Here's the original frame being wrapped layer by layer as it enters the VXLAN tunnel —
        VXLAN header first, then UDP, then the outer IP header (the underlay's job):
      </p>

      <svg viewBox="0 0 700 260" style={{ width: '100%', maxWidth: '700px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
        <text x="10" y="20" fontSize="13" fill="#333">Encapsulation build-up (innermost → outermost)</text>

        <g className="layer-4">
          <rect x="60" y="40" width="580" height="190" rx="20" fill="none" stroke="#e74c3c" strokeWidth="2.5" />
          <text x="75" y="30" fontSize="12" fill="#e74c3c">3. IP Header (underlay, 20 bytes) — Src 1.1.1.1 → Dst 2.2.2.2</text>
        </g>

        <g className="layer-3">
          <rect x="100" y="70" width="500" height="140" rx="18" fill="none" stroke="#3498db" strokeWidth="2.5" />
          <text x="115" y="60" fontSize="12" fill="#3498db">2. UDP Header (8 bytes) — Src Port 21903 → Dst Port 4789</text>
        </g>

        <g className="layer-2">
          <rect x="140" y="100" width="420" height="90" rx="16" fill="none" stroke="#8e44ad" strokeWidth="2.5" />
          <text x="155" y="90" fontSize="12" fill="#8e44ad">1. VXLAN Header (8 bytes) — VNI: 10010</text>
        </g>

        <g className="layer-1">
          <rect x="220" y="130" width="260" height="45" rx="10" fill="#2ecc71" />
          <text x="245" y="157" fontSize="12" fill="#fff">Original Ethernet Frame (payload)</text>
        </g>
      </svg>

      <h3 style={{ marginTop: '30px' }}>Real Packet Capture (Wireshark)</h3>
      <p>
        This is what the fields above actually look like on the wire, with each layer's header
        size annotated. Annotated so each capture section maps to its layer:
      </p>

      <svg viewBox="0 0 900 500" style={{ width: '100%', maxWidth: '900px', background: '#1e1e1e', border: '1px solid #444', borderRadius: '8px', fontFamily: 'monospace' }}>
        <text x="15" y="25" fontSize="12" fill="#9cdcfe">Frame 6: Packet, 148 bytes on wire (1184 bits), 148 bytes captured (1184 bits)</text>
        <text x="15" y="45" fontSize="12" fill="#9cdcfe">Ethernet II, Src: aa:c1:ab:3d:7d:a1, Dst: aa:c1:ab:8c:94:90</text>

        {/* IP layer group */}
        <rect x="10" y="58" width="640" height="130" fill="none" stroke="#e74c3c" strokeWidth="1.5" rx="4" />
        <text x="650" y="80" fontSize="13" fill="#e74c3c">IP</text>
        <text x="650" y="96" fontSize="10" fill="#e74c3c">(20 bytes)</text>
        <text x="15" y="75" fontSize="12" fill="#4ec9b0">Internet Protocol Version 4</text>
        <text x="25" y="93" fontSize="11" fill="#ce9178">Total Length: 134  |  TTL: 64  |  Protocol: UDP (17)</text>
        <text x="25" y="111" fontSize="12" fill="#dcdcaa">Source Address: 1.1.1.1</text>
        <text x="25" y="129" fontSize="12" fill="#dcdcaa">Destination Address: 2.2.2.2</text>
        <text x="25" y="150" fontSize="11" fill="#808080">(this is the underlay VTEP loopback-to-loopback path)</text>

        {/* UDP layer group */}
        <rect x="10" y="198" width="640" height="110" fill="none" stroke="#3498db" strokeWidth="1.5" rx="4" />
        <text x="650" y="220" fontSize="13" fill="#3498db">UDP</text>
        <text x="650" y="236" fontSize="10" fill="#3498db">(8 bytes)</text>
        <text x="15" y="215" fontSize="12" fill="#4ec9b0">User Datagram Protocol</text>
        <text x="25" y="233" fontSize="12" fill="#dcdcaa">Source Port: 21903 (entropy — varies per flow)</text>
        <text x="25" y="251" fontSize="12" fill="#dcdcaa">Destination Port: 4789 (well-known VXLAN port)</text>
        <text x="25" y="269" fontSize="11" fill="#808080">Length: 114</text>
        <text x="25" y="290" fontSize="11" fill="#808080">(dest port 4789 is what marks this as a VXLAN packet)</text>

        {/* VXLAN layer group */}
        <rect x="10" y="318" width="640" height="110" fill="none" stroke="#8e44ad" strokeWidth="1.5" rx="4" />
        <text x="650" y="340" fontSize="13" fill="#8e44ad">VXLAN</text>
        <text x="650" y="356" fontSize="10" fill="#8e44ad">(8 bytes)</text>
        <text x="15" y="335" fontSize="12" fill="#4ec9b0">Virtual eXtensible Local Area Network</text>
        <text x="25" y="353" fontSize="12" fill="#dcdcaa">Flags: 0x0800, VXLAN Network ID (VNI)</text>
        <text x="25" y="371" fontSize="12" fill="#dcdcaa">Group Policy ID: 0</text>
        <text x="25" y="389" fontSize="13" fill="#4fc1ff">VXLAN Network Identifier (VNI): 10010</text>
        <text x="25" y="407" fontSize="11" fill="#808080">Reserved: 0</text>

        {/* original/inner payload */}
        <rect x="10" y="440" width="640" height="50" fill="none" stroke="#2ecc71" strokeWidth="1.5" rx="4" strokeDasharray="5,3" />
        <text x="650" y="460" fontSize="13" fill="#2ecc71">Original</text>
        <text x="650" y="475" fontSize="13" fill="#2ecc71">payload</text>
        <text x="15" y="458" fontSize="11" fill="#9cdcfe">Ethernet II, Src: aa:c1:ab:2f:9d:aa, Dst: aa:c1:ab:88:c9:82</text>
        <text x="15" y="476" fontSize="11" fill="#9cdcfe">Internet Protocol Version 4, Src: 10.11.21.100, Dst: 10.11.21.101</text>

        <text x="15" y="495" fontSize="11" fill="#808080">Total VXLAN overhead: 20 (IP) + 8 (UDP) + 8 (VXLAN) = 36 bytes on top of the original frame</text>
      </svg>

      <div style={keyBox}>
        <b>Reading this packet:</b> The <b>outer IP</b> (1.1.1.1 &rarr; 2.2.2.2) is purely
        underlay routing between two VTEP loopbacks — the fabric doesn't need to know anything
        about the tenant traffic to route this. The <b>UDP destination port 4789</b> is what
        signals "this is a VXLAN packet" to the receiving VTEP. Once decapsulated, the{' '}
        <b>VNI 10010</b> tells the receiving VTEP which L2 domain (or VRF, for routed traffic)
        this frame belongs to — and only then is the <b>original inner Ethernet frame</b>{' '}
        (10.11.21.100 &rarr; 10.11.21.101) delivered to the actual destination.
      </div>

      <div style={infoBox}>
        <b>Why VNI matters so much:</b> It's the single field that lets thousands of tenants
        or L2 segments share the same physical underlay while staying completely isolated from
        each other — 24 bits gives room for over 16 million unique segments, far beyond the
        4096 VLANs a traditional 802.1Q tag could ever offer.
      </div>

      <div style={infoBox}>
        <b>Why the 36-byte overhead matters:</b> Because VXLAN adds 36 bytes on top of the
        original frame, the underlay path between VTEPs needs a slightly larger MTU than the
        standard 1500 bytes — most VXLAN fabrics run with an underlay MTU of{' '}
        <b>1600 bytes or higher (jumbo frames)</b> to avoid fragmenting encapsulated traffic.
      </div>
    </section>
  )
}