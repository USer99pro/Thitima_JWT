const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/databvase');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const helloRouter = require('./routes/user'); 

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/hello', helloRouter); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
