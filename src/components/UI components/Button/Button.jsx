import './Button.css'
import {useNavigate} from 'react-router-dom'

const Button = ({to, name, handleClick}) => {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    if(handleClick){
      handleClick();
    }
    if(to){
      navigate(to);
    }
  }
  return (
    <div className="btn-wrap" onClick={handleButtonClick}>
      <div className='std-btn'><p>{name}</p></div>
    </div>
  )
}

export default Button