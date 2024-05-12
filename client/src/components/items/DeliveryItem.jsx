import { useEffect, useState } from "react";
import { Image, Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import { AddressSuggestions } from "react-dadata";
import { fetchCheckDelivery } from "../../slices/deliverySlice";
import { useDispatch, useSelector } from "react-redux";
import useToken from "@Utils/useToken";

function DeliveryItem({ className, value, setValue }) {
  const { data } = useSelector((state) => state.deliveryStore);
  const { delivery } = useSelector((state) => state.dictionariesStore.data);
  const dipsatch = useDispatch();
  const [address, setAddress] = useState("");
  const [type, setType] = useState(0);

  const dadataToken = "61330f3164a58473ea99ae8cc1c37de708eb63ef";
  const { token } = useToken();

  const handleCheckDelivery = () => {
    dipsatch(fetchCheckDelivery({ token, address, type: delivery[type] }));
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
          <Button variant="light" onClick={handleCheckDelivery}>
            Узнать о доставке
          </Button>
        </Form.Group>
      </Row>
    </Form>
  );
}

export default DeliveryItem;
