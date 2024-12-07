import { useEffect, useRef } from "react";
import Button from "../Button/Button";
import "./EndPage.css";
import { useLocation } from "react-router-dom";
import { useGameContext } from "../../GameContext";
import levelConfig from "../../Game/GameComps/gameLevel";
import useExitConfirmation from "../../../hooks/useExitConfirmation";

const EndPage = () => {
  const { currentLevel, incrementLevel, isSoundEnabled } = useGameContext();
  const location = useLocation();
  const audioRef = useRef(null);
  useExitConfirmation();

  const { score, goal } = location.state || {
    score: 0,
    goal: 0,
  };

  const initAudio = () => {
    if (isSoundEnabled && !audioRef.current) {
      const bgMusic = new Audio("/audio/bgSound.mp3");
      bgMusic.loop = true;
      bgMusic.volume = 0.4;
      bgMusic.play();
      audioRef.current = bgMusic;
    }
  };

  useEffect(() => {
    initAudio();
    document.addEventListener("click", initAudio, { once: true });

    return () => {
      document.removeEventListener("click", initAudio);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isSoundEnabled]);

  useEffect(() => {
    if (!isSoundEnabled && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    } else if (isSoundEnabled) {
      initAudio();
    }
  }, [isSoundEnabled]);

  const saveGameProgress = () => {
    try {
      if (starsEarned > 0) {
        localStorage.setItem("level", JSON.stringify(currentLevel));
      }
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
    const percentage = (score / goal) * 100;
    if (percentage <= 25) {
      return 0;
    } else if (percentage <= 50) {
      return 1;
    } else if (percentage <= 75) {
      return 2;
    } else {
      return 3;
    }
  };

  const starsEarned = calculateStars(score, goal);

  const handleFinalExit = () => {
    if (currentLevel >= levelConfig.length - 1 && starsEarned > 0) {
      deleteGameProgress();
    } else {
      saveGameProgress();
    }
  };

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
                alt={`star ${index + 1}`}
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
          <Button name="Exit" to="/" handleClick={handleFinalExit} />
          <Button
            name={
              currentLevel < levelConfig.length - 1
                ? starsEarned < 1
                  ? "Retry"
                  : "Next Level"
                : "Main Menu"
            }
            to={currentLevel < levelConfig.length - 1 ? "/game" : "/"}
            handleClick={
              currentLevel < levelConfig.length - 1 && starsEarned > 0
                ? nextLevel
                : handleFinalExit
            }
          />
        </div>
      </div>
    </div>
  );
};

export default EndPage;
