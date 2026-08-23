#!/bin/bash

cd src || exit

declare -A sections=(
  ["WhyEvpnExists"]="Why EVPN Exists"
  ["VpcProblems"]="What VPC Can't Solve"
  ["L3RoutingLimitation"]="Can We Just Do L3 Routing?"
  ["VmMobility"]="VM Mobility"
  ["EvpnArchitecture"]="EVPN High-Level Architecture"
  ["EvpnPacketWalk"]="EVPN Packet Walk"
)

for name in "${!sections[@]}"; do
  # skip if file already exists (don't overwrite WhyEvpnExists content later)
  if [ -f "${name}.jsx" ]; then
    echo "⚠️  ${name}.jsx already exists, skipping (not overwritten)"
    continue
  fi
  title="${sections[$name]}"
  cat > "${name}.jsx" << EOF
export default function ${name}() {
  return (
    <section style={{ marginBottom: '50px' }}>
      <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '8px' }}>${title}</h2>
      <p>Content coming soon...</p>
    </section>
  )
}
EOF
  echo "✅ Created ${name}.jsx"
done

echo "Done. Files in src/:"
ls -la *.jsx
