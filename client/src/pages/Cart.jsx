import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import CartItem from "../components/items/CartItem";
import {
  addBox,
  fetchSubs,
  removeBoxes,
  removeOneBox,
  setManyBoxes,
  setSubscribe,
} from "../slices/subscribeSlice";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import AddressesList from "../components/items/AddressesList";
import { fetchCheckDelivery, setAddress } from "../slices/deliverySlice";
import {
  fetchAddRecipient,
  fetchUserData,
  updateUserData,
} from "../slices/userSlice";
import useToken from "@Utils/useToken";
import LoginModal from "../components/modal/LoginModal";
import CheckSubscribeForm from "../components/forms/CheckSubscribeForm";

const maxBoxes = 8;

function Cart() {
  const boxes = useSelector((state) => state.subscribesStore.selectedBoxes);
  const { delivery } = useSelector((state) => state.userStore.userData);
  const { userStatus } = useSelector((state) => state.userStore);
  const { recipient, price, currency } = useSelector(
    (state) => state.deliveryStore
  );
  const { periods, payments, deliveryTypes } = useSelector(
    (state) => state.dictionariesStore.data
  );

  const [period, setPeriod] = useState(periods[0]);
  const [addressIndex, setAddressIndex] = useState(-1);
  const [type, setType] = useState(0);
  const [otherSales, setOtherSales] = useState({});
  const [payment, setPayment] = useState({ ...payments[0] });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [checkSubscribe, setCheckSubscribe] = useState(false);

  const dispatch = useDispatch();
  const { token } = useToken();

  const selectMonth = (event) => {
    const index = event.target.value;
    setPeriod(periods[index]);
  };

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

  const deleteHandler = (index) => {
    dispatch(removeBoxes(cartBoxes[index]));
  };

  const updateHandler = (index, value, field) => {
    switch (field) {
      case "add":
        if (cartBoxes[index].count < maxBoxes) {
          dispatch(addBox(cartBoxes[index]));
        }
        break;
      case "set":
        const count = value ? (value > maxBoxes ? maxBoxes : Number(value)) : 1;
        dispatch(setManyBoxes({ box: cartBoxes[index], count }));
        break;
      case "del":
        dispatch(removeOneBox(cartBoxes[index]));
        break;
    }
  };

  const handleSubmit = () => {
    if (userStatus === "guest") {
      setShowLoginModal(true);
    } else {
      if(addressIndex === -1) return alert('Выберите адрес доставки!');
      setCheckSubscribe(true);
      const sale =
        finalSum - finalSumWithSale > 0 ? finalSum - finalSumWithSale : 0;
      dispatch(
        setSubscribe({
          delivery: delivery[addressIndex],
          cost: finalSumWithSale,
          sale,
          payment,
          period,
          boxes,
        })
      );
    }
  };

  useEffect(() => {
    setOtherSales((prev) => ({ ...prev, payment: payment.fixsale }));
  }, [payment]);

  const otherSalesSum = useMemo(() => {
    return Object.values(otherSales).reduce(
      (acc, sale) => acc + Number(sale),
      0
    );
  }, [otherSales]);

  const costsSum = useMemo(() => {
    return boxes.reduce((acc, box) => acc + Number(box.costs[box.selected]), 0);
  }, [boxes]);

  const finalSum = useMemo(() => {
    return (costsSum + price) * period.title;
  }, [price, costsSum, period.sale]);

  const finalSumWithSale = useMemo(() => {
    return (
      (costsSum * (1 - period.sale / 100) + price - otherSalesSum) *
      period.title
    );
  }, [price, costsSum, period.sale, otherSalesSum]);

  const handleCheckDelivery = () => {
    if (userStatus === "guest") {
      setShowLoginModal(true);
    } else {
      dispatch(
        fetchCheckDelivery({
          token,
          type: deliveryTypes[type],
        })
      );
    }
  };

  useEffect(() => {
    if (addressIndex !== -1 && delivery[addressIndex]) {
      const recipient = delivery[addressIndex];
      dispatch(setAddress({ ...recipient }));
    }
  }, [addressIndex]);

  useEffect(() => {
    if (
      ["user", "admin", "superadmin"].includes(userStatus) &&
      delivery.length
    ) {
      dispatch(updateUserData({ token }));
    }
  }, [userStatus, delivery]);

  return (
    <section className="solid-bg">
      <div className="container" data-aos="fade-up">
        <div className="row">
          <div className="col-lg-6 pt-4 pt-lg-0 content">
            <div className="block-header-left">
              <h3>КОРЗИНА</h3>
              <div className="subtitle">
                <h4>Внимательность - ключ к счастью</h4>
              </div>
            </div>
          </div>
          <span>
            Проверьте все параметры и пункты перед переходом к оплате.
          </span>

          {boxes.length > maxBoxes ? (
            <Alert variant="danger" className="mt-4">
              <strong>Вимание:</strong> максимальное количество наоров в заказе
              - {maxBoxes} наборов.
            </Alert>
          ) : null}

          {checkSubscribe ? (
            <CheckSubscribeForm setCheckSubscribe={setCheckSubscribe} />
          ) : (
            <div className="cart w-100 row">
              <div className="col-md-8 mt-3 p-0">
                <div className="cart-list">
                  <h5>Выбранные наборы:</h5>
                  {cartBoxes.map((box, index) => (
                    <CartItem
                      key={`cart_${box.name}_${index}`}
                      box={box}
                      index={index}
                      updateHandler={updateHandler}
                      deleteHandler={deleteHandler}
                    />
                  ))}
                </div>
                <div className="cart-list mt-3">
                  <h5>Способ доставки:</h5>
                  <AddressesList
                    addressIndex={addressIndex}
                    setAddressIndex={setAddressIndex}
                  />
                  <h5>Тип доставки:</h5>
                  <div className="d-flex delivery-form">
                    <Form.Group
                      as={Col}
                      md="6"
                      className="select-group me-3"
                      controlId="validationCustom05"
                    >
                      <Form.Select
                        as={Col}
                        aria-label="Default select example"
                        className="my-custom-select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        {deliveryTypes.map((type, i) => (
                          <option key={`delivery-${i}`} value={i}>
                            {type.title}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Button onClick={handleCheckDelivery}>
                      Узнать стоимость
                    </Button>
                  </div>
                  <h5>Стоимость доставки: {`${price} ${currency}`}</h5>
                </div>

                <div className="cart-list mt-3">
                  <h5>Срок подписки:</h5>
                  <Form className="mt-2 container">
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        md="6"
                        className="mb-2"
                        controlId="validationCustom07"
                      >
                        <Form.Label>Выберите период подписки:</Form.Label>
                        <input
                          type="range"
                          min="0"
                          max={periods.length - 1}
                          step="1"
                          value={period.title - 1}
                          onChange={selectMonth}
                          list="periods"
                        />

                        <datalist id="periods">
                          {periods.map((period, i) => (
                            <option
                              key={`period-${period.title}`}
                              value={i}
                              label={
                                [
                                  0,
                                  Math.floor((periods.length - 1) / 2),
                                  periods.length - 1,
                                ].includes(i)
                                  ? `${i + 1} мес.`
                                  : null
                              }
                            ></option>
                          ))}
                        </datalist>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="6"
                        className="mb-2"
                        controlId="validationCustom07"
                      >
                        <div>
                          <h5>Срок подписки: {period.title} месяцев</h5>
                          <h5>Скидка периода: {period.sale}%</h5>
                        </div>
                      </Form.Group>
                    </Row>
                  </Form>
                </div>

                <div className="cart-list mt-3">
                  <h5>Способ оплаты:</h5>
                  <div className="d-flex delivery-form">
                    <Form.Group
                      as={Col}
                      md="4"
                      className="select-group mb-2"
                      controlId="validationCustom03"
                    >
                      <Form.Select
                        as={Col}
                        aria-label="Default select example"
                        className="my-custom-select"
                        onChange={(e) => {
                          const [selected] = payments.filter(
                            (item) => item.name === e.target.value
                          );
                          setPayment({ ...selected });
                        }}
                        value={payment.name}
                      >
                        {payments.map((type, i) => (
                          <option key={`payment-${i}`} value={type.name}>
                            {type.title}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <div className="ms-5">
                      <div>Доступные валюты: {payment.currency.join(", ")}</div>
                      <div>Дополнительная скидка: {payment.fixsale} руб.</div>
                      <div>
                        <small>
                          <i>{payment.comment}</i>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3 mt-3 cart-params costs-container">
                <h5>Итого:</h5>
                <div className="cost-container">
                  <span className="text">Стоимость наборов:</span>
                  <span className="cost">{costsSum}</span>
                </div>
                <div className="cost-container">
                  <span className="text">Стоимость доставки:</span>
                  <span className="cost">{price}</span>
                </div>
                <div className="cost-container">
                  <span className="text">
                    Скидка периода ({period.title} мес.):
                  </span>
                  <span className="cost">{period.sale}%</span>
                </div>
                <div className="cost-container">
                  <span className="text">Прочие скидки:</span>
                  <span className="cost">{otherSalesSum}</span>
                </div>
                <hr className="mt-4" />
                <div className="cost-container del">
                  <span className="text h5">Итого без скидки:</span>
                  <span className="cost">{finalSum}</span>
                </div>
                <div className="cost-container">
                  <span className="text h5">Итого к оплате:</span>
                  <span className="cost">{finalSumWithSale}</span>
                </div>
                <Button onClick={handleSubmit}>Перейти к оформлению</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <LoginModal
        show={showLoginModal}
        handleClose={() => {
          setShowLoginModal(false);
        }}
      />
    </section>
  );
}

export default Cart;
