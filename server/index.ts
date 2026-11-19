import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { executiveRouter } from './routes/executiveRoutes.js';
import { calculationRouter } from './routes/calculationRoutes.js';

dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  })
);

app.use(express.json());

app.use('/api/executives', executiveRouter);
app.use('/api/calculate', calculationRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`PRE Incentive Server running on http://localhost:${PORT}`);
  });
}
