import { Link } from 'react-router-dom'

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

export default function BridgingStp() {
  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
      <Link to="/bridging" style={{ color: '#0066cc', textDecoration: 'none' }}>&larr; Back to Bridging Agenda</Link>
      <h1 style={{ marginTop: '10px' }}>How Bridging/Switching Works in STP Environment</h1>

      <style>
        {`
          @keyframes blinkDot { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
          .stp-blink { animation: blinkDot 1.1s ease-in-out infinite; }

          @keyframes pulseGreen { 0%, 100% { stroke-width: 2; } 50% { stroke-width: 4; } }
          .stp-active { animation: pulseGreen 2s ease-in-out infinite; }

          @keyframes popIn { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }
          .stp-pop-1 { animation: popIn 0.6s ease-out 0.5s both; }
          .stp-pop-2 { animation: popIn 0.6s ease-out 1.5s both; }
          .stp-pop-3 { animation: popIn 0.6s ease-out 2.5s both; }
          .stp-pop-4 { animation: popIn 0.6s ease-out 3.5s both; }

          @keyframes crownMove {
            0%   { transform: translateX(0); opacity: 0; }
            10%  { opacity: 1; }
            45%  { transform: translateX(0); opacity: 1; }
            55%  { transform: translateX(320px); opacity: 1; }
            100% { transform: translateX(320px); opacity: 1; }
          }
          .stp-crown { animation: crownMove 4s ease-in-out infinite; }
        `}
      </style>

      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px' }}>1. The Goal of STP</h2>
      <p>
        Spanning Tree Protocol's main goal is simple: build a <b>loop-free L2 topology</b>{' '}
        out of a physically redundant network. It does this by putting one or more{' '}
        <b>redundant ports into a Blocking (BLK) state</b> so that, logically, only a single
        active path exists between any two points — even though multiple physical links
        exist. Its <b>MAC learning (building the FIB)</b> happens purely through the{' '}
        <b>data plane</b> — switches learn MAC addresses only by observing traffic that
        actually passes through them, not through any control-plane exchange.
      </p>

      {/* ============================================================ */}
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px', marginTop: '40px' }}>
        2. Electing the Root Bridge
      </h2>
      <p>
        Before anything else, every switch in the topology needs to agree on a single{' '}
        <b>Root Bridge</b> — the logical "center" of the loop-free tree. Election works like
        this:
      </p>
      <ul>
        <li>Every switch advertises a <b>Bridge ID</b> = <code>Bridge Priority (default 32768) + MAC Address</code>, via BPDUs (Bridge Protocol Data Units) sent out every port.</li>
        <li>All switches compare Bridge IDs they receive. The switch with the <b>lowest Bridge ID wins</b> and becomes the Root Bridge.</li>
        <li>Priority is compared <b>first</b> — if two switches have the same priority (common, since 32768 is default everywhere), the <b>lowest MAC address</b> acts as the tie-breaker.</li>
        <li>Once elected, the Root Bridge's BPDUs propagate outward and every other switch calculates its shortest path back to it.</li>
      </ul>

      <svg viewBox="0 0 700 260" style={{ width: '100%', maxWidth: '700px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
        <text x="10" y="20" fontSize="13" fill="#333">Root Bridge Election — lowest Bridge ID wins</text>

        <rect x="60" y="60" width="200" height="70" rx="8" fill="#3498db" />
        <text x="90" y="90" fontSize="13" fill="#fff">Switch1</text>
        <text x="80" y="110" fontSize="11" fill="#fff">Prio 32768, MAC ...AA</text>

        <rect x="440" y="60" width="200" height="70" rx="8" fill="#3498db" />
        <text x="470" y="90" fontSize="13" fill="#fff">Switch4</text>
        <text x="490" y="110" fontSize="11" fill="#fff">Prio 32768, MAC ...FF</text>

        <text x="330" y="100" fontSize="13" fill="#555">vs</text>
        <text x="290" y="145" fontSize="12" fill="#555">Same priority → compare MAC → lowest MAC wins</text>

        {/* crown that moves to winner */}
        <g className="stp-crown">
          <text x="120" y="50" fontSize="22">👑</text>
        </g>

        <text x="70" y="200" fontSize="12" fill="#2ecc71">Switch1 has the lower MAC (...AA &lt; ...FF)</text>
        <text x="70" y="220" fontSize="13" fill="#2ecc71" fontWeight="bold">→ Switch1 becomes the Root Bridge</text>
      </svg>

      <div style={infoBox}>
        <b>Why this matters:</b> Everything downstream — port roles, which links get
        blocked — depends entirely on where the Root Bridge sits. Change the Root Bridge and
        the entire tree's shape (and which links get blocked) can change too.
      </div>

      {/* ============================================================ */}
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px', marginTop: '40px' }}>
        3. Assigning Port Roles: DP, RP, BLK
      </h2>
      <p>
        Once the Root Bridge is known, every non-root switch decides a role for each of its
        ports by comparing the <b>cost to reach the Root Bridge</b> through that port:
      </p>
      <ul>
        <li><b>Root Port (RP)</b> — the port with the <b>lowest cost path back to the Root Bridge</b>. Every non-root switch has exactly <b>one</b> RP.</li>
        <li><b>Designated Port (DP)</b> — on each network segment, the port that offers the <b>lowest-cost advertisement onto that segment</b> becomes Designated. All Root Bridge ports are always DP.</li>
        <li><b>Blocking (BLK)</b> — any port on a segment that is <b>neither</b> the segment's RP nor its DP stays in blocking state — it doesn't forward data traffic, breaking the loop.</li>
      </ul>

      <svg viewBox="0 0 700 380" style={{ width: '100%', maxWidth: '700px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
        <text x="10" y="20" fontSize="13" fill="#333">Electing Root Bridge and Assigning Port Roles</text>

        <rect x="80" y="45" width="180" height="55" rx="8" fill="#3498db" />
        <text x="90" y="78" fontSize="13" fill="#fff">Root Bridge</text>
        <rect x="440" y="45" width="180" height="55" rx="8" fill="#3498db" />
        <text x="480" y="78" fontSize="13" fill="#fff">Switch4</text>

        <rect x="80" y="200" width="180" height="55" rx="8" fill="#3498db" />
        <text x="105" y="233" fontSize="13" fill="#fff">Switch1</text>
        <rect x="440" y="200" width="180" height="55" rx="8" fill="#3498db" />
        <text x="465" y="233" fontSize="13" fill="#fff">Switch2</text>

        {/* Root - Switch1 : DP - RP (active) */}
        <line className="stp-active" x1="170" y1="100" x2="170" y2="200" stroke="#2ecc71" strokeWidth="2.5" />
        <text x="100" y="120" fontSize="10" fill="#2ecc71">DP</text>
        <text x="180" y="185" fontSize="10" fill="#2ecc71">RP</text>

        {/* Root - Switch2 : DP - DP (active, cross) */}
        <line className="stp-active" x1="255" y1="100" x2="445" y2="200" stroke="#2ecc71" strokeWidth="2.5" />
        <text x="250" y="120" fontSize="10" fill="#2ecc71">DP</text>
        <text x="380" y="185" fontSize="10" fill="#2ecc71">DP</text>

        {/* Switch4 - Switch1 : RP - DP (active, cross) */}
        <line className="stp-active" x1="445" y1="100" x2="255" y2="200" stroke="#2ecc71" strokeWidth="2.5" />
        <text x="380" y="120" fontSize="10" fill="#2ecc71">RP</text>
        <text x="250" y="185" fontSize="10" fill="#2ecc71">DP</text>

        {/* Switch4 - Switch2 : BLK (blocked) */}
        <line className="stp-blink" x1="530" y1="100" x2="530" y2="200" stroke="#e74c3c" strokeWidth="2.5" strokeDasharray="8,5" />
        <text x="480" y="120" fontSize="10" fill="#e74c3c">RP</text>
        <text className="stp-blink" x="535" y="120" fontSize="10" fill="#e74c3c">BLK</text>

        {/* Endpoints */}
        <rect x="80" y="300" width="180" height="55" rx="8" fill="#95a5a6" />
        <text x="90" y="325" fontSize="12" fill="#fff">Endpoint1</text>
        <text x="90" y="342" fontSize="11" fill="#fff">MAC A</text>
        <line x1="170" y1="255" x2="170" y2="300" stroke="#333" strokeWidth="1.5" />

        <rect x="440" y="300" width="180" height="55" rx="8" fill="#95a5a6" />
        <text x="450" y="325" fontSize="12" fill="#fff">Endpoint2</text>
        <text x="450" y="342" fontSize="11" fill="#fff">MAC B</text>
        <line x1="530" y1="255" x2="530" y2="300" stroke="#333" strokeWidth="1.5" />
      </svg>

      <div style={keyBox}>
        <b>Reading this diagram:</b> All 3 green links stay active (forwarding) — every
        Root-Bridge port is DP, Switch1 and Switch2's uplinks are their RP (lowest cost to
        root), and both cross-links to the Root are DP/RP pairs too. Only the{' '}
        <b>Switch4&ndash;Switch2 link</b> has no useful role left to assign on that segment —
        it becomes <b>BLK</b>, breaking the physical loop while every switch still has a path
        to the root.
      </div>

      {/* ============================================================ */}
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px', marginTop: '40px' }}>
        4. Building the FIB / MAC Address Table (Data-Plane Learning)
      </h2>
      <p>
        With the loop-free tree now in place, switches start learning MAC addresses purely
        by <b>watching traffic</b> — this is "flood and learn." Let's walk through Endpoint1
        (MAC A) sending an <b>ARP request</b> to find Endpoint2 (MAC B), and getting an{' '}
        <b>ARP reply</b> back.
      </p>

      <h3 style={{ marginTop: '20px' }}>Step 1 — ARP Request (Broadcast) Floods Everywhere</h3>
      <p>
        Endpoint1 doesn't know MAC B yet, so it sends an <b>ARP request</b> — a{' '}
        <b>broadcast</b> frame (destination FF:FF:FF:FF:FF:FF). A switch's rule for any
        broadcast/unknown-unicast frame is simple: <b>flood it out every port except the one
        it came in on</b> (and never out a BLK port). Every switch it passes through also{' '}
        <b>learns "MAC A is reachable via the port this frame arrived on."</b>
      </p>

      <svg viewBox="0 0 700 380" style={{ width: '100%', maxWidth: '700px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
        <text x="10" y="20" fontSize="13" fill="#333">Building FIB / MAC Address Table — ARP Request (flood)</text>

        {/* MAC tables */}
        <g className="stp-pop-1">
          <rect x="0" y="45" width="80" height="55" rx="4" fill="#fff8e1" stroke="#f1c40f" />
          <text x="6" y="58" fontSize="9" fill="#8a6d00">MAC  Port</text>
          <text x="6" y="72" fontSize="9" fill="#8a6d00">A    e11</text>
        </g>
        <g className="stp-pop-2">
          <rect x="620" y="45" width="80" height="55" rx="4" fill="#fff8e1" stroke="#f1c40f" />
          <text x="626" y="58" fontSize="9" fill="#8a6d00">MAC  Port</text>
          <text x="626" y="72" fontSize="9" fill="#8a6d00">A    e11</text>
        </g>

        <rect x="80" y="45" width="180" height="55" rx="8" fill="#3498db" />
        <text x="90" y="70" fontSize="13" fill="#fff">Root Bridge</text>
        <text x="90" y="88" fontSize="10" fill="#fff">e11 DP    e12 DP</text>
        <rect x="440" y="45" width="180" height="55" rx="8" fill="#3498db" />
        <text x="480" y="70" fontSize="13" fill="#fff">Switch4</text>
        <text x="470" y="88" fontSize="10" fill="#fff">e11 RP   e12 BLK</text>

        <g className="stp-pop-3">
          <rect x="0" y="200" width="80" height="55" rx="4" fill="#fff8e1" stroke="#f1c40f" />
          <text x="6" y="213" fontSize="9" fill="#8a6d00">MAC  Port</text>
          <text x="6" y="227" fontSize="9" fill="#8a6d00">A    e1</text>
        </g>
        <g className="stp-pop-4">
          <rect x="620" y="200" width="80" height="55" rx="4" fill="#fff8e1" stroke="#f1c40f" />
          <text x="626" y="213" fontSize="9" fill="#8a6d00">MAC  Port</text>
          <text x="626" y="227" fontSize="9" fill="#8a6d00">A    e11</text>
        </g>

        <rect x="80" y="200" width="180" height="55" rx="8" fill="#3498db" />
        <text x="105" y="225" fontSize="13" fill="#fff">Switch1</text>
        <text x="90" y="243" fontSize="10" fill="#fff">e11 RP   e12 DP</text>
        <rect x="440" y="200" width="180" height="55" rx="8" fill="#3498db" />
        <text x="465" y="225" fontSize="13" fill="#fff">Switch2</text>
        <text x="450" y="243" fontSize="10" fill="#fff">e11 RP   e12 DP</text>

        <line x1="170" y1="100" x2="170" y2="200" stroke="#2ecc71" strokeWidth="2" />
        <line x1="255" y1="100" x2="445" y2="200" stroke="#2ecc71" strokeWidth="2" />
        <line x1="445" y1="100" x2="255" y2="200" stroke="#2ecc71" strokeWidth="2" />
        <line x1="530" y1="100" x2="530" y2="200" stroke="#e74c3c" strokeWidth="2" strokeDasharray="8,5" />

        <rect x="80" y="300" width="180" height="55" rx="8" fill="#95a5a6" />
        <text x="90" y="325" fontSize="12" fill="#fff">Endpoint1</text>
        <text x="90" y="342" fontSize="11" fill="#fff">MAC A</text>
        <line x1="170" y1="255" x2="170" y2="300" stroke="#333" strokeWidth="1.5" />
        <rect x="440" y="300" width="180" height="55" rx="8" fill="#95a5a6" />
        <text x="450" y="325" fontSize="12" fill="#fff">Endpoint2</text>
        <text x="450" y="342" fontSize="11" fill="#fff">MAC B</text>
        <line x1="530" y1="255" x2="530" y2="300" stroke="#333" strokeWidth="1.5" />

        {/* flooding packet: goes from Endpoint1 to Switch1 then floods to Root and Switch2, not through blocked link */}
        <circle r="7" fill="#e67e22">
          <animateMotion dur="3s" repeatCount="indefinite" path="M 170,300 L 170,227 L 170,100 L 445,200" />
        </circle>
        <circle r="7" fill="#e67e22">
          <animateMotion dur="3s" repeatCount="indefinite" path="M 170,300 L 170,227 L 255,200" />
        </circle>
        <circle r="7" fill="#e67e22">
          <animateMotion dur="3s" repeatCount="indefinite" path="M 255,200 L 445,100 L 530,100" />
        </circle>

        <text x="330" y="20" fontSize="11" fill="#e67e22">Broadcast floods every active path — never over BLK</text>
      </svg>

      <div style={infoBox}>
        <b>What just happened:</b> As the ARP request flooded outward, <b>every switch it
        crossed learned "MAC A → the ingress port it arrived on."</b> Notice each switch
        records a <b>different port</b> for MAC A, because that's simply which local port the
        frame entered through at that hop. The frame reaches Endpoint2 (via Switch2), since
        the BLK port on Switch4&ndash;Switch2 correctly stops it from looping back around.
      </div>

      <h3 style={{ marginTop: '30px' }}>Step 2 — ARP Reply (Unicast) Retraces the Path, Learning MAC B</h3>
      <p>
        Endpoint2 now knows MAC A (learned from the ARP request payload) and replies directly
        with a <b>unicast ARP reply</b> destined to MAC A. Because every switch along the
        return path already has MAC A in its table from Step 1, this reply is <b>not
        flooded</b> — it's forwarded out exactly one port each hop, straight back to
        Endpoint1. Along the way, every switch also learns{' '}
        <b>"MAC B → the port this reply arrived on."</b>
      </p>

      <svg viewBox="0 0 700 380" style={{ width: '100%', maxWidth: '700px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
        <text x="10" y="20" fontSize="13" fill="#333">ARP Reply (unicast) — retraces the path back, learns MAC B</text>

        <g className="stp-pop-1">
          <rect x="0" y="45" width="80" height="65" rx="4" fill="#eafaf1" stroke="#2ecc71" />
          <text x="6" y="58" fontSize="9" fill="#1e7e34">MAC  Port</text>
          <text x="6" y="72" fontSize="9" fill="#1e7e34">A    e11</text>
          <text x="6" y="86" fontSize="9" fill="#1e7e34">B    e12</text>
        </g>
        <rect x="80" y="45" width="180" height="55" rx="8" fill="#3498db" />
        <text x="90" y="70" fontSize="13" fill="#fff">Root Bridge</text>
        <rect x="440" y="45" width="180" height="55" rx="8" fill="#3498db" />
        <text x="480" y="70" fontSize="13" fill="#fff">Switch4</text>

        <g className="stp-pop-3">
          <rect x="0" y="200" width="80" height="65" rx="4" fill="#eafaf1" stroke="#2ecc71" />
          <text x="6" y="213" fontSize="9" fill="#1e7e34">MAC  Port</text>
          <text x="6" y="227" fontSize="9" fill="#1e7e34">A    e1</text>
          <text x="6" y="241" fontSize="9" fill="#1e7e34">B    e12</text>
        </g>
        <g className="stp-pop-4">
          <rect x="620" y="200" width="80" height="65" rx="4" fill="#eafaf1" stroke="#2ecc71" />
          <text x="626" y="213" fontSize="9" fill="#1e7e34">MAC  Port</text>
          <text x="626" y="227" fontSize="9" fill="#1e7e34">A    e11</text>
          <text x="626" y="241" fontSize="9" fill="#1e7e34">B    e1</text>
        </g>

        <rect x="80" y="200" width="180" height="55" rx="8" fill="#3498db" />
        <text x="105" y="225" fontSize="13" fill="#fff">Switch1</text>
        <rect x="440" y="200" width="180" height="55" rx="8" fill="#3498db" />
        <text x="465" y="225" fontSize="13" fill="#fff">Switch2</text>

        <line x1="170" y1="100" x2="170" y2="200" stroke="#2ecc71" strokeWidth="2" />
        <line x1="255" y1="100" x2="445" y2="200" stroke="#2ecc71" strokeWidth="2" />
        <line x1="445" y1="100" x2="255" y2="200" stroke="#ccc" strokeWidth="2" />
        <line x1="530" y1="100" x2="530" y2="200" stroke="#e74c3c" strokeWidth="2" strokeDasharray="8,5" />

        <rect x="80" y="300" width="180" height="55" rx="8" fill="#95a5a6" />
        <text x="90" y="325" fontSize="12" fill="#fff">Endpoint1</text>
        <text x="90" y="342" fontSize="11" fill="#fff">MAC A</text>
        <line x1="170" y1="255" x2="170" y2="300" stroke="#333" strokeWidth="1.5" />
        <rect x="440" y="300" width="180" height="55" rx="8" fill="#95a5a6" />
        <text x="450" y="325" fontSize="12" fill="#fff">Endpoint2</text>
        <text x="450" y="342" fontSize="11" fill="#fff">MAC B</text>
        <line x1="530" y1="255" x2="530" y2="300" stroke="#333" strokeWidth="1.5" />

        {/* unicast reply retracing exact reverse path */}
        <circle r="7" fill="#2ecc71">
          <animateMotion dur="3s" repeatCount="indefinite" path="M 530,300 L 530,255 L 445,200 L 255,100 L 170,200 L 170,255 L 170,300" />
        </circle>

        <text x="270" y="20" fontSize="11" fill="#2ecc71">Unicast — single known path only, no flooding needed</text>
      </svg>

      <div style={keyBox}>
        <b>End result:</b> After just this one request/reply exchange, every switch along
        the path has both <b>MAC A and MAC B</b> in its FIB. Any future frame between these
        two endpoints will now be <b>unicast-forwarded directly</b> — no more flooding needed,
        as long as the entries stay in each switch's MAC table (aged out after a timeout if
        unused).
      </div>

      <div style={infoBox}>
        <b>The core limitation this sets up:</b> This entire learning process is purely
        data-plane driven — a switch only knows a MAC exists after traffic from it has
        actually passed through. There's no way for a switch to "ask" another switch what it
        knows. This is exactly the gap EVPN's BGP-based control plane closes, as covered in
        the next section.
      </div>
    </div>
  )
}