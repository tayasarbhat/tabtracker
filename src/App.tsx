import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import Dashboard from './components/Dashboard';
import LoginPage from './components/auth/LoginPage';
import { useAuth } from './context/AuthContext';
import QuickAddDropdown from './components/QuickAddDropdown';
import SignOutButton from './components/auth/SignOutButton';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-tight">
              Finance Tracker
            </h1>
            <div className="flex items-center gap-4">
              <QuickAddDropdown />
              <SignOutButton />
            </div>
          </div>
          <Dashboard />
        </div>
      </div>
    </ExpenseProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}