import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ emailOrUsername: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Kirim ke backend: email dan username diisi sama
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.emailOrUsername,
          username: form.emailOrUsername,
          password: form.password
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Login berhasil!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        if (data.user.role === 'admin') {
          navigate('/profile');
        } else {
          navigate('/profile');
        }
      } else {
        setMessage(data.message || 'Login gagal');
      }
    } catch {
      setMessage('Terjadi error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Login</h2>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Email atau Username</label>
          <input
            name="emailOrUsername"
            value={form.emailOrUsername}
            onChange={handleChange}
            placeholder="Email atau Username"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
        {message && (
          <div className="mt-4 text-center text-red-500">{message}</div>
        )}
      </form>
    </div>
  );
};

export default Login;