import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import "./LevelComplete.css";

const LevelComplete = ({ score, goal }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/game-score", { state: { score, goal } });
  };

  return (
    <div className="msgContainer">
      <div className="message-box">
        <div className="message">
          <p>Good Job !!!</p>
        </div>
        <Button name={"Next"} handleClick={handleClick} />
      </div>
    </div>
  );
};

export default LevelComplete;
