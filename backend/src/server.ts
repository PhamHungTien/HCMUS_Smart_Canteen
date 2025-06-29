import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import menuRoutes from './routes/menu';
import orderRoutes from './routes/orders';
import feedbackRoutes from './routes/feedback';
import { getDb } from './db';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/feedback', feedbackRoutes);

getDb().then(() => {
  app.listen(3001, () => {
    console.log('API running on http://localhost:3001');
  });
});

export default app;
