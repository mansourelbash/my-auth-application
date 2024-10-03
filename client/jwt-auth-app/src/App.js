import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Loading, Text, Card, Grid } from '@nextui-org/react';
import Register from './components/register';
import Login from './components/login';
import PropertyList from './components/PropertyList'; 

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);

  const handleSetToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
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

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  if (loadingProperties) {
    return <Loading size="lg" />;
  }

  if (error) {
    return <Text color="error">Error: {error}</Text>;
  }

  return (
    <div>
      {!token ? (
        <>
          <Register />
          <Login setToken={handleSetToken} />
        </>
      ) : (
        <>
          <Text h1>Welcome, you're logged in!</Text>
          <PropertyList properties={properties} />
          <Button onClick={() => getUsers()} disabled={loadingUsers}>
            {loadingUsers ? <Loading size="sm" /> : 'Get Users'}
          </Button>
          {users.length > 0 && (
            <Grid.Container gap={2}>
              {users.map(user => (
                <Grid key={user._id} xs={12}>
                  <Card>
                    <Card.Body>
                      <Text>{user.username}</Text>
                    </Card.Body>
                  </Card>
                </Grid>
              ))}
            </Grid.Container>
          )}
          <Button onClick={handleLogout}>Logout</Button>
        </>
      )}
    </div>
  );
};

export default App;
