import { useDispatch, useSelector } from "react-redux";
import {
  Form,
  InputGroup,
  Modal,
  Nav,
  Button,
  Alert,
  Col,
  Row,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, registration, setError } from "../../slices/userSlice";
import { validateFields } from "../../utils";

function LoginModal({ show, handleClose }) {
  //const { classes } = useSelector((state) => state.dictionariesStore.data);
  const error = useSelector((state) => state.userStore.error);
  const status = useSelector((state) => state.userStore.userStatus);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (status !== "guest") handleClose();
  }, [status]);

  const [validated, setValidated] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [formType, setFormType] = useState("login");
  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });

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

  const userAuthorisation = () => {
    dispatch(auth({ ...loginData }));
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
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className={`items-form ${error ? "error" : ""}`}
      size={formType === "login" ? "md" : "lg"}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {formType === "login" ? "Авторизация" : "Регистрация"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Nav justify variant="tabs" onSelect={setFormType} defaultActiveKey="login">
          <Nav.Item>
            <Nav.Link eventKey="login">Войти</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="registration">Регистрация</Nav.Link>
          </Nav.Item>
        </Nav>

        {formType === "login" ? (
          <div className="container mt-4">
            <InputGroup className="authorisation__input mt-3">
              <Form.Control
                type="text"
                required
                placeholder="Введите логин..."
                aria-label="Введите логин..."
                value={loginData.login}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    login: e.target.value,
                  }))
                }
              />
              <Form.Control.Feedback type="invalid">
                Please choose a username.
              </Form.Control.Feedback>
            </InputGroup>

            <InputGroup className="authorisation__input mt-3">
              <Form.Control
                type="password"
                required
                placeholder="Введите пароль..."
                aria-label="Введите пароль..."
                value={loginData.password}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </InputGroup>

            <div className="d-flex authorisation__buttons mt-3">
              <Button
                className="authorisation__btn"
                onClick={userAuthorisation}
              >
                Войти
              </Button>
            </div>

            <div className="authorisation__text mt-3">
              Забыли пароль? По ссылке можно <a href="/recover">восстановить доступ</a>
            </div>
          </div>
        ) : (
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
        )}
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;
