import { useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import Planet3D from "../Planet3D/Planet3D";
import { useGameContext } from "../../GameContext";
import Preloader from "../Preloader/Preloader";
import "./Home.css";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isSoundEnabled, toggleSound, incrementLevel, resetLevel } =
    useGameContext();
  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const initAudio = () => {
    if (isSoundEnabled && !audioRef.current) {
      const bgMusic = new Audio("/audio/bgSound.mp3");
      bgMusic.loop = true;
      bgMusic.volume = 0.4;
      bgMusic.play().catch((error) => {
        console.log("Audio playback failed:", error);
      });
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

  const checkSave = () => {
    try {
      return localStorage.length > 0;
    } catch (error) {
      console.error("Error checking local storage:", error);
      return false;
    }
  };

  const clearSaves = () => {
    try {
      localStorage.clear();
      resetLevel();
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  };

  const handleLoadGame = () => {
    try {
      const savedLevel = JSON.parse(localStorage.getItem("level"));
      if (savedLevel !== null) {
        for (let i = 0; i <= savedLevel; i++) {
          incrementLevel();
        }
      }
    } catch (error) {
      console.error("Error loading game:", error);
    }
  };

  const isSaveGame = checkSave();

  return (
    <>
      {isLoading ? (
        <Preloader />
      ) : (
        <div className="home-container">
          <div className="home-wrapper">
            <div className="planet">
              <Planet3D />
            </div>
            <div className="hero-part">
              <div className="title">
                <h1>WORMHOLE EXODUS</h1>
                <p>A Space Odyssey</p>
              </div>
              <div className="menu-section">
                <div className="menu">
                  <Button
                    name="New Game"
                    to="/new-game"
                    handleClick={clearSaves}
                  />
                  {isSaveGame && (
                    <Button
                      name={"Load Game"}
                      to={"/game"}
                      handleClick={handleLoadGame}
                    />
                  )}
                  <Button
                    name={isSoundEnabled ? "Sound: ON" : "Sound: OFF"}
                    handleClick={toggleSound}
                  />
                  <Button name={"Exit"} handleClick={() => window.close()} />
                </div>
              </div>
              <div className="footer">
                <a className="credits">
                  <a href="https://github.com/aimless-coder" target="_blank">
                    <img src="./images/github.png" alt="github" />
                  </a>
                  <p>Created with love.</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
