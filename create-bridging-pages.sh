#!/bin/bash

cd src || exit

declare -A pages=(
  ["BridgingStp"]="How Bridging/Switching Works in STP Environment"
  ["BridgingEvpn"]="How Bridging/Switching Works in EVPN"
  ["BridgingLab"]="Lab Overview"
  ["BridgingConfig"]="Configuration"
  ["BridgingPacketWalk"]="Packet Walks"
)

for name in "${!pages[@]}"; do
  if [ -f "${name}.jsx" ]; then
    echo "⚠️  ${name}.jsx already exists, skipping"
    continue
  fi
  title="${pages[$name]}"
  cat > "${name}.jsx" << EOF
import { Link } from 'react-router-dom'

export default function ${name}() {
  return (
    <div style={{ maxWidth: '850px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
      <Link to="/bridging" style={{ color: '#0066cc', textDecoration: 'none' }}>&larr; Back to Bridging Agenda</Link>
      <h1 style={{ marginTop: '10px' }}>${title}</h1>
      <p>Notes coming soon...</p>
    </div>
  )
}
EOF
  echo "✅ Created ${name}.jsx"
done

echo "Done."
ls -la Bridging*.jsx
