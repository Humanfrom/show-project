import { Card, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addAddress } from "../../slices/userSlice";
import { useState, useEffect, useMemo } from "react";
import { AddressSuggestions } from "react-dadata";
import { useNavigate } from "react-router-dom";

function CheckSubscribeForm({ setCheckSubscribe }) {
  const subscription = useSelector(
    (state) => state.subscribesStore.newSubscribe
  );
  const navigate = useNavigate();

  const { boxes, delivery, period, cost, sale, payment } = subscription;

  const cartBoxes = useMemo(() => {
    let list = [],
      groupedBoxes = [];
    const cost = boxes.map((box) => {
      const name = `${box.name}_${box.selected}`;
      if (list.includes(name)) {
        groupedBoxes[list.indexOf(name)].count++;
      } else {
        list.push(name);
        groupedBoxes.push({ ...box, count: 1 });
      }
      return null;
    });

    return groupedBoxes;
  }, [boxes]);
  

  const handleReturn = () => {
    setCheckSubscribe(false);
  };

  const handlePayment = () => {
    //Здесь должен быть код запроса на сервер. Временная заглушка.
    window.open('https://google.com/');
    navigate('/success-payment');
  }

  return (
    <div className="cart w-100 row">
      <div className="col-md-7 mt-3 p-0">
        <div className="cart-list">
          <h5>Данные Вашей подписки:</h5>
          <div>
            <ul>
              <li>
                <strong>Чайные наборы:</strong>{" "}
                {cartBoxes
                  .map((box) => `${box.title}-${box.selected} x ${box.count}`)
                  .join(", ")}
              </li>
              <li>
                <strong>Адрес доставки:</strong> {`${delivery.address?.value}`}
              </li>
              <li>
                <strong>Получатель:</strong>{" "}
                {`${delivery.last_name} ${delivery.first_name[0]}. ${delivery.middle_name[0]}. - Тел.: ${delivery.phone}`}
              </li>
              <li>
                <strong>Срок подписки (в месяцах):</strong> {`${period.title}`}
              </li>
              <li>
                <strong>Суммарно скидка составляет:</strong> {`${sale} руб. *`}
              </li>
              <li>
                <strong>Способ оплаты:</strong> {`${payment.title}`}
              </li>
            </ul>
          </div>
          <Button variant="secondary" onClick={handleReturn}>Вернуться в корзину</Button>
        </div>
      </div>

      <div className="col-6 col-md-4 mt-3 cart-params">
        <div className="cart-list">
          <div>
            <h5>
              Сумма к оплате: <strong>{cost} руб. *</strong>
            </h5>
            <span>
              <i>* или эквивалент этой суммы в выбранной валюте</i>
            </span>
          </div>
          <Button onClick={handlePayment}>Оплатить</Button>
        </div>
      </div>
    </div>
  );
}

export default CheckSubscribeForm;
