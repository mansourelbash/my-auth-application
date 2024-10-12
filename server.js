const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const realEstateRoutes = require('./routes/realEstate');
const MessageRoutes = require('./routes/message');

const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerOptions');
const http = require('http'); // Import http module
const { Server } = require('socket.io'); // Import Socket.IO

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/realestate', realEstateRoutes);
app.use('/api/message', MessageRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Create an HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5732", // Replace with your frontend URL
        methods: ["GET", "POST"],
        allowedHeaders: ["Authorization"], // Uncomment if you need to specify allowed headers
        credentials: true, // Uncomment if you need to send cookies or authentication info
    }
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('sendMessage', (messageData, callback) => {
        console.log('Message received:', messageData);
        
        // Emit the message to the intended receiver
        socket.to(messageData.receiverId).emit('receiveMessage', messageData);

        // Acknowledge the message sending
        callback(true);
    });
});
// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
