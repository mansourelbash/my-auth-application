import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://my-auth-application.onrender.com/api/auth/login', formData);
      console.log(res,'resresresresresresres'); // Check the structure of the response

      setToken(res.data.token);
      setMessage('Login successful');
    } catch (err) {
      setMessage('Error: ' + err.response.data.message);
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
