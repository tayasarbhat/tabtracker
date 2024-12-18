import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className={`
        px-4 py-2 rounded-xl transition-colors border
        flex items-center gap-2
        ${isLoading
          ? 'bg-gray-500/20 text-gray-300 border-gray-500/30 cursor-not-allowed'
          : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/30'
        }
      `}
    >
      <LogOut className="w-4 h-4" />
      {isLoading ? '...' : 'Sign Out'}
    </button>
  );
}