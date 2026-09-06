import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Fundamentals from './Fundamentals'
import Bridging from './Bridging'
import Routing from './Routing'
import Multihoming from './Multihoming'
import UnderlayOverlay from './UnderlayOverlay'
import ServiceInsertion from './ServiceInsertion'
import DciMultipodMultisite from './DciMultipodMultisite'
import BridgingStp from './BridgingStp'
import BridgingEvpn from './BridgingEvpn'
import BridgingLab from './BridgingLab'
import BridgingConfig from './BridgingConfig'
import BridgingPacketWalk from './BridgingPacketWalk'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fundamentals" element={<Fundamentals />} />
        <Route path="/bridging" element={<Bridging />} />
        <Route path="/routing" element={<Routing />} />
        <Route path="/multihoming" element={<Multihoming />} />
        <Route path="/underlay-overlay" element={<UnderlayOverlay />} />
        <Route path="/service-insertion" element={<ServiceInsertion />} />
        <Route path="/dci-multipod-multisite" element={<DciMultipodMultisite />} />
        <Route path="/bridging/stp" element={<BridgingStp />} />
        <Route path="/bridging/evpn" element={<BridgingEvpn />} />
        <Route path="/bridging/lab" element={<BridgingLab />} />
        <Route path="/bridging/config" element={<BridgingConfig />} />
        <Route path="/bridging/packet-walk" element={<BridgingPacketWalk />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App