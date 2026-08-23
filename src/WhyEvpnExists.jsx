const solutionBox = {
  background: '#eafaf1',
  border: '1px solid #2ecc71',
  borderRadius: '8px',
  padding: '12px 16px',
  marginTop: '12px',
}

export default function WhyEvpnExists() {
  return (
    <>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px' }}>Why EVPN Exists</h2>

      {/* Point 1: Slow Convergence */}
      <section style={{ marginBottom: '50px' }}>
        <h3>1. Slow Convergence (up to 50 sec with STP, few sec with RSTP)</h3>
        <p>
          Traditional Spanning Tree Protocol (STP) goes through <b>Blocking &rarr; Listening &rarr;
          Learning &rarr; Forwarding</b> states after a topology change. Each state has a timer
          (default Forward Delay = 15 sec, Max Age = 20 sec), leading to total convergence time
          of up to <b>50 seconds</b>. RSTP improves this to a few seconds using proposal/agreement
          handshakes, but it's still data-plane dependent and not instant.
        </p>
        <svg viewBox="0 0 700 140" style={{ width: '100%', maxWidth: '700px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
          <text x="10" y="20" fontSize="13" fill="#333">STP Convergence Timeline</text>
          <rect x="10" y="40" width="150" height="30" fill="#e74c3c" />
          <text x="20" y="60" fontSize="12" fill="#fff">Blocking (20s)</text>
          <rect x="160" y="40" width="150" height="30" fill="#e67e22" />
          <text x="170" y="60" fontSize="12" fill="#fff">Listening (15s)</text>
          <rect x="310" y="40" width="150" height="30" fill="#f1c40f" />
          <text x="320" y="60" fontSize="12" fill="#333">Learning (15s)</text>
          <rect x="460" y="40" width="150" height="30" fill="#2ecc71" />
          <text x="470" y="60" fontSize="12" fill="#fff">Forwarding</text>
          <text x="10" y="100" fontSize="12" fill="#555">Total: ~50 sec before traffic flows again on new path</text>
        </svg>
        
      </section>

            {/* Point 2: Single active path */}
      <section style={{ marginBottom: '50px' }}>
        <h3>2. Only One Active Path per L2 Domain</h3>
        <p>
          Suppose <b>Endpoint1</b> wants to talk to <b>Endpoint2</b>. Traffic hits{' '}
          <b>Switch1</b> first — from here there are two possible uplinks: one toward{' '}
          <b>Switch3</b> and one toward <b>Switch4</b>. Once STP runs, it elects a{' '}
          <b>Root Bridge</b> and puts one of these redundant links into a{' '}
          <b>Blocking (BLK)</b> state to prevent a loop — so only one path stays active
          at a time.
        </p>
        <p>
          In modern data centers this is a problem: <b>East-West traffic</b> has grown
          massively, and these blocked links today are often <b>100G / 200G / 400G</b>{' '}
          links sitting completely idle. You could try VLAN-based "poor man's load
          balancing" (e.g. Switch3 as root for VLAN 10, Switch4 as root for VLAN 20) to
          use both links — but that doesn't scale as VLAN count grows.
        </p>

        <style>
          {`
            @keyframes blkBlink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.25; }
            }
            .blocked-link { animation: blkBlink 1.4s ease-in-out infinite; }
            .blocked-x { animation: blkBlink 1.4s ease-in-out infinite; }
          `}
        </style>

        <svg viewBox="0 0 700 340" style={{ width: '100%', maxWidth: '700px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
          {/* Switch3 */}
          <rect x="100" y="20" width="160" height="50" rx="6" fill="#3498db" />
          <text x="145" y="50" fontSize="14" fill="#fff">Switch3</text>

          {/* Switch4 */}
          <rect x="440" y="20" width="160" height="50" rx="6" fill="#3498db" />
          <text x="485" y="50" fontSize="14" fill="#fff">Switch4</text>

          {/* Switch1 */}
          <rect x="100" y="150" width="160" height="50" rx="6" fill="#3498db" />
          <text x="145" y="180" fontSize="14" fill="#fff">Switch1</text>

          {/* Switch2 */}
          <rect x="440" y="150" width="160" height="50" rx="6" fill="#3498db" />
          <text x="145" y="180" fontSize="14" fill="#fff" x="485">Switch2</text>

          {/* Endpoint1 */}
          <rect x="100" y="260" width="160" height="50" rx="6" fill="#95a5a6" />
          <text x="130" y="290" fontSize="14" fill="#fff">Endpoint1</text>

          {/* Endpoint2 */}
          <rect x="440" y="260" width="160" height="50" rx="6" fill="#95a5a6" />
          <text x="470" y="290" fontSize="14" fill="#fff">Endpoint2</text>

          {/* Active path: SW1 - SW3 (vertical, green, DP/RP) */}
          <line x1="180" y1="150" x2="180" y2="70" stroke="#2ecc71" strokeWidth="3" />
          {/* Active path: SW3 - SW2 (diagonal, green) */}
          <line x1="180" y1="70" x2="520" y2="150" stroke="#2ecc71" strokeWidth="3" />
          {/* Active path: SW4 - SW2 (vertical, green) */}
          <line x1="520" y1="70" x2="520" y2="150" stroke="#2ecc71" strokeWidth="3" />

          {/* Blocked path: SW1 - SW4 (diagonal, red dashed, blinking) */}
          <line className="blocked-link" x1="180" y1="150" x2="520" y2="70" stroke="#e74c3c" strokeWidth="3" strokeDasharray="8,5" />
          <text className="blocked-x" x="335" y="100" fontSize="24" fill="#e74c3c">✕</text>
          <text x="300" y="130" fontSize="12" fill="#e74c3c">BLK (idle 100G/200G/400G link)</text>

          {/* Endpoint - Switch links */}
          <line x1="180" y1="260" x2="180" y2="200" stroke="#333" strokeWidth="2" />
          <line x1="520" y1="260" x2="520" y2="200" stroke="#333" strokeWidth="2" />

          {/* Traveling packet along active path: Endpoint1 -> SW1 -> SW3 -> SW2 -> Endpoint2 */}
          <circle r="8" fill="#e67e22">
            <animateMotion
              dur="4s"
              repeatCount="indefinite"
              path="M 180,260 L 180,175 L 180,70 L 520,175 L 520,260"
            />
          </circle>

          <text x="10" y="330" fontSize="12" fill="#555">Green = active STP path &nbsp;|&nbsp; Red dashed = blocked (loop prevention)</text>
        </svg>

        <div style={{
          background: '#eafaf1',
          border: '1px solid #2ecc71',
          borderRadius: '8px',
          padding: '12px 16px',
          marginTop: '12px',
        }}>
   
        </div>
      </section>

      {/* Point 3: No Flooding Control */}
      <section style={{ marginBottom: '50px' }}>
        <h3>3. No Flooding Control</h3>
        <p>
          Traditional bridging floods <b>BUM traffic</b> (Broadcast, Unknown-unicast, Multicast) to
          every port in the flood domain — regardless of whether a receiver actually needs it. As
          the network grows, this unnecessary flooding consumes bandwidth and CPU across every
          switch in the domain.
        </p>
        <svg viewBox="0 0 700 200" style={{ width: '100%', maxWidth: '700px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
          <circle cx="350" cy="30" r="22" fill="#e74c3c" />
          <text x="330" y="35" fontSize="11" fill="#fff">Source</text>
          {[[100,150],[250,150],[400,150],[550,150],[600,150]].map(([x,y],i) => (
            <g key={i}>
              <line x1="350" y1="52" x2={x} y2={y-20} stroke="#e74c3c" strokeWidth="1.5" strokeDasharray="4,3" />
              <circle cx={x} cy={y} r="18" fill="#95a5a6" />
            </g>
          ))}
          <text x="230" y="190" fontSize="12" fill="#555">Flood sent to ALL ports, even if no receiver needs it</text>
        </svg>
        <div style={solutionBox}>
          <b>EVPN Solution:</b> MAC/IP info is learned via BGP (Type 2 routes) instead of data-plane
          flooding. Combined with <b>ARP/ND suppression</b> at the ingress PE, most ARP requests are
          answered locally without flooding across the fabric — drastically reducing BUM traffic.
        </div>
      </section>

      {/* Point 4: Hairpinning */}
      <section style={{ marginBottom: '50px' }}>
        <h3>4. Hairpinning for Routed Traffic</h3>
        <p>
          In traditional designs, even when two hosts are on <b>different VLANs but the same
          physical leaf/ToR switch</b>, routed traffic must travel up to a central router/gateway
          and come back down — instead of being routed locally. This "hairpin" adds unnecessary
          latency and load on the core.
        </p>
        <svg viewBox="0 0 700 220" style={{ width: '100%', maxWidth: '700px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
          <rect x="300" y="20" width="100" height="35" fill="#8e44ad" rx="4" />
          <text x="315" y="43" fontSize="12" fill="#fff">Router</text>
          <rect x="100" y="160" width="100" height="35" fill="#3498db" rx="4" />
          <text x="115" y="183" fontSize="12" fill="#fff">Host A</text>
          <rect x="500" y="160" width="100" height="35" fill="#3498db" rx="4" />
          <text x="515" y="183" fontSize="12" fill="#fff">Host B</text>
          <rect x="250" y="160" width="200" height="35" fill="#2c3e50" rx="4" opacity="0.15" />
          <text x="260" y="183" fontSize="11" fill="#555">Same Leaf Switch</text>

          <line x1="150" y1="160" x2="330" y2="55" stroke="#e74c3c" strokeWidth="2" />
          <line x1="370" y1="55" x2="550" y2="160" stroke="#e74c3c" strokeWidth="2" />
          <text x="220" y="100" fontSize="11" fill="#e74c3c">Traffic hairpins up & down</text>
          <text x="230" y="10" fontSize="12" fill="#555">Even though A &amp; B are on same switch!</text>
        </svg>
        <div style={solutionBox}>
          <b>EVPN Solution:</b> Implements a <b>Distributed Anycast Gateway</b> — every leaf/PE
          shares the same gateway IP/MAC for a subnet. Routing happens locally at the ingress leaf
          itself (Integrated Routing & Bridging - IRB), so Host A to Host B routed traffic never
          needs to leave the local switch.
        </div>
      </section>

      {/* Point 5: Poor Scalability */}
      <section style={{ marginBottom: '50px' }}>
        <h3>5. Poor Scalability</h3>
        <p>
          MAC address tables must hold every learned MAC across the entire flood domain, and
          flood domains keep growing as the network scales. Without a control-plane mechanism to
          summarize and filter this info, MAC table sizes and flooding volume grow roughly
          linearly (or worse) with the number of switches/hosts — limiting how large a network can
          practically grow.
        </p>
        <svg viewBox="0 0 700 220" style={{ width: '100%', maxWidth: '700px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
          <line x1="50" y1="180" x2="650" y2="180" stroke="#333" strokeWidth="1.5" />
          <line x1="50" y1="180" x2="50" y2="20" stroke="#333" strokeWidth="1.5" />
          <text x="10" y="100" fontSize="11" fill="#555" transform="rotate(-90 10,100)">MAC Table Size</text>
          <text x="330" y="205" fontSize="11" fill="#555"># of Switches / Hosts</text>

          <polyline points="50,170 150,150 250,120 350,90 450,55 550,25 650,10" fill="none" stroke="#e74c3c" strokeWidth="3" />
          <text x="480" y="40" fontSize="11" fill="#e74c3c">Flood-and-learn growth</text>
        </svg>
        <div style={solutionBox}>
          <b>EVPN Solution:</b> BGP naturally scales via Route Reflectors — PEs only learn what's
          relevant via <b>Route Target</b> import/export filtering, instead of every switch learning
          every MAC in the domain. This keeps MAC table growth controlled and predictable even as
          the fabric scales to hundreds of leafs.
        </div>
      </section>

    </>
  )
}