import React, { useState } from 'react';
import axios from 'axios';
import Register from './components/register';
import Login from './components/login';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleSetToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  const getUsers = async () => {
    try {
      const res = await axios.get('/api/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
    } catch (err) {
      console.error('Error fetching users', err.response.data.message);
    }
  };

  return (
    <div>
      {!token ? (
        <>
          <Register/>
          <Login setToken={handleSetToken} />
        </>
      ) : (
        <>
          <h1>Welcome, you're logged in!</h1>
          <button onClick={getUsers}>Get Users</button>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default App;
