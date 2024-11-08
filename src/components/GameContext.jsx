import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [currentLevel, setCurrentLevel] = useState(0);

  const incrementLevel = () => {
    setCurrentLevel((prev) => prev + 1);
  };

  return (
    <GameContext.Provider value={{ currentLevel, incrementLevel }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
