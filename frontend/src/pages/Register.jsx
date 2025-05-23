// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      alert('Sign Up successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-[#065f46] min-h-screen flex justify-center items-center">
      <div className="bg-black bg-opacity-50 backdrop-blur-lg p-8 rounded-xl shadow-2xl w-full max-w-sm transition-all duration-300 ease-in-out hover:scale-105">
        {/* Centralized Groco Image */}
        <div className="flex justify-center mb-6">
          <img src="/groco.png" alt="Groco" className="w-32 h-32" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white">Username</label>
            <input
              type="text"
              placeholder="Enter Username"
              className="w-full p-3 mt-2 bg-transparent border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition ease-in-out duration-200 hover:bg-green-600 text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full p-3 mt-2 bg-transparent border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition ease-in-out duration-200 hover:bg-green-600 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-white">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full p-3 mt-2 bg-transparent border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition ease-in-out duration-200 hover:bg-green-600 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Register
          </button>
        </form>

        <p className="text-center text-white mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-green-500 underline hover:text-green-400 transition duration-200">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
