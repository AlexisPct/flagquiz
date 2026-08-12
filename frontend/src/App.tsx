import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './features/home/Home';
import { QuizGame } from './features/quiz/QuizGame';
import { AtlasPage } from './features/atlas/components/AtlasPage';
import { Navbar } from './ui/NavBar';
import { Leaderboard } from './features/leaderboard/Leaderboard';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<QuizGame />} />
          <Route path="/atlas" element={<AtlasPage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;