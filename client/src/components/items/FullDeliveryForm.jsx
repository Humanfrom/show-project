import { useEffect, useState } from "react";
import { Image, Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import { AddressSuggestions } from "react-dadata";
import { fetchCheckDelivery } from "../../slices/deliverySlice";
import { useDispatch, useSelector } from "react-redux";
import useToken from "@Utils/useToken";

function FullDeliveryForm({ className, value, setValue }) {
  const { data } = useSelector((state) => state.deliveryStore);
  const { delivery } = useSelector((state) => state.dictionariesStore.data);
  const dipsatch = useDispatch();
  const [address, setAddress] = useState("");
  const [type, setType] = useState(0);

  const [validated, setValidated] = useState(false);

  const dadataToken = "61330f3164a58473ea99ae8cc1c37de708eb63ef";
  const { token } = useToken();

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    /*dipsatch(fetchCheckDelivery({ token, address, type: delivery[type] }));*/
  };

  useEffect(() => {
    setValue({ ...value, ...data });
  }, [data]);

  useEffect(() => {
    const [inputElement] = document.getElementsByClassName(
      "react-dadata__input"
    );
    if (inputElement) {
      inputElement.placeholder = "Введите адрес...";
    }
  }, []);

  return (
    <Form
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
      className={`delivery-form mt-2 container ${className || ""}`}
    >
      <h5>Данные получателя</h5>
      <div>
        <Row className="mb-3">
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Control required type="text" placeholder="First name" />
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Control required type="text" placeholder="Last name" />
          </Form.Group>
          <Form.Group as={Col} md="4" controlId="validationCustom03">
            <Form.Control required type="text" placeholder="Last name" />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="validationCustom01">
            <Form.Control required type="email" placeholder="E-mail" />
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="validationCustom02">
            <Form.Control required type="text" placeholder="Telegram" />
          </Form.Group>
        </Row>
      </div>
      <h5>Параметры доставки</h5>
      <Row className="mb-3">
        <Form.Group
          className="mb-3"
          as={Col}
          md="6"
          controlId="validationCustom04"
        >
          <AddressSuggestions
            token={dadataToken}
            value={address}
            onChange={setAddress}
            delay={500}
          />
        </Form.Group>
        <Form.Group
          as={Col}
          md="6"
          className="select-group mb-3"
          controlId="validationCustom05"
        >
          <Form.Select
            as={Col}
            aria-label="Default select example"
            className="my-custom-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {delivery.map((type, i) => (
              <option key={`delivery-${i}`} value={i}>
                {type.title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Row>
      <Form.Group className="mb-3">
        <Form.Check
          required
          label="Согласен на обработку персональных данных"
          feedback="Необходимо согласиться"
          feedbackType="invalid"
        />
      </Form.Group>
    </Form>
  );

  return (
    <Form className={`delivery-form mt-2 container ${className}`}>
      <Row className="mb-3">
        <Form.Group
          as={Col}
          md="4"
          className="mb-2"
          controlId="validationCustom03"
        >
          <AddressSuggestions
            token={dadataToken}
            value={address}
            onChange={setAddress}
            delay={500}
          />
          <Form.Control.Feedback type="invalid">
            Пожалуйста, укажите корректный адрес
          </Form.Control.Feedback>
        </Form.Group>
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
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {delivery.map((type, i) => (
              <option key={`delivery-${i}`} value={i}>
                {type.title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group
          as={Col}
          md="4"
          className="mb-2"
          controlId="validationCustom03"
        >
          <Button variant="light">Узнать о доставке</Button>
        </Form.Group>
      </Row>
    </Form>
  );
}

export default FullDeliveryForm;
