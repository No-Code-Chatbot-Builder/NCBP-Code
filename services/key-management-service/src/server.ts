import express from 'express';
import keyRouter from './routers/domain';
import cors from 'cors';
import 'dotenv/config';
import { authenticate } from './middlewares/authentication.middleware';
import { setEnviromentVariables } from './utils/helpers';

const app = express();
const port = process.env.PORT || 5000;

// if (process.env.NODE_ENV === 'prod') {
//   setEnviromentVariables();
// }
app.use(cors())
app.use(express.json());

app.use('/domains', authenticate, keyRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
