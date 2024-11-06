import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/UI components/HomePage/Home";
import GameStart from "./components/UI components/GameStart/GameStart";
import Game from "./components/Game/Game";
import EndPage from "./components/UI components/EndPage/EndPage";

function App() {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new-game" element={<GameStart />} />
          <Route path="/game" element={<Game />} />
          <Route path="/game-score" element={<EndPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
