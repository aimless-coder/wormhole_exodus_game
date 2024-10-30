import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './components/UI components/HomePage/Home'
import GameStart from './components/UI components/GameStart/GameStart'
import Game from './components/Game/Game'


import Preloader from './components/UI components/Preloader/Preloader'
const HomeScreen = lazy(() => import('./components/UI components/HomePage/Home'))



function App() {



  return (
    <div className="container">
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/new-game" element={<GameStart />} />
        <Route path="/game" element={<Game />} />
        {/* <Route path="/settings" element={<Settings />} />
        <Route path="/exit" element={<Exit />} /> */}
      </Routes>
    </Router>
    </div>
  )
}

export default App
