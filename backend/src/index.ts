import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import countriesData from "../data/countries_all.json";
import { setCountries } from "./services/country.service";
import quizRoutes from "./routes/quiz.routes";
import gameRoutes from "./routes/game.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

setCountries(countriesData);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api/quiz", quizRoutes);
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Le serveur tourne sur WSL 2 !" });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  });
}

export default app;
