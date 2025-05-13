// src/services/auth.js
import { saveToken } from '../utils/auth';

const API_BASE = 'http://localhost:3000/api/users';

const parseJSON = async (res) => {
  if (!res || res.status === 204) return {}; // No content
  try {
    return await res.json();
  } catch {
    return {};
  }
};

export const login = async (username, password) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await parseJSON(res);
  if (!res.ok) throw new Error(data.error || 'Login failed');

  saveToken(data.token);
  return data;
};

export const register = async (username, password, email, role) => {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, email, role }),
  });

  const data = await parseJSON(res);
  if (!res.ok) throw new Error(data.error || 'Registration failed');

  return data;
};
