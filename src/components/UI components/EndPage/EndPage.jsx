import React from 'react'
import Button from '../Button/Button'
import './EndPage.css'

const EndPage = () => {
  return (
    <div className="end-container">
        <div className="wrapper">
          <div className="text-section">
            <h2>Level: <span>1</span> Complete</h2>
          </div>
        <div className="score-container">
            <div className="star-section">
                <img src="./images/checkStar.png"/>
                <img src="./images/checkStar.png"/>
                <img src="./images/uncheckStar.png"/>
            </div>
            <div className="score-section">
                <p>Score: <span>0</span></p>
            </div>
            </div>
            <div className="btn-section">
                <Button />
                <Button />
        </div>
        </div>
    </div>
  )
}

export default EndPage