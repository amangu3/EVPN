import { Link } from 'react-router-dom'

export default function BridgingConfig() {
  return (
    <div style={{ maxWidth: '850px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
      <Link to="/bridging" style={{ color: '#0066cc', textDecoration: 'none' }}>&larr; Back to Bridging Agenda</Link>
      <h1 style={{ marginTop: '10px' }}>Configuration</h1>
      <p>Notes coming soon...</p>
    </div>
  )
}
