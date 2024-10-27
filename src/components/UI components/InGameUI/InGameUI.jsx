import FuelMeter from'./FuelMeter/FuelMeter'
import './InGameUI.css'

const InGameUI = () => {
  return (
    <div className="UI-Content">
        <div className="card-wrapper">
            <div className="score-card">
                <div className="score-img">
                    <img src="./images/glitch.png" />
                </div>
                <div className="score">
                    <p><span>20</span>/
                    <span>50</span>
                    </p>
                </div>
            </div>
            <div className="fuel-meter">
                <FuelMeter />
            </div>
        </div>
    </div>
  )
}

export default InGameUI