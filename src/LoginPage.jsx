import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [requestId, setRequestId] = useState(null);
  const navigate = useNavigate();

  const startTruecaller = () => {
    const id = Date.now().toString();
    setRequestId(id);
    const appKey = 'NdYnR43e796fb8a024fa697e2bed406d6e82f';
    const privacyUrl = encodeURIComponent(window.location.origin + '/privacy');
    const termsUrl = encodeURIComponent(window.location.origin + '/terms');

    const deepLink = 
      `truecallersdk://truesdk/web_verify?` +
      `requestNonce=${id}&partnerKey=${appKey}` +
      `&partnerName=MiznaApp&lang=en&privacyUrl=${privacyUrl}` +
      `&termsUrl=${termsUrl}&ttl=10000&loginPrefix=continue`;

    window.location = deepLink;

    setTimeout(() => {
      if (document.hasFocus()) {
        console.log('Truecaller not installed – fallback');
      } else {
        pollStatus(id);
      }
    }, 600);
  };

  const pollStatus = (id) => {
    let tries = 0;
    const interval = setInterval(async () => {
      tries++;
      const res = await fetch(`https://a2dmiznatest.onrender.com/truecaller/status/${id}`);
      if (res.status === 200) {
        const { profile } = await res.json();
        clearInterval(interval);
        console.log('✅ Logged in:', profile);
        navigate('/dashboard', { state: { profile } });
      } else if (tries >= 10) {
        clearInterval(interval);
        console.log('Fallback login');
      }
    }, 2000);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Login with Truecaller</h1>
      <button onClick={startTruecaller}>
        Continue with Truecaller
      </button>
    </div>
  );
};

export default LoginPage;
