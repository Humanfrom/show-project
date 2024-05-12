import React, { useState, useEffect } from "react";
import Input from "../utils/input/Input";
//import './authorisation.css';
import { Accordion, Form, Row, Col, Button, Alert } from "react-bootstrap";
import { recover, setError } from "@Slices/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Recover = () => {
  const [login, setLogin] = useState("");
  const error = useSelector((state) => state.userStore.error);
  const status = useSelector((state) => state.userStore.userStatus);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userAuthorisation = () => {
    dispatch(recover({ login }));
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
      <div className="hero-container">
        <div className="authorisation">
          <div className="authorisation__header">Восстановление</div>

          {status === "recover" ? (
            <Alert variant="success">
              Отлично! Осталось проверить Ваши контакты для восстановления.
            </Alert>
          ) : error ? (
            <Alert variant="danger">Ошибка: {error}</Alert>
          ) : null}

          <span>
            Введите свой логин, указанный при регестрации. По выбранному способу
            связи Вам прийдёт ссылка для сброса пароля.
          </span>
          <Input
            value={login}
            setValue={setLogin}
            type="text"
            placeholder="Введите логин..."
          />
          <button className="authorisation__btn" onClick={userAuthorisation}>
            Восстановить
          </button>
        </div>
      </div>
    </section>
  );
};

export default Recover;
