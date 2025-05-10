// src/utils/auth.js

export const saveToken = (token) => {
  localStorage.setItem('token', token); // Save the token in localStorage
};

export const getToken = () => {
  return localStorage.getItem('token'); // Retrieve the token from localStorage
};

export const removeToken = () => {
  localStorage.removeItem('token'); // Remove the token from localStorage
};

// Decode JWT payload and return the decoded object (which includes the role)
export const getTokenPayload = () => {
  const token = getToken();  // Get the token from localStorage
  if (!token) return null;  // If no token, return null

  try {
    const payloadBase64 = token.split('.')[1]; // Get the payload from the JWT
    const decodedPayload = JSON.parse(atob(payloadBase64)); // Decode Base64 payload
    return decodedPayload;  // Return the decoded payload
  } catch (err) {
    console.error('Invalid token:', err); // Error handling if the token is invalid
    return null;
  }
};
