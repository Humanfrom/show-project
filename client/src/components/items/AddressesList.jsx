import { Card, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addAddress } from "../../slices/userSlice";
import { useState, useEffect } from "react";
import { AddressSuggestions } from "react-dadata";

function AddressesList({ addressIndex, setAddressIndex }) {
  const { delivery } = useSelector((state) => state.userStore.userData);

  const initialState = {
    first_name: {
      value: "",
      validation: true,
    },
    last_name: {
      value: "",
      validation: true,
    },
    middle_name: {
      value: "",
      validation: true,
    },
    phone: {
      value: "",
      validation: true,
    },
    address: {
      value: {
        value: "",
        data: {},
      },
      validation: false,
    },
  };

  const [formData, setFormData] = useState(initialState);
  const [validated, setValidated] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const dadataToken = "61330f3164a58473ea99ae8cc1c37de708eb63ef";
  const dispatch = useDispatch();

  const handleCloseForm = () => setShowForm(false);
  const handleShowForm = () => setShowForm(true);

  const handleSetFormData = (event, name = null, data = "") => {
    let value = data,
      id = name;
    if (event) ({ value, id } = event.target);

    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...formData[id],
        value,
      },
    }));
  };

  const handleAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const formValid = event.currentTarget.checkValidity();
    if (formValid) {
      let flatFormData = {};
      console.log(formData);
      Object.keys(formData).map((field) => {
        flatFormData[field] = formData[field].value;
      });
      dispatch(addAddress(flatFormData));
      setFormData(initialState);
      setShowForm(false);
    }

    setValidated(true);
  };

  useEffect(() => {
    const [inputElement] = document.getElementsByClassName(
      "react-dadata__input"
    );
    if (inputElement) {
      inputElement.placeholder = "Введите адрес...";
    }
  }, []);

  return (
    <>
      <div className="address d-flex">
        {delivery &&
          delivery.map((item, index) => (
            <Card
              border={addressIndex === index ? "info" : null}
              className="address__item"
            >
              <Card.Header>Адрес #{index + 1}</Card.Header>
              <Card.Body
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setAddressIndex(index);
                }}
              >
                <Card.Title className="address__title">{item.address.value}</Card.Title>
                <Card.Text>
                  <div>
                    <strong>Фио получателя:</strong> <br />
                    {item.last_name} {item.middle_name[0]}.{item.first_name[0]}.
                  </div>
                  <div>
                    <strong>Телефон получателя:</strong> <br />
                    {item.phone}
                  </div>
                </Card.Text>
              </Card.Body>
            </Card>
          ))}

        <Card
          className="address__add"
          style={{ cursor: "pointer" }}
          onClick={handleShowForm}
        >
          <Card.Body>
            <Card.Text>
              <i className="bi bi-plus-lg"></i>
            </Card.Text>
            <Card.Title>Добавить адрес</Card.Title>
          </Card.Body>
        </Card>
      </div>

      <Modal show={showForm} onHide={handleCloseForm} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleAdd}
            className={`delivery-form mt-2 container`}
          >
            <h5>Данные получателя</h5>
            <div>
              <Row className="mb-3">
                <Form.Group as={Col} md="4" controlId="first_name">
                  <Form.Control
                    required
                    type="text"
                    placeholder="Имя"
                    onChange={handleSetFormData}
                    value={formData.first_name.value}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="last_name">
                  <Form.Control
                    required
                    type="text"
                    placeholder="Фамилия"
                    onChange={handleSetFormData}
                    value={formData.last_name.value}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="middle_name">
                  <Form.Control
                    required
                    type="text"
                    placeholder="Отчество"
                    onChange={handleSetFormData}
                    value={formData.middle_name.value}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="phone">
                  <Form.Control
                    required
                    type="text"
                    placeholder="Телефон"
                    onChange={handleSetFormData}
                    value={formData.phone.value}
                  />
                </Form.Group>
              </Row>
            </div>
            <h5>Адрес доставки</h5>
            <Row className="mb-3">
              <Form.Group className="mb-3" as={Col} md="6">
                <AddressSuggestions
                  token={dadataToken}
                  value={formData.address.value}
                  onChange={(data) => handleSetFormData(null, "address", data)}
                  delay={500}
                />
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
            <Row>
              <Button variant="secondary" onClick={handleCloseForm}>
                Отмена
              </Button>
              <Button variant="primary" type="submit">
                Добавить адрес
              </Button>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AddressesList;
