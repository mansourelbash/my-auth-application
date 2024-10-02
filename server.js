const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerOptions'); // No need for .js extension

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
const allowedOrigins = [
  'http://localhost:5731',
  'https://my-auth-application.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
}));

app.use('/api/auth', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
