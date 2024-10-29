import { useEffect, useState } from 'react'
import './App.css'
import Preloader from './components/UI components/Preloader/Preloader'
import Home from './components/UI components/HomePage/Home';
import EndPage from './components/UI components/EndPage/EndPage';
import PauseMenu from './components/UI components/PauseMenu/PauseMenu';
import GameStart from './components/UI components/GameStart/GameStart';
import FuelMeter from './components/UI components/InGameUI/FuelMeter/FuelMeter';
import InGameUI from './components/UI components/InGameUI/InGameUI';
import Game from './components/Game/Game'
import StarField from './components/UI components/StarField/StarField';
function App() {



  return (
    <>
    <Game />
    </>
  )
}

export default App
