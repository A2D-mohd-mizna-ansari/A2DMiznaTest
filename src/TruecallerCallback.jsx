import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const TruecallerCallback = () => {
  const [qs] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Truecaller call is handled by backend POST; just redirect to login
    navigate('/');
  }, [navigate]);

  return <div>🔄 Redirecting...</div>;
};

export default TruecallerCallback;
