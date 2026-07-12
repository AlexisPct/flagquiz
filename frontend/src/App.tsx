import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './features/atlas/components/Home';
import { QuizGame } from './features/quiz/components/QuizGame';
import { ThemeSwitch } from './ui/ThemeSwitch';
import { AtlasPage } from './features/atlas/components/AtlasPage';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <ThemeSwitch />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<QuizGame />} />
          <Route path="/atlas" element={<AtlasPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;