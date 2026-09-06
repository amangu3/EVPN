import { Link } from 'react-router-dom'

const agenda = [
  { title: 'How bridging/switching works in STP environment', path: '/bridging/stp' },
  { title: 'How bridging/switching works in EVPN', path: '/bridging/evpn' },
  { title: 'Lab overview', path: '/bridging/lab' },
  { title: 'Configuration', path: '/bridging/config' },
  { title: 'Packet walks', path: '/bridging/packet-walk' },
]

export default function Bridging() {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif' }}>
      <Link to="/" style={{ color: '#0066cc', textDecoration: 'none' }}>&larr; Back to Course Agenda</Link>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 500, margin: '20px 0 30px' }}>Agenda — Bridging</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {agenda.map((item) => (
          <li key={item.path} style={{ marginBottom: '22px', fontSize: '1.2rem' }}>
            <Link
              to={item.path}
              style={{
                color: '#1a1a1a',
                textDecoration: 'none',
                borderBottom: '2px solid #e0e0e0',
                paddingBottom: '2px',
              }}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}