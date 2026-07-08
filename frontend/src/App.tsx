import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './features/atlas/components/Home';
import { CountryGallery } from './features/atlas/components/CountryGallery';
import { QuizGame } from './features/quiz/components/QuizGame';
import { ThemeSwitch } from './ui/ThemeSwitch';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <ThemeSwitch />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<QuizGame />} />
          <Route path="/atlas" element={<CountryGallery />} />
        </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;