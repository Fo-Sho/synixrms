'use client';

import { useState } from 'react';

interface SSOButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function SSOButton({ className, children }: SSOButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSSO = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/sso-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate SSO token');
      }
      
      const data = await response.json();
      
      // Redirect to Python app with token
      const url = `${data.redirectUrl}/sso/login?token=${data.token}`;
      window.open(url, '_blank'); // Opens in new tab
      
    } catch (error) {
      console.error('SSO failed:', error);
      alert('Failed to access hotel management system. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button
      onClick={handleSSO}
      disabled={isLoading}
      className={`${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Connecting...' : children || 'Access Hotel Management'}
    </button>
  );
}