// pages/TruecallerCallback.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const TruecallerCallback = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Verifying with Truecaller...');

  useEffect(() => {
    const payload = searchParams.get('payload');
    const signature = searchParams.get('signature');

    if (!payload || !signature) {
      setMessage('Missing payload or signature in callback URL');
      return;
    }

    axios
      .post('https://a2dmiznatest.onrender.com/api/v1/truecaller-login', {
        payload,
        signature,
      })
      .then((res) => {
        setMessage(`Welcome, ${res.data.userDetails?.name || 'user'}!`);
        // Optionally store token or redirect user here
      })
      .catch((err) => {
        console.error(err);
        setMessage('Verification failed. Please try again.');
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{message}</h2>
    </div>
  );
};

export default TruecallerCallback;
