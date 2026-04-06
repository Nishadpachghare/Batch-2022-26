import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Journey from "./pages/Journey";
import Yearbook from "./pages/Yearbook";
import MediaVault from "./pages/MediaVault";
import Wall from "./pages/WallLive";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/yearbook" element={<Yearbook />} />
        <Route path="/vault" element={<MediaVault />} />
        <Route path="/wall" element={<Wall />} />
      </Routes>
    </BrowserRouter>
  );
}
