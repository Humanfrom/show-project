import { useDispatch, useSelector } from 'react-redux';

function Payment() {
    

    return (
        <div>
            <form>
                <div className='page-header'>Источник информации</div>
                <div className='page-info'>
                    <div className='user-info-block'>
                        <div className='user-block-header'></div>
                        <div className='user-block-props'>
                            <p>Тест</p>
                        </div>
                    </div> 
                    <div className='subscribtion-info-block'>
                        <div className='user-block-header'></div>
                        <div className='user-block-props'>
                            <p>Тест</p>
                        </div>
                    </div> 
                    <div className='delivery-info-block'>
                        <div className='user-block-header'></div>
                        <div className='user-block-props'>
                            <p>Тест</p>
                        </div>
                    </div> 
                    <button>Перейти к оплате</button>
                </div>
            </form>
        </div> 
    );
  }
  
  export default Payment;