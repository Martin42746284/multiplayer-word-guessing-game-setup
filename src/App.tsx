
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlayerScreen from './pages/PlayerScreen';
import PublicDisplay from './pages/PublicDisplay';
import GameEnd from './pages/GameEnd';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/player/:role" element={<PlayerScreen />} />
        <Route path="/display" element={<PublicDisplay />} />
        <Route path="/end" element={<GameEnd />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;