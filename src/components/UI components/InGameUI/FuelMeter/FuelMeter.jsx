import PropTypes from "prop-types";
import "./FuelMeter.css";

const FuelMeter = ({ time, timeLimit }) => {
  const fuel = (time / timeLimit) * 100;

  return (
    <div className="fuelMeter-container">
      <div className="fuel-img">
        <img src="./images/gauge.png" alt="Energy Icon" />
      </div>
      <div className="fuel-bar">
        <div className="fuel-bar-fill" style={{ width: `${fuel}%` }}></div>
      </div>
    </div>
  );
};

FuelMeter.propTypes = {
  time: PropTypes.number.isRequired,
  timeLimit: PropTypes.number.isRequired,
};

export default FuelMeter;
