import { Link } from 'react-router-dom'

export default function UnderlayOverlay() {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif' }}>
      <Link to="/" style={{ color: '#0066cc', textDecoration: 'none' }}>&larr; Back to Agenda</Link>
      <h1>Underlay and Overlay Design Options</h1>
      <p>Notes coming soon...</p>
    </div>
  )
}
