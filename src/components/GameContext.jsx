import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  const incrementLevel = () => {
    setCurrentLevel((prev) => prev + 1);
  };

  const resetLevel = () => {
    setCurrentLevel(0);
  };

  const toggleSound = () => {
    setIsSoundEnabled((prev) => !prev);
  };

  return (
    <GameContext.Provider
      value={{
        currentLevel,
        incrementLevel,
        resetLevel,
        isSoundEnabled,
        toggleSound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

GameProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useGameContext = () => useContext(GameContext);
