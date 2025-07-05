// pages/TruecallerLogin.jsx
import React from 'react';

const TruecallerLogin = () => {
  const isAndroidChrome = () => {
    return /Android/.test(navigator.userAgent) && /Chrome/.test(navigator.userAgent);
  };

  const generateNonce = () => {
    return crypto.randomUUID(); // Standard format
  };

  const handleLogin = () => {
    const requestNonce = generateNonce();
    const partnerKey = 'NdYnR43e796fb8a024fa697e2bed406d6e82f';
    const redirectUri = 'https://a2-d-mizna-test.vercel.app/truecaller/callback';

    const url = `https://api4.truecaller.com/v1/auth?requestNonce=${requestNonce}&partnerKey=${partnerKey}&redirectUri=${encodeURIComponent(redirectUri)}`;
    window.location.href = url;
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login with Truecaller</h2>
      {isAndroidChrome() ? (
        <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
          Login with Truecaller
        </button>
      ) : (
        <p style={{ color: 'red' }}>
          Truecaller login is only available on Android Chrome with the Truecaller app installed.
        </p>
      )}
    </div>
  );
};

export default TruecallerLogin;
