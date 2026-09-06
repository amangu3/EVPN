const solutionBox = {
  background: '#eafaf1',
  border: '1px solid #2ecc71',
  borderRadius: '8px',
  padding: '12px 16px',
  marginTop: '12px',
}

export default function L3RoutingLimitation() {
  return (
    <>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px' }}>
        Can We Just Do L3 Routing?
      </h2>

      {/* Point 1: Modern cloud-native apps are fine with pure L3 */}
      <section style={{ marginBottom: '50px' }}>
        <h3>1. Modern Apps (Kubernetes / Cloud-Native): Pure L3 Works Fine</h3>
        <p>
          Today's cloud-native workloads — <b>Kubernetes pods, microservices, containers</b> —
          are built to be <b>stateless and horizontally scalable</b>. They don't care which
          rack, which subnet, or which physical node they land on. Service discovery, load
          balancers, and orchestration all happen above the network layer. So for this kind
          of workload, routing every rack as its own L3 subnet works perfectly well — no need
          for a stretched L2 domain at all.
        </p>
        <svg viewBox="0 0 700 220" style={{ width: '100%', maxWidth: '700px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
          <rect x="280" y="20" width="140" height="40" rx="6" fill="#8e44ad" />
          <text x="300" y="45" fontSize="13" fill="#fff">Spine</text>

          <rect x="60" y="110" width="150" height="40" rx="6" fill="#3498db" />
          <text x="80" y="135" fontSize="12" fill="#fff">ToR - Rack1</text>
          <text x="65" y="102" fontSize="11" fill="#555">10.1.1.0/24</text>

          <rect x="280" y="110" width="150" height="40" rx="6" fill="#3498db" />
          <text x="300" y="135" fontSize="12" fill="#fff">ToR - Rack2</text>
          <text x="285" y="102" fontSize="11" fill="#555">10.1.2.0/24</text>

          <rect x="500" y="110" width="150" height="40" rx="6" fill="#3498db" />
          <text x="520" y="135" fontSize="12" fill="#fff">ToR - Rack3</text>
          <text x="505" y="102" fontSize="11" fill="#555">10.1.3.0/24</text>

          <line x1="130" y1="110" x2="330" y2="60" stroke="#2ecc71" strokeWidth="3" />
          <line x1="350" y1="110" x2="350" y2="60" stroke="#2ecc71" strokeWidth="3" />
          <line x1="570" y1="110" x2="370" y2="60" stroke="#2ecc71" strokeWidth="3" />

          <circle cx="100" cy="180" r="14" fill="#f1c40f" /><text x="60" y="205" fontSize="10" fill="#333">Pod A</text>
          <circle cx="320" cy="180" r="14" fill="#f1c40f" /><text x="280" y="205" fontSize="10" fill="#333">Pod B</text>
          <circle cx="540" cy="180" r="14" fill="#f1c40f" /><text x="500" y="205" fontSize="10" fill="#333">Pod C</text>

          <text x="180" y="30" fontSize="11" fill="#555">Pods are stateless — any rack, any subnet is fine</text>
        </svg>
        <div style={solutionBox}>
          <b>Why this works:</b> if a pod dies or is rescheduled elsewhere, it simply comes up
          with a new IP in that rack's subnet — nothing depends on keeping the old IP alive.
          Pure L3 routing (ECMP, no STP, no vPC) is the right fit here.
        </div>
      </section>

      {/* Point 2: Legacy apps need L2 across geography */}
      <section style={{ marginBottom: '50px' }}>
        <h3>2. Legacy Apps: Still Need to Be on the Same Subnet</h3>
        <p>
          Not everything in the data center is cloud-native. A lot of <b>older applications</b>{' '}
          — clustering software, legacy databases, appliances with hardcoded IPs, heartbeat/
          failover mechanisms — were built assuming <b>L2 adjacency</b>. These app servers can
          be <b>geographically spread across different racks or even different buildings/DCs</b>,
          but the application still expects all its members to sit in the <b>same subnet</b> and
          be able to reach each other via L2 broadcast/ARP.
        </p>
        <p>
          For these apps, you simply <b>can't remove switching / L2VPN services</b> and replace
          them with pure routing — the application would break, because it was never designed
          to tolerate being routed across subnet boundaries.
        </p>
        <svg viewBox="0 0 700 220" style={{ width: '100%', maxWidth: '700px', background: '#fafafa', border: '1px solid #eee', borderRadius: '8px' }}>
          <rect x="60" y="30" width="160" height="60" rx="6" fill="none" stroke="#333" strokeDasharray="4,3" />
          <text x="70" y="24" fontSize="11" fill="#555">Site A - Rack1</text>
          <circle cx="140" cy="60" r="16" fill="#e67e22" />
          <text x="110" y="105" fontSize="10" fill="#333">Legacy Server 1</text>

          <rect x="500" y="30" width="160" height="60" rx="6" fill="none" stroke="#333" strokeDasharray="4,3" />
          <text x="510" y="24" fontSize="11" fill="#555">Site B - Rack9</text>
          <circle cx="580" cy="60" r="16" fill="#e67e22" />
          <text x="550" y="105" fontSize="10" fill="#333">Legacy Server 2</text>

          <text x="270" y="20" fontSize="11" fill="#555">Same subnet, e.g. 10.5.5.0/24, required on both sides</text>
          <line x1="220" y1="60" x2="500" y2="60" stroke="#2ecc71" strokeWidth="3" />
          <text x="290" y="55" fontSize="11" fill="#2ecc71">L2 extended (L2VPN)</text>

          <text x="60" y="150" fontSize="11" fill="#555">If routed instead:</text>
          <text className="none" x="60" y="175" fontSize="11" fill="#e74c3c">
            Cluster heartbeat / hardcoded IP / broadcast-dependent app breaks
          </text>
        </svg>
        <p>
          This is exactly the kind of requirement that made vPC/MLAG-style L2 stretching popular
          in the first place — and why it can't simply be thrown away in favor of pure routing.
        </p>
      </section>

      {/* Point 3: VM mobility depends on stretched L2 */}
 
    </>
  )
}
