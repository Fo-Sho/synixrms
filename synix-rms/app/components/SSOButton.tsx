'use client';

import { useState } from 'react';

interface SSOButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function SSOButton({ children, className }: SSOButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSSO = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/sso-token', {
        method: 'POST'
      });
      
      const { token, hotelBackendUrl } = await response.json();
      
      if (token && hotelBackendUrl) {
        // Redirect to Python backend with SSO token
        window.location.href = `${hotelBackendUrl}/auth/sso?token=${token}`;
      } else {
        console.error('Failed to get SSO token');
      }
    } catch (error) {
      console.error('SSO error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSSO}
      disabled={loading}
      className={className}
    >
      {loading ? 'Connecting...' : children}
    </button>
  );
}