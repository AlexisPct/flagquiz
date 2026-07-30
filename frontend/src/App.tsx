import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './features/atlas/components/Home';
import { QuizGame } from './features/quiz/components/QuizGame';
import { AtlasPage } from './features/atlas/components/AtlasPage';
import { Navbar } from './ui/NavBar';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
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