import React from "react";
import Typewriter from "typewriter-effect";
import Button from "../Button/Button";
import "./GameStart.css";

const GameStart = () => {
  return (
    <>
      <div className="gameStart-container">
        <div className="content-wrapper">
          <div className="dialogue-box">
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString("-.. .. .--. .- -. -.- .- .-. ")
                  .pauseFor(500)
                  .deleteAll()
                  .typeString(
                    "Attention Traveler!! <br><br> This is Commander Nova from Station Omega. Impurities have entered the wormholes, putting them in a dangerous loop.<br><br> You must blast through the debris—each object you destroy makes the next wormhole even faster. . <br><br>And remember, your fuel is limited for each mission, so every shot counts. If you fail, the entire sector could collapse.<br><br> Good luck. The universe is counting on you..//"
                  )
                  .changeDelay(0.001)
                  .start();
              }}
            />
          </div>
          <div className="btn-box">
            <Button name="Start" to="/game" />
          </div>
        </div>
      </div>
    </>
  );
};

export default GameStart;
