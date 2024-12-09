import PropTypes from "prop-types";
import FuelMeter from "./FuelMeter/FuelMeter";
import "./InGameUI.css";

const InGameUI = ({ score, goal, time, timeLimit, level }) => {
  return (
    <div className="UI-Content">
      <div className="card-wrapper">
        <div className="score-card">
          <div className="score-img">
            <img src="./images/glitch.png" alt="score" />
          </div>
          <div className="score">
            <h3>Level {level}</h3>
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

InGameUI.propTypes = {
  score: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  timeLimit: PropTypes.number.isRequired,
  level: PropTypes.number.isRequired,
};

export default InGameUI;
