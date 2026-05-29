import { Outlet, Route, Routes } from "react-router"
import Header from "./Header"
import Landing from "./Landing"
import About from "./About"
import Trip from "./Trip"
import ExploreMap from "./ExploreMap"
import Features from "./Features"

function App() {
  return (
    <>
    <Header />
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/about" element={<About/>} />
        <Route path="/planyourtrip" element={<Trip/>} />
        <Route path="/exploremap" element={<ExploreMap/>} />
        <Route path="/features" element={<Features/>} />
      </Routes>
      <Outlet/>
    </>
  )
}

export default App
