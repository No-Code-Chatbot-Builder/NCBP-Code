import express from 'express';
import cors from 'cors';
import workspaceRouter from './routers/workspace';
import 'dotenv/config';
import { authenticate } from './middlewares/authentication.middleware';

const app = express();
const port = process.env.PORT || 80
app.use(cors())
app.use(express.json());

app.get('/workspaces/health', (req, res) => {
  res.send('<h1>Workspace Service is running</h1>');
});

app.use('/workspaces', authenticate, workspaceRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});