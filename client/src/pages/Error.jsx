import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Error() {

    const navigate = useNavigate();
    const handleReturnButton = () => {
        navigate(-1);
    }

    return (
        <section id="hero">
            <div className="hero-container" >
            <h1>Тупик</h1>
            <h2>Ума не приложу как тебя сюда занесло, но есть способ вернуться...</h2>
            <a className="btn-get-started" onClick={handleReturnButton}>Шаг назад</a>
            </div>
        </section>
    );
  }
  
  export default Error;