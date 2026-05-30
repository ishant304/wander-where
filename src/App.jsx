import { Outlet, Route, Routes } from "react-router"
import { Analytics } from "@vercel/analytics/react"
import Header from "./Header"
import Landing from "./Landing"
import Trip from "./Trip"
import Explore from "./Explore"
import Features from "./Features"

function App() {
  return (
    <>
    <Header />
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/planyourtrip" element={<Trip/>} />
        <Route path="/explore" element={<Explore/>} />
        <Route path="/features" element={<Features/>} />
      </Routes>
      <Outlet/>
      <Analytics />
    </>
  )
}

export default App
