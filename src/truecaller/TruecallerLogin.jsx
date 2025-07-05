import React from 'react';

const TruecallerLogin = () => {
  const generateNonce = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleLogin = () => {
    const requestNonce = generateNonce();
    const partnerKey = 'RHbfG6eb16d266eac46d2b4143ca3aa251ca0';
    const redirectUri = 'http://localhost:3000/truecaller/callback';

    const url = `https://api4.truecaller.com/v1/auth?requestNonce=${requestNonce}&partnerKey=${partnerKey}&redirectUri=${encodeURIComponent(redirectUri)}`;
    window.location.href = url;
  };

  return (
    <div>
      <h2>Login with Truecaller</h2>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default TruecallerLogin;
