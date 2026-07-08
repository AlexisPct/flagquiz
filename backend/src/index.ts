import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeCountries } from './services/country.service';
import quizRoutes from './routes/quiz.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/quiz', quizRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Le serveur tourne sur WSL 2 !' });
});

const startServer = async () => {
  await initializeCountries();

  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  });
};

startServer();