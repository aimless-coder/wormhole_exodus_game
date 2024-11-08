import FuelMeter from "./FuelMeter/FuelMeter";
import "./InGameUI.css";

const InGameUI = ({ score, goal, time, timeLimit }) => {
  return (
    <div className="UI-Content">
      <div className="card-wrapper">
        <div className="score-card">
          <div className="score-img">
            <img src="./images/glitch.png" />
          </div>
          <div className="score">
            <p>
              <span>{score}</span>/<span>{goal}</span>
            </p>
          </div>
        </div>
        <div className="fuel-meter">
          <FuelMeter time={time} timeLimit={timeLimit} />
        </div>
      </div>
    </div>
  );
};

export default InGameUI;
