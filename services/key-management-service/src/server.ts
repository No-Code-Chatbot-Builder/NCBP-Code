import express from 'express';
import keyRouter from './routers/domain';
import cors from 'cors';
import 'dotenv/config';
import { authenticate } from './middlewares/authentication.middleware';
import { setEnviromentVariables } from './utils/helpers';

const app = express();
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json());

app.get('/domains/health', (req, res) => {
  res.send('<h1>Key Management Service is running</h1>');
});

setEnviromentVariables();

app.use('/domains', authenticate, keyRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
