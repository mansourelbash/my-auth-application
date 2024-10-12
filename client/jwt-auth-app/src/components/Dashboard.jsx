import React, { useEffect, useState } from 'react';
import PropertyList from './PropertyList';
import { Input } from "@nextui-org/input";
import { Grid } from '@nextui-org/react';
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import axios from 'axios';
import { Spinner } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/button";
import Mesasges from '../components/Mesasges'; // Correct import path
const Dashboard = ({ handleLogout, userId }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(''); // State to hold the logged-in user's username
  const [receiverId, setReceiverId] = useState(''); // State to hold the currently selected receiver ID

  const getUsers = async () => {
    try {
      const res = await axios.get('/api/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsername(res.data.username);
      console.log(res.data, 'res datra');
      console.log(res.data);
    } catch (err) {
      console.error('Error fetching users', err.response.data.message);
    }
  };

  const deleteUser = async (userId) => {
    try {
      console.log('Authorization Token:', token);
      const encodedUserId = encodeURIComponent(userId);
      console.log(encodedUserId, 'encodedUserId');

      const response = await axios.delete(`http://localhost:5000/api/auth/users/${encodedUserId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response:', response);

      // Check if the response is okay
      if (response.status === 200) {
        // Refresh the user list after deletion
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        console.log(`User with ID ${userId} deleted successfully.`);
      } else {
        console.error('Failed to delete user:', response.data);
        console.error('Response status:', response.status);
      }
    } catch (err) {
      // Handle errors from Axios
      if (err.response) {
        console.error('Failed to delete user:', err.response.data);
        console.error('Response status:', err.response.status);
      } else {
        console.error('Error deleting user:', err.message);
      }
    }
  };

  useEffect(() => {
    if (token) {
      const getUsers = async () => {
        setLoadingUsers(true);
        try {
          const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/auth/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(res.data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoadingUsers(false);
        }
      };
      getUsers();
    } else {
      setUsers([]);
    }
  }, [token]);

  console.log(userId, 'userIduserIduserId');

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the admin dashboard!</p>
      {username && <h2>Hello, {username}!</h2>} {/* Displaying the logged-in user's username */}

      <PropertyList properties={properties} />
      
      {/* Pass the dynamic receiverId to the Messages component */}
      <Mesasges userId={userId} receiverId={receiverId} />

      <Button onClick={() => getUsers()} disabled={loadingUsers}>
        {loadingUsers ? <Spinner size="sm" /> : 'Get Users'}
      </Button>
      
      {users.length > 0 && (
        users.map(user => (
          <Card key={user._id} xs={12}>
            <CardBody>
              <p>{user.username}</p>
              {/* Add onClick to set the receiverId when a user is clicked */}
              <Button color="primary" onClick={() => setReceiverId(user._id)}>
                Message
              </Button>
              <Button color="error" onClick={() => deleteUser(user._id)}>
                Delete
              </Button>
            </CardBody>
          </Card>
        ))
      )}
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Dashboard;
