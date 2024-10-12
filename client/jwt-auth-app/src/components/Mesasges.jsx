import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const Messages = ({ userId, token, receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [usernames, setUsernames] = useState({});
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null); // State for socket

    useEffect(() => {
        // Set up the socket connection
        const socketConnection = io('http://localhost:5000'); // Adjust the URL as needed
        setSocket(socketConnection);

        socketConnection.on('connect', () => {
            console.log('Connected to server:', socketConnection.id);
        });

        // Listen for incoming messages
        socketConnection.on('receiveMessage', (message) => {
            console.log('Received message:', message);
            setMessages((prevMessages) => [...prevMessages, message]); // Add the incoming message to the state
        });

        // Cleanup function to disconnect socket when the component unmounts
        return () => {
            socketConnection.disconnect();
        };
    }, []); // Empty dependency array to run once

    // Function to fetch all messages for the user
    const fetchMessages = async () => {
        try {
            setLoading(true);
            
            // Make sure userId and receiverId are defined
            if (!userId || !receiverId) {
                throw new Error("Sender ID and Receiver ID must be provided");
            }
    
            // Use dynamic user IDs in the request
            const response = await axios.get(`http://localhost:5000/api/message/messages?user1Id=${userId}&user2Id=${receiverId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            console.log("Fetched messages:", response.data);
            setMessages(response.data); // Set fetched messages in state
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    

    // Function to fetch usernames based on userIds
    const fetchUsernames = async (userIds) => {
        try {
            const requests = userIds.map(id =>
                axios.get(`http://localhost:5000/api/auth/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
            );
            const responses = await Promise.all(requests);
            const users = {};
            responses.forEach(res => {
                users[res.data._id] = res.data.username;
            });
            setUsernames(users);
        } catch (err) {
            console.error("Error fetching usernames:", err.message);
        }
    };

    // Function to send a new message
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return; // Prevent sending empty messages
    
        const messageData = {
            senderId: userId,
            receiverId: receiverId,
            content: newMessage,
        };
        console.log(messageData, 'messageData');
    
        try {
            // Save the message to the database
            const response = await axios.post(`http://localhost:5000/api/message/messages`, messageData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(response, 'response');
    
            // Check if the response is successful
            if (response.status === 201) {  // Check if the status is 201 Created
                // Emit the new message to the server
                socket.emit('sendMessage', messageData, (response) => {
                    if (response) {
                        console.log('Message sent successfully:', messageData);
                        // Update the local state with the new message for immediate feedback
                        setMessages((prevMessages) => [...prevMessages, messageData]);
                        setNewMessage(''); // Clear the input field
                    } else {
                        console.error('Error sending message');
                    }
                });
            } else {
                console.error('Error saving message:', response.data.message || response.statusText);
            }
        } catch (error) {
            console.error('Error sending message:', error.response ? error.response.data : error.message);
        }
    };

    // Fetch messages and usernames when the component mounts
    useEffect(() => {
        fetchMessages(); // Fetch all messages initially
    }, []); // Empty array to fetch only once on mount

    useEffect(() => {
        if (messages.length > 0) {
            const uniqueUserIds = new Set();
            messages.forEach(msg => {
                uniqueUserIds.add(msg.senderId); // Add senderId
                uniqueUserIds.add(receiverId); // Ensure receiverId is included
            });
            fetchUsernames(Array.from(uniqueUserIds)); // Fetch usernames
        }
    }, [messages, receiverId]);

    return (
        <div>
            {loading && <p>Loading messages...</p>}
            {error && <p>Error: {error}</p>}
            <h2>Messages for User ID: {userId} with Receiver ID: {receiverId}</h2>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        <strong>{usernames[message.senderId] || 'Unknown User'}:</strong> {message.content}
                    </li>
                ))}
            </ul>
            <form onSubmit={sendMessage}>
                <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Type your message here..." 
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Messages;
