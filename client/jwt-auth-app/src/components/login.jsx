import React, { useState } from 'react';
import axios from 'axios';
import { redirect, replace } from 'react-router-dom';
const Login = ({ setToken, setUserRole }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log('Base URL:', process.env.REACT_APP_BASE_URL);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/auth/login`, formData);
  
      // Set the token and user role
      setToken(res.data.token);
      setUserRole(res.data.role);
      localStorage.setItem('userId', res.data.userId);
  
      setMessage('Login successful');
      replace("/otherapp/login");
    } catch (err) {
      // Check if the error has a response from the server
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
      setMessage('Error: ' + errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Login</button>
      <p>{message}</p>
    </form>
  );
};

export default Login;
