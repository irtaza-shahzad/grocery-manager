// 
// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      // Save token and role in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      alert('Login Successful');

      // Redirect user to their respective dashboard based on their role
      if (data.role === 'Admin') {
        navigate('/admin');  // Redirect to Admin Dashboard
      } else {
        navigate('/dashboard');  // Redirect to User Dashboard
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h1 className="text-4xl font-bold mb-4 text-center">Grocery Manager</h1>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700">Username or Email</label>
          <input
            type="text"
            placeholder="Enter Username or Email"
            className="w-full p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Login
        </button>
      </form>

      <p className="text-center mt-4">
        Not a user?{' '}
        <a href="/register" className="text-blue-500 underline">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default Login;
