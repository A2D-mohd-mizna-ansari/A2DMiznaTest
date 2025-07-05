import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const TruecallerCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const payload = searchParams.get('payload');
    const signature = searchParams.get('signature');

    if (!payload || !signature) {
      alert('Missing payload or signature');
      return;
    }

    axios.post('https://a2dmiznatest.onrender.com/api/v1/truecaller-login', { payload, signature })
      .then(res => {
        if (res.data.success) {
          alert('Login successful!');
          navigate('/dashboard');
        } else {
          alert('Login failed');
        }
      })
      .catch(err => {
        console.error('Error:', err);
        alert('Something went wrong');
      });
  }, []);

  return <p>Verifying Truecaller...</p>;
};

export default TruecallerCallback;
