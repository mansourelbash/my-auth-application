import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@nextui-org/button";
import Register from './components/register';
import Login from './components/login';
import { Spinner } from "@nextui-org/react";
import Dashboard from './components/Dashboard';
import { redirect, replace } from "react-router-dom";
import Mesasges from './components/Mesasges';
import {useParams } from 'react-router-dom';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');
  const userId = localStorage.getItem('userId')
  useEffect(() => {

    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/realestate`);
        setProperties(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSetToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleSetRole = (newRole) => {
    setUserRole(newRole);
    localStorage.setItem('role', newRole);
  };

  const handleLogout = () => {
    setToken('');
    setUserRole(''); // Reset user role on logout
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Also remove the role from local storage
    redirect('/login'); // Use navigate for redirecting
  };

  if (loadingProperties) {
    return <Spinner size="lg" />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // Conditionally render dashboard if the user is an admin
  if (token && userRole === 'admin') {
    return <Dashboard handleLogout={handleLogout} userId={userId}  />;
  }

  // Default view for non-admin users
  return (
    <div>
      {!token ? (
        <>
          <Register />
          <Login setToken={handleSetToken} setUserRole={handleSetRole} />
        </>
      ) : (
        <>
          <p>Welcome, you're logged in!</p>
          {/* You can display properties or other default content here */}

          <p>All Mesages</p>
          <Mesasges userId={userId} />
          <Button onClick={handleLogout}>Logout</Button>
        </>
      )}
    </div>
  );
};

export default App;
