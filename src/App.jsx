import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TruecallerVerify from "./TruecallerVerify";
import Fallback from "./Fallback";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TruecallerVerify />} />
        <Route path="/fallback" element={<Fallback />} />
      </Routes>
    </Router>
  );
}

export default App;
