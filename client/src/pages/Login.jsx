import React, { useState, useEffect } from "react";
import { InputGroup, Form, Row, Col, Button, Alert } from "react-bootstrap";
import { auth, setError } from "@Slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const error = useSelector((state) => state.userStore.error);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    login: "",
    password: "",
  });

  const userAuthorisation = () => {
    dispatch(auth({ ...loginData }));
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(setError(null));
      }, 4000);
    }
  }, [error]);

  return (
    <section id="hero">
      {error ? <Alert variant="danger" style={{position: "absolute"}}>Ошибка: {error}</Alert> : null}
      
      <div className="hero-container">
        <div className={`authorisation items-form${error ? ' authorisation_error' : ''}`}>
          <div className={`authorisation__header h4${error ? ' authorisation__header_error' : ''}`}>Авторизация</div>

          <div className="authorisation__body container">
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
              Забыли пароль? По ссылке можно{" "}
              <a href="/recover">восстановить доступ</a>
            </div>
          </div>
        </div>
        
        </div>
    </section>
  );
};

export default Login;
