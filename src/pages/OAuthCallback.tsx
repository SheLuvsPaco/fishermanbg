import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle OAuth callback logic here
    // Redirect to appropriate page after processing
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900">Processing...</h1>
      <p className="text-gray-600 mt-4">Please wait while we complete your authentication.</p>
    </div>
  );
};

export default OAuthCallback;