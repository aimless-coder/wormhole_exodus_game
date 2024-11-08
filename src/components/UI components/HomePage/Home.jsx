import Button from "../Button/Button";
import Planet3D from "../Planet3D/Planet3D";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-wrapper">
        <div className="planet">
          <Planet3D />
        </div>
        <div className="hero-part">
          <div className="title">
            <h1>WORMHOLE EXODUS</h1>
            <p>A Space Odessy</p>
          </div>
          <div className="menu-section">
            <div className="menu">
              <Button name="New Game" to="/new-game" />
              <Button
                name={"Load Game"}
                handleClick={() => console.log("Clicked")}
              />
              <Button
                name={"Sound"}
                handleClick={() => console.log("Clicked")}
              />
              <Button
                name={"Exit"}
                handleClick={() => console.log("Clicked")}
              />
            </div>
          </div>
          <div className="footer">
            <a className="credits">
              <img src="./images/github.png" />
              <p>Created with love.</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
