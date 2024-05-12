import React, { useState, useEffect } from "react";
import Input from "../utils/input/Input";
//import './authorisation.css';
import { Spinner, Form, Row, Col, Button, Alert } from "react-bootstrap";
import { auth, checkRef, reset, setError } from "@Slices/userSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Confirm = () => {
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [password, setPassword] = useState("");

  const error = useSelector((state) => state.userStore.error);
  const confirm = useSelector((state) => state.userStore.confirm);
  const status = useSelector((state) => state.userStore.userStatus);
  const state = useSelector((state) => state.userStore.status);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const type = searchParams.get("type");
    const ref = searchParams.get("ref");
    if (type && ref) {
      dispatch(checkRef({ type, ref }));
    }
  }, [searchParams]);

  const handleReset = () => {
    dispatch(reset({ password }));
  };

  /*useEffect(() => {
        if(error){
            setTimeout(() => { dispatch(setError(null)); }, 4000);
        }
    }, [error])*/

  return (
    <section id="hero">
      <div className="hero-container">
        <div className="authorisation">
          <div className="authorisation__header">Восстановление</div>

          {status === "reset" ? (
            <Alert variant="success">
              Пароль успешно восстановлен, можете авторизоваться с новыми
              данными.
            </Alert>
          ) : error ? (
            <Alert variant="danger">Ошибка: {error}</Alert>
          ) : null}

          {confirm ? (
            <>
              <div className="d-flex" style={{ gap: "1em" }}>
                <Input
                  value={password}
                  setValue={setPassword}
                  type="password"
                  placeholder="Введите пароль..."
                />
                <Input
                  value={passwordConfirm}
                  setValue={setPasswordConfirm}
                  type="password"
                  placeholder="Повторите пароль..."
                />
              </div>
              <button className="authorisation__btn" onClick={handleReset}>
                Восстановить
              </button>
            </>
          ) : error ? (
            <button
              className="authorisation__btn"
              onClick={() => navigate("/")}
            >
              На главную
            </button>
          ) : status === "reset" ? (
            <button
              className="authorisation__btn"
              onClick={() => navigate("/login")}
            >
              Войти
            </button>
          ) : null}

          {state === "loading" && (
            <Spinner animation="border" variant="light" />
          )}
        </div>
      </div>
    </section>
  );
};

export default Confirm;
