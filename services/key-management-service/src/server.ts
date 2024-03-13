import express from 'express';
import keyRouter from './routers/key';
import 'dotenv/config';
import { authenticate } from './middlewares/authentication.middleware';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());


app.use('/keys', authenticate, keyRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});