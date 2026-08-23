#!/bin/bash

cd src || exit

declare -A pages=(
  ["Home"]="EVPN Course Agenda"
  ["Fundamentals"]="EVPN Fundamentals"
  ["Bridging"]="Bridging"
  ["Routing"]="Routing"
  ["Multihoming"]="Multi-Homing"
  ["UnderlayOverlay"]="Underlay and Overlay Design Options"
  ["ServiceInsertion"]="Service Insertion"
  ["DciMultipodMultisite"]="Interconnecting Fabrics (DCI / Multi-Pod / Multi-Site)"
)

for name in "${!pages[@]}"; do
  title="${pages[$name]}"
  cat > "${name}.jsx" << EOF
import { Link } from 'react-router-dom'

export default function ${name}() {
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif' }}>
      <Link to="/" style={{ color: '#0066cc', textDecoration: 'none' }}>&larr; Back to Agenda</Link>
      <h1>${title}</h1>
      <p>Notes coming soon...</p>
    </div>
  )
}
EOF
done

echo "✅ All page components created directly in src/"
ls -la
