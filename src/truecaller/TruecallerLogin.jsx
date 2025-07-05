import React from 'react';

const TruecallerLogin = () => {
  const generateNonce = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleLogin = () => {
    const requestNonce = generateNonce();
    const partnerKey = 'NdYnR43e796fb8a024fa697e2bed406d6e82f';
    const redirectUri = 'https://a2-d-mizna-test.vercel.app/truecaller/callback';

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
