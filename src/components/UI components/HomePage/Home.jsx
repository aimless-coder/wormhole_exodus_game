import Button from "../Button/Button"
import Planet3D from "../Planet3D/Planet3D";
import StarField from "../StarField/StarField";
import './Home.css';


const Home = () => {

  return (
    <div className="home-container">
        <div className="starfield">
            <StarField />
        </div>
        <div className="home-container" >
             <div className="title">
                 <h1>Wormhole Exodus</h1>
             </div>
             <div className="hero-section">
                 <div className="menu-section">
                     <div className="menu">
                         <Button />
                         <Button />
                         <Button />
                         <Button />
                     </div>
                     <div className="img3d">
                         <Planet3D />
                 </div>
                 </div>
             </div>
         </div>
    </div>
  )
}

export default Home