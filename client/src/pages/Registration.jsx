import React, { useEffect, useState } from "react";
import Input from "../utils/input/Input";
//import './authorisation.css';
import { Accordion, Form, Row, Col, Button, Alert } from "react-bootstrap";
import { registration, setError } from "@Slices/userSlice.js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateFields } from "../utils";

const Registration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.userStore.error);
  const status = useSelector((state) => state.userStore.userStatus);
  const [validated, setValidated] = useState();
  const [showPassword, setShowPassword] = useState();
  const [formData, setFormData] = useState({
    login: {
      value: "",
      validation: true,
    },
    password: {
      value: "",
      validation: true,
    },
    passwordCheck: {
      value: "",
      validation: true,
    },
    contact: {
      value: "",
      validation: true,
    },
    contactType: {
      value: "tg",
      validation: true,
    },
    promo: {
      value: "",
      validation: false,
    },
  });

  const handleSetFormData = (event) => {
    console.log(event);
    const { value, id } = event.target;
    console.log(value);
    setFormData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        value,
      },
    }));
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    const errors = validateFields(formData);
    if (errors) {
      return dispatch(setError("Поля заполнены некорректно"));
    }

    if (formData.password.value !== formData.passwordCheck.value) {
      return dispatch(setError("Пароли не совпадают"));
    }

    let flatFormData = {};
    Object.entries(formData).map((item) => {
      const [prop, value] = item;
      if (prop == "passwordCheck") return;
      flatFormData[prop] = value.value;
    });
    dispatch(registration({ data: { ...flatFormData } }));
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(setError(null));
      }, 4000);
    }
  }, [error]);

  const getContactTitle = () => {
    switch (formData.contactType.value) {
      case "tg":
        return "телеграм";
      case "mail":
        return "почту";
      default:
        return "контакты";
    }
  };

  return (
    <section id="hero">
      <div className="hero-container">
        <div className={`authorisation items-form${error ? ' authorisation_error' : ''}`}>
          <div className="authorisation__header h4 ">Регистрация</div>

          {status === "registred" ? (
            <Alert variant="success">
              Отлично! Осталось проверить {getContactTitle()} для завершения.
            </Alert>
          ) : error ? (
            <Alert variant="danger">Ошибка: {error}</Alert>
          ) : null}

          <div className="authorisation__body container">
            <Form
            noValidate
            validated={validated}
            onSubmit={handleRegistration}
            className={`items-form container mt-4 d-flex`}
            style={{ gap: "1em", flexDirection: "column" }}
          >
            {status === "registred" ? (
              <Alert variant="success">
                Отлично! Осталось проверить {getContactTitle()} для завершения.
              </Alert>
            ) : error ? (
              <Alert variant="danger">Ошибка: {error}</Alert>
            ) : null}

            <Form.Group as={Col} controlId="login">
              <Form.Control
                required
                type="text"
                placeholder="Логин"
                onChange={handleSetFormData}
                value={formData.login.value}
              />
            </Form.Group>

            <Row>
              <Form.Group
                as={Col}
                md="6"
                controlId="password"
                style={{ display: "flex", displayDirection: "row" }}
              >
                <Button
                  variant="outline-secondary"
                  id="button-addon2"
                  style={{ width: "50px" }}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <i class="bi bi-eye-slash-fill"></i>
                  ) : (
                    <i class="bi bi-eye-fill"></i>
                  )}
                </Button>
                <Form.Control
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Пароль"
                  onChange={handleSetFormData}
                  value={formData.password.value}
                />
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="passwordCheck">
                <Form.Control
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="Подтверждение пароля"
                  onChange={handleSetFormData}
                  value={formData.passwordCheck.value}
                />
              </Form.Group>
            </Row>

            <Row>
              <Form.Group
                as={Col}
                md="4"
                className="select-group"
                controlId="contactType"
              >
                <Form.Select
                  as={Col}
                  aria-label="Default select"
                  className="my-custom-select"
                  onChange={handleSetFormData}
                  value={formData.contactType.value}
                >
                  <option value="tg">Телеграм</option>
                  <option value="mail">Почта</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} md="8" controlId="contact">
                <Form.Control
                  required
                  type="text"
                  placeholder="Контакт"
                  onChange={handleSetFormData}
                  value={formData.contact.value}
                />
              </Form.Group>
            </Row>

            <Form.Group as={Col} controlId="promo">
              <Form.Control
                required
                type="text"
                placeholder="Промокод"
                onChange={handleSetFormData}
                value={formData.promo.value}
              />
            </Form.Group>

            {status !== "registred" && (
              <Button className="authorisation__btn" type="submit">
                Зарегестрироваться
              </Button>
            )}
          </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;
