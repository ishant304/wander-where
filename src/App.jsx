import { Outlet, Route, Routes } from "react-router"
import Header from "./Header"
import Landing from "./Landing"
import About from "./About"
import Trip from "./Trip"
import ExploreMap from "./ExploreMap"

function App() {
  return (
    <>
    <Header />
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/about" element={<About/>} />
        <Route path="/planyourtrip" element={<Trip/>} />
        <Route path="/exploremap" element={<ExploreMap/>} />
      </Routes>
      <Outlet/>
    </>
  )
}

export default App
