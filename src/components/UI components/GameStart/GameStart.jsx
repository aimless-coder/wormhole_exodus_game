import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Typewriter from "typewriter-effect";
import Button from "../Button/Button";
import { useGameContext } from "../../GameContext";
import useExitConfirmation from "../../../hooks/useExitConfirmation";
import "./GameStart.css";

const GameStart = () => {
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const { isSoundEnabled } = useGameContext();
  useExitConfirmation();

  useEffect(() => {
    // Initialize background music only if sound is enabled
    if (isSoundEnabled) {
      const bgMusic = new Audio("/audio/messageScreen.mp3");
      bgMusic.loop = true;
      bgMusic.volume = 0.4;
      bgMusic.play();
      audioRef.current = bgMusic;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isSoundEnabled]);

  const handleStart = () => {
    // Stop the music before navigating
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    navigate("/game");
  };

  return (
    <>
      <div className="gameStart-container">
        <div className="content-wrapper">
          <div className="dialogue-box">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .changeDelay(20)
                  .typeString("-.. .. .--. .- -. -.- .- .-. ")
                  .pauseFor(300)
                  .deleteAll()
                  .typeString(
                    "Attention Traveler!! <br><br> This is Commander Nova from Station Omega. Impurities have entered the wormholes, putting them in a dangerous loop.<br><br> You must blast through the debris—each object you destroy makes the next wormhole even faster. . <br><br>And remember, your fuel is limited for each mission, so every shot counts. If you fail, the entire sector could collapse.<br><br> Good luck. The universe is counting on you..//"
                  )
                  .changeDelay(10)
                  .callFunction(() => {
                    setIsTypingComplete(true);
                  })
                  .start();
              }}
            />
          </div>
          <div
            className="btn-box"
            style={{
              opacity: isTypingComplete ? 1 : 0,
              transition: "opacity 0.5s ease-in",
              pointerEvents: isTypingComplete ? "auto" : "none",
            }}
          >
            <Button name="Start" handleClick={handleStart} />
          </div>
        </div>
      </div>
    </>
  );
};

export default GameStart;
