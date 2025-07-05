import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import TruecallerCallback from './TruecallerCallback';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/truecaller/callback" element={<TruecallerCallback />} />
        <Route path="/dashboard" element={<div>Welcome! See console for profile data.</div>} />
        <Route path="/privacy" element={<div>Privacy Policy here</div>} />
        <Route path="/terms" element={<div>Terms & Conditions here</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
