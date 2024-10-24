import React from 'react'
import Button from '../Button/Button'
import './PauseMenu.css'

const PauseMenu = () => {
  return (
    <>
      <div className="pause-container">
        <div className="menu-container">
          <div className="close-section">
            <div className="close-btn">
              <p>Close Menu</p>
              <img src="./images/close.png"/>
            </div>
          </div>
          <div className="menu-section">
              <div className="menu">
                <Button />
                <Button />
                <Button />
              </div>
            <div className="instruction">
              <div className="wrapper">
                <img src="./images/left-click.png"/>
                <p>LEFT CLICK: Shoot</p>
                <p>ESC: Exit Game</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PauseMenu