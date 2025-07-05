import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TruecallerLogin from './truecaller/TruecallerLogin';
import TruecallerCallback from './truecaller/TruecallerCallback';
import Dashboard from './truecaller/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TruecallerLogin />} />
        <Route path="/truecaller/callback" element={<TruecallerCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
