import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Button from "../Button/Button";
import useExitConfirmation from "../../../hooks/useExitConfirmation";
import { useGameContext } from "../../GameContext";
import { useEffect, useRef } from "react";
import "./LevelComplete.css";

const LevelComplete = ({ score, goal, level }) => {
  const navigate = useNavigate();
  const { isSoundEnabled } = useGameContext();
  const audioRef = useRef(null);
  useExitConfirmation();

  useEffect(() => {
    if (isSoundEnabled) {
      const bgMusic = new Audio("/audio/messageScreen.mp3");
      bgMusic.loop = true;
      bgMusic.volume = 0.4;
      bgMusic.play().catch((error) => {
        console.log("Audio playback failed:", error);
      });
      audioRef.current = bgMusic;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isSoundEnabled]);

  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    navigate("/game-score", { state: { score, goal, level } });
  };

  const getScorePercentage = () => (score / goal) * 100;

  const getMessage = () => {
    const percentage = getScorePercentage();
    if (percentage <= 25) {
      return "Keep practicing! You'll get better.";
    } else if (percentage <= 50) {
      return "Good effort!";
    } else if (percentage <= 75) {
      return "Great job!";
    } else {
      return "Outstanding!";
    }
  };

  return (
    <div className="msgContainer">
      <div className="message-box">
        <div className="message">
          <p>{getMessage()}</p>
        </div>
        <Button name={"Next"} handleClick={handleClick} />
      </div>
    </div>
  );
};

LevelComplete.propTypes = {
  score: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
  level: PropTypes.number.isRequired,
};

export default LevelComplete;
