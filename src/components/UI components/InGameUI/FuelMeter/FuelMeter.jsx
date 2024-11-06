import { useEffect, useState } from "react";
import "./FuelMeter.css";

const FuelMeter = ({ progress = 100 }) => {
  const [fuel, setFuel] = useState(progress);

  useEffect(() => {
    const interval = setInterval(() => {
      setFuel((prevFuel) => Math.max(prevFuel - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fuelMeter-container">
      <div className="fuel-img">
        <img src="./images/bullet.png" alt="Energy Icon" />
      </div>
      <div className="fuel-bar">
        <div className="fuel-bar-fill" style={{ width: `${fuel}%` }}></div>
      </div>
    </div>
  );
};

export default FuelMeter;
