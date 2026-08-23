import { Link } from 'react-router-dom'
import WhyEvpnExists from './WhyEvpnExists'
import VpcProblems from './VpcProblems'
import L3RoutingLimitation from './L3RoutingLimitation'
import VmMobility from './VmMobility'
import EvpnArchitecture from './EvpnArchitecture'
import EvpnPacketWalk from './EvpnPacketWalk'

export default function Fundamentals() {
  return (
    <div style={{ maxWidth: '850px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
      <Link to="/" style={{ color: '#0066cc', textDecoration: 'none' }}>&larr; Back to Agenda</Link>
      <h1 style={{ marginTop: '10px' }}>EVPN Fundamentals</h1>

      <WhyEvpnExists />
      <VpcProblems />
      <L3RoutingLimitation />
      <VmMobility />
      <EvpnArchitecture />
      <EvpnPacketWalk />

      <h2>Notes / To-Add Later</h2>
      <ul>
        <li>Add real topology from video (whiteboard) once available</li>
      </ul>
    </div>
  )
}