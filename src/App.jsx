import { useEffect, useState } from 'react'
import './App.css'
import WormholeShooter from './components/WormholeShooter'
import Preloader from './components/UI components/Preloader/Preloader'
import Home from './components/UI components/HomePage/Home';
import EndPage from './components/UI components/EndPage/EndPage';
import PauseMenu from './components/UI components/PauseMenu/PauseMenu';
import GameStart from './components/UI components/GameStart/GameStart';
import FuelMeter from './components/UI components/InGameUI/FuelMeter/FuelMeter';
import InGameUI from './components/UI components/InGameUI/InGameUI';

function App() {



  return (
    <>
    <div className="content">
    <WormholeShooter />
    <div className="ui-mat">
      <InGameUI />
    </div>
    </div>
    </>
  )
}

export default App
