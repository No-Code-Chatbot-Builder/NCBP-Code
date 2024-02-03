import express from 'express';
import bodyParser from 'body-parser';
import { signUpHandler } from './auth/cognito-signup';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware for logging
app.use((req, res, next) => {
  console.log(req.body); // Log the request body
  next();
});

// Parse JSON requests
app.use(bodyParser.json());

// Define your routes
app.use('/test', require('./routes/index'));  // Assuming 'test' is a route module
app.use('/user', require('./routes/index'));  // Assuming 'user' is a route module
app.use('/auth', require('./routes/index'));  // Assuming 'auth' is a route module


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
