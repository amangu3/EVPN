const problemBox = {
  background: '#fdecea',
  border: '1px solid #e74c3c',
  borderRadius: '8px',
  padding: '12px 16px',
  marginTop: '12px',
}

const solutionBox = {
  background: '#eafaf1',
  border: '1px solid #2ecc71',
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

export default function VmMobility() {
  return (
    <section style={{ marginBottom: '50px' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px' }}>
        3. VM Mobility Also Relies on a Stretched L2 Domain
      </h2>

      <style>
        {`
          @keyframes blinkRed {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
          .vm-blocked { animation: blinkRed 1.4s ease-in-out infinite; }
          @keyframes pulseGreen {
            0%, 100% { stroke-width: 3; }
            50% { stroke-width: 5; }
          }
          .vm-active-pulse { animation: pulseGreen 2s ease-in-out infinite; }
          @keyframes flyMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(560px, 0); }
          }
        `}
      </style>

      <h3>The Setup</h3>
      <p>
        A client sends <b>HTTP GET example.com</b>. This hits the L3 Fabric, which routes it
        down to <b>ToR 1</b> (subnet <b>10.10.10.0/24</b>), which connects to{' '}
        <b>Hypervisor1</b>. Hypervisor1 is running a VM — <b>web-server</b> — with IP{' '}
        <b>10.10.10.100</b>. A DNS record maps <code>example.com</code> to this exact IP
        (<code>example.com @ 10.10.10.100</code>). Meanwhile <b>ToR 2</b> sits on a completely
        different subnet — <b>10.20.20.0/24</b> — and connects to <b>Hypervisor2</b>.
      </p>

      <svg viewBox="0 0 900 420" style={{ width: '100%', maxWidth: '900px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
        {/* Clients */}
        <rect x="380" y="20" width="160" height="45" rx="8" fill="#f1c40f" />
        <text x="415" y="48" fontSize="13" fill="#333">Clients</text>
        <text x="120" y="15" fontSize="12" fill="#555">HTTP GET example.com</text>
        <line x1="270" y1="20" x2="400" y2="60" stroke="#333" strokeWidth="1.5" markerEnd="url(#arrow)" />

        {/* DNS server */}
        <text x="700" y="15" fontSize="12" fill="#555">DNS Server</text>
        <text x="700" y="30" fontSize="12" fill="#555">example.com @ 10.10.10.100</text>
        <line x1="700" y1="55" x2="700" y2="35" stroke="#333" strokeWidth="1.5" markerEnd="url(#arrow)" />

        {/* L3 Fabric */}
        <rect x="380" y="90" width="160" height="45" rx="8" fill="#3498db" />
        <text x="410" y="118" fontSize="13" fill="#fff">L3 Fabric</text>
        <line x1="460" y1="65" x2="460" y2="90" stroke="#333" strokeWidth="2" />

        {/* ToR1 */}
        <rect x="140" y="200" width="180" height="55" rx="6" fill="#3498db" />
        <text x="175" y="222" fontSize="13" fill="#fff">ToR 1</text>
        <text x="160" y="242" fontSize="12" fill="#fff">10.10.10.0/24</text>
        <line x1="400" y1="135" x2="230" y2="200" stroke="#333" strokeWidth="2" />

        {/* ToR2 */}
        <rect x="580" y="200" width="180" height="55" rx="6" fill="#3498db" />
        <text x="615" y="222" fontSize="13" fill="#fff">ToR 2</text>
        <text x="600" y="242" fontSize="12" fill="#fff">10.20.20.0/24</text>
        <line x1="520" y1="135" x2="670" y2="200" stroke="#333" strokeWidth="2" />

        {/* Hypervisor1 */}
        <rect x="140" y="285" width="180" height="55" rx="6" fill="#e74c3c" />
        <text x="150" y="315" fontSize="13" fill="#fff">Hypervisor1</text>
        <line x1="230" y1="255" x2="230" y2="285" stroke="#333" strokeWidth="2" />

        {/* Hypervisor2 */}
        <rect x="580" y="285" width="180" height="55" rx="6" fill="#e74c3c" />
        <text x="590" y="315" fontSize="13" fill="#fff">Hypervisor2</text>
        <line x1="670" y1="255" x2="670" y2="285" stroke="#333" strokeWidth="2" />

        {/* VM box - animated moving from HV1 to HV2 */}
        <g className="vm-fly" style={{ animation: 'flyMove 4s ease-in-out infinite alternate' }}>
          <rect x="160" y="355" width="140" height="45" rx="6" fill="#2ecc71" />
          <text x="185" y="372" fontSize="11" fill="#fff">VM: web-server</text>
          <text x="185" y="388" fontSize="11" fill="#fff">10.10.10.100</text>
        </g>

        <text x="330" y="400" fontSize="12" fill="#e74c3c">VM tries to migrate carrying the SAME IP →</text>

        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="#333" />
          </marker>
        </defs>
      </svg>

      <h3 style={{ marginTop: '30px' }}>The Scenario: Migrating the VM</h3>
      <p>
        Suppose we need to move the <b>web-server VM</b> from <b>Hypervisor1</b> (under ToR 1,
        subnet 10.10.10.0/24) to <b>Hypervisor2</b> (under ToR 2, subnet{' '}
        <b>10.20.20.0/24</b>) — a completely different subnet. The VM wants to carry the{' '}
        <b>same IP address (10.10.10.100)</b> along with it. If the two hypervisors sit on{' '}
        <b>different L3 subnets</b>, this becomes a real problem.
      </p>

      <h3 style={{ marginTop: '30px' }}>What Breaks If Subnets Are Different</h3>
      <p>
        Once the VM lands on Hypervisor2 (subnet 10.20.20.0/24) but is still configured with
        IP 10.10.10.100 (which belongs to ToR 1's subnet), that IP is no longer valid or
        routable in its new location. To keep things working, you'd be forced to do one of
        these:
      </p>

      <div style={problemBox}>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li><b>Manually change the VM's IP</b> to something in 10.20.20.0/24 — disruptive, error-prone, and needs coordination.</li>
          <li><b>Trigger a DHCP renew</b> so the VM picks up a new IP valid for the new subnet — but this still changes the IP.</li>
          <li><b>Update the DNS record</b> for <code>example.com</code> to point to the new IP — takes time to propagate (TTL delays), and clients may cache the old IP.</li>
          <li><b>Update the Load Balancer</b> pool member IP — another manual/automated step, another point of failure, another delay.</li>
        </ol>
      </div>

      <p>
        All four of these are extra operational steps, each with its own delay and failure
        risk — and all of them exist <b>only because the VM changed subnets</b> when it moved.
      </p>

      <h3 style={{ marginTop: '30px' }}>The Fix: Stretch L2 Across Both Hypervisors</h3>
      <p>
        None of this manual work is needed if <b>Hypervisor1 and Hypervisor2 are connected
        over the same stretched L2 network</b> (i.e., the 10.10.10.0/24 subnet is extended /
        stretched to also be reachable under ToR 2). In that case, the VM migrates carrying
        its original IP <b>10.10.10.100</b>, and that IP is <b>still valid and routable</b>{' '}
        right where it landed — no IP change, no DHCP renew, no DNS update, no Load Balancer
        update. Everything just keeps working transparently.
      </p>

      <svg viewBox="0 0 900 340" style={{ width: '100%', maxWidth: '900px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
        <text x="10" y="20" fontSize="13" fill="#333">With Stretched L2 (10.10.10.0/24 present under BOTH ToRs)</text>

        {/* stretched L2 boundary */}
        <rect x="60" y="40" width="780" height="260" rx="20" fill="#f3ecfb" stroke="#8e44ad" strokeWidth="2" strokeDasharray="8,5" />
        <text x="380" y="60" fontSize="12" fill="#8e44ad">Stretched L2 Domain — 10.10.10.0/24</text>

        {/* ToR1 */}
        <rect x="140" y="90" width="180" height="55" rx="6" fill="#3498db" />
        <text x="175" y="112" fontSize="13" fill="#fff">ToR 1</text>
        <text x="160" y="132" fontSize="12" fill="#fff">10.10.10.0/24</text>

        {/* ToR2 - now also serving the same subnet */}
        <rect x="580" y="90" width="180" height="55" rx="6" fill="#3498db" />
        <text x="615" y="112" fontSize="13" fill="#fff">ToR 2</text>
        <text x="600" y="132" fontSize="12" fill="#fff">10.10.10.0/24</text>

        {/* Hypervisor1 */}
        <rect x="140" y="175" width="180" height="50" rx="6" fill="#e74c3c" />
        <text x="150" y="204" fontSize="13" fill="#fff">Hypervisor1</text>
        <line x1="230" y1="145" x2="230" y2="175" stroke="#333" strokeWidth="2" />

        {/* Hypervisor2 */}
        <rect x="580" y="175" width="180" height="50" rx="6" fill="#e74c3c" />
        <text x="590" y="204" fontSize="13" fill="#fff">Hypervisor2</text>
        <line x1="670" y1="145" x2="670" y2="175" stroke="#333" strokeWidth="2" />

        {/* migration arrow, VM keeps same IP */}
        <line className="vm-active-pulse" x1="320" y1="200" x2="580" y2="200" stroke="#2ecc71" strokeWidth="3" markerEnd="url(#arrow2)" />
        <text x="370" y="190" fontSize="12" fill="#2ecc71">VM migrates, IP unchanged</text>

        <rect x="600" y="240" width="140" height="45" rx="6" fill="#2ecc71" />
        <text x="618" y="257" fontSize="11" fill="#fff">VM: web-server</text>
        <text x="618" y="273" fontSize="11" fill="#fff">10.10.10.100 ✓ still valid</text>

        <defs>
          <marker id="arrow2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="#2ecc71" />
          </marker>
        </defs>
      </svg>

      <div style={solutionBox}>
        <b>Why this matters:</b> No manual IP reassignment, no DHCP renew, no DNS record
        update, no Load Balancer reconfiguration. Since the IP subnet itself is present on
        both sides, the VM's identity (its IP) never needs to change — migration becomes
        completely transparent to clients, DNS, and load balancers.
      </div>

      <div style={infoBox}>
        <b>Why this is a "VM Mobility" argument for a stretched L2 / EVPN fabric:</b> Just
        like Ethernet Segments solved multi-homing and BGP-based control plane solved
        flooding, VM mobility is another reason a modern DC fabric needs to make an L2
        domain <b>span across many racks/leafs on demand</b> — without relying on legacy
        VLAN trunking sprawl or STP across the whole fabric. This is exactly what EVPN with
        VXLAN overlays provides: any subnet can be extended to any leaf that needs it, cleanly
        and at scale, using BGP to advertise where each VM/MAC/IP currently lives.
      </div>
    </section>
  )
}