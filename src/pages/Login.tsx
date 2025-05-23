import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';



export interface LoginProps {
  onLogin: (username: string, password: string) => Promise<User | undefined>;  // note Promise
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await onLogin(username.trim(), password);
      if (user) {
        localStorage.setItem('userId', user.id.toString());
        localStorage.setItem('userName', user.displayName);
        localStorage.setItem('token', (user as any).token); // store JWT token if available
        navigate('/dashboard');
      } else {
        setError('Invalid username or password.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }

    setLoading(false);
  };
 
  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Leave Management Login</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            required
            disabled={loading}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
