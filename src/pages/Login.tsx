import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  setRole: React.Dispatch<React.SetStateAction<'admin' | 'employee' | null>>;
}

export default function Login({ setRole }: LoginProps) {
  const navigate = useNavigate();
  const loginAs = (role: 'admin' | 'employee') => {
    setRole(role);
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Leave Management</h1>
        <button
          onClick={() => loginAs('admin')}
          className="w-full mb-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Login as Admin
        </button>
        <button
          onClick={() => loginAs('employee')}
          className="w-full px-4 py-2 bg-green-600 text-white rounded"
        >
          Login as Employee
        </button>
      </div>
    </div>
  );
}
