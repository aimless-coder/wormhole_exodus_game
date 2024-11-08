import Button from "../Button/Button";
import "./EndPage.css";
import { useLocation } from "react-router-dom";
import { useGameContext } from "../../GameContext";
import levelConfig from "../../Game/GameComps/gameLevel";

const EndPage = () => {
  const { currentLevel, incrementLevel } = useGameContext();
  const location = useLocation();
  const { score, goal } = location.state || {
    score: 0,
    goal: 0,
  };

  const saveGameProgress = () => {
    try {
      localStorage.setItem("level", JSON.stringify(currentLevel));
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const deleteGameProgress = () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing:", error);
    }
  };

  const nextLevel = () => {
    saveGameProgress();
    if (currentLevel < levelConfig.length && starsEarned > 0) {
      incrementLevel();
    }
  };

  const calculateStars = (score, goal) => {
    if (score <= goal / 4) {
      return 0;
    } else if (score > goal / 4 && score <= goal / 2) {
      return 1;
    } else if (score > goal / 2 && score <= (3 * goal) / 4) {
      return 2;
    } else if (score > (3 * goal) / 4) {
      return 3;
    }
  };

  const starsEarned = calculateStars(score, goal);

  return (
    <div className="end-container">
      <div className="wrapper">
        <div className="text-section">
          <h2>
            Level: <span>{currentLevel + 1}</span>{" "}
            {starsEarned < 1 ? "Failed" : "Complete"}
          </h2>
        </div>
        <div className="score-container">
          <div className="star-section">
            {[...Array(3)].map((_, index) => (
              <img
                key={index}
                src={
                  index < starsEarned
                    ? "./images/checkStar.png"
                    : "./images/uncheckStar.png"
                }
              />
            ))}
          </div>
          <div className="score-section">
            <p>
              Score: <span>{score}</span>
            </p>
          </div>
        </div>
        <div className="btn-section">
          <Button
            name="Exit"
            to={"/"}
            handleClick={
              currentLevel < levelConfig.length - 1 && starsEarned > 0
                ? nextLevel
                : deleteGameProgress
            }
          />
          <Button
            name={
              currentLevel < levelConfig.length - 1
                ? starsEarned < 1
                  ? "Retry"
                  : "Next Level"
                : "Main Menu"
            }
            to={
              currentLevel < levelConfig.length - 1 && starsEarned > 0
                ? "/game"
                : "/"
            }
            handleClick={
              currentLevel < levelConfig.length - 1 && starsEarned > 0
                ? nextLevel
                : deleteGameProgress
            }
          />
        </div>
      </div>
    </div>
  );
};

export default EndPage;
