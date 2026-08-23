import { Link } from 'react-router-dom'

const agenda = [
  { title: 'EVPN Fundamentals', path: '/fundamentals', done: false },
  { title: 'Bridging', path: '/bridging', done: true },
  { title: 'Routing', path: '/routing', done: true },
  { title: 'Multi-Homing', path: '/multihoming', done: true },
  { title: 'Underlay and Overlay design options', path: '/underlay-overlay', done: false },
  { title: 'Service insertion', path: '/service-insertion', done: false },
  { title: 'Interconnecting multiple fabrics (DCI / Multi-Pod / Multi-Site / etc.)', path: '/dci-multipod-multisite', done: false },
]

export default function Home() {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 500, marginBottom: '30px' }}>Course Agenda</h1>
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
            {item.done && (
              <span style={{ color: '#2ecc71', marginLeft: '10px', fontSize: '1.3rem' }}>✓</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}