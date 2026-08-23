import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Fundamentals from './Fundamentals'
import Bridging from './Bridging'
import Routing from './Routing'
import Multihoming from './Multihoming'
import UnderlayOverlay from './UnderlayOverlay'
import ServiceInsertion from './ServiceInsertion'
import DciMultipodMultisite from './DciMultipodMultisite'

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
      </Routes>
    </BrowserRouter>
  )
}

export default App