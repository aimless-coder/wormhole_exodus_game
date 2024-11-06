import Button from "../Button/Button";
import "./EndPage.css";
import { useLocation } from "react-router-dom";

const EndPage = () => {
  const location = useLocation();
  const { score, goal } = location.state || { score: 0, goal: 0 };
  return (
    <div className="end-container">
      <div className="wrapper">
        <div className="text-section">
          <h2>
            Level: <span>1</span> Complete
          </h2>
        </div>
        <div className="score-container">
          <div className="star-section">
            <img src="./images/checkStar.png" />
            <img src="./images/checkStar.png" />
            <img src="./images/uncheckStar.png" />
          </div>
          <div className="score-section">
            <p>
              Score: <span>{score}</span>
            </p>
          </div>
        </div>
        <div className="btn-section">
          <Button name="Exit" />
          <Button name="Next Level" />
        </div>
      </div>
    </div>
  );
};

export default EndPage;
