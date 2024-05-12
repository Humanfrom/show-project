import { useDispatch, useSelector } from 'react-redux';

function Admin() {
    const data = {};

    return (
        <div>
            <div className='page-header'>Админ панель</div>
            <div className='page-info'>
                <div className='user-info-block'>
                    <div className='user-block-header'></div>
                    <div className='user-block-props'>
                        <p>Колчиество подписок {data.subsrcibesCount}</p>
                    </div>
                </div> 
            </div>
        </div> 
    );
  }
  
  export default Admin;