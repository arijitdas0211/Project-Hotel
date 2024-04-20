if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectToDb = require('./config/connectToDb');
const usersController = require('./controller/userController');
const requireAuth = require('./middleware/requiredAuth');


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true,
}));

connectToDb;

// Routing
app.post('/signup', usersController.signup);
app.post('/login', usersController.login);
app.get('/logout', usersController.logout);
app.get('/check-auth', requireAuth, usersController.checkAuth);

// Start server
app.listen(process.env.PORT);
