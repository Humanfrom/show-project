import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { clearUser } from "@Slices/userSlice";
import { adminRoutes, privateRoutes, publicRoutes } from "../../routes";
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Popover } from "react-bootstrap";

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userStatus, userData } = useSelector((state) => state.userStore);
  const { selectedBoxes } = useSelector((state) => state.subscribesStore);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavigate = (route) => {
    navigate(route);
  };

  const handleLogout = () => {
    dispatch(clearUser());
  };

  let navigateButtons = [
    { path: "/boxes", name: "Выбрать набор", id: "boxes" },
    { path: "/info", name: "Помощь", id: "info" },
    { path: "/delivery", name: "Доставка и оплата", id: "delivery" },
  ];

  switch (userStatus) {
    case "user":
      navigateButtons = [
        ...navigateButtons,
        //{path: '/profile', name: 'Мои подписки', id: "profile"},
      ];
      break;
    case "admin":
      navigateButtons = [
        ...navigateButtons,
        { path: "/admin", name: "Админ панель", id: "admin" },
        { path: "/personal", name: "Мои подписки", id: "personal" },
      ];
      break;
  }

  return (
    <header
      id="header"
      className={`fixed-top d-flex align-items-center header-transparent ${
        scrollY > window.innerHeight * 0.7 || location.pathname !== "/"
          ? "header-scrolled"
          : ""
      }`}
    >
      <div className="d-flex align-items-center justify-content-between w-100">
        <div className="container d-flex align-items-center">
          <div className="logo">
            <a onClick={() => handleNavigate("/")}>
              <img src="assets/img/logo.png" alt="" />
            </a>
          </div>

          <nav id="navbar" className="navbar">
            <ul>
              <li key={"navList" + 99}>
                <a
                  className={`nav-link scrollto ${
                    "/" === location.pathname && "active"
                  }`}
                  onClick={() => handleNavigate("/")}
                >
                  Главная
                </a>
              </li>
              {navigateButtons.map((item, index) => (
                <li key={"navList" + item.id}>
                  <a
                    className={`nav-link scrollto ${
                      item.path === location.pathname && "active"
                    }`}
                    onClick={() => handleNavigate(item.path)}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            <i className="bi bi-list mobile-nav-toggle"></i>
          </nav>
        </div>

        <div className="navbar-user">
          {["user", "admin", "superadmin"].includes(userStatus) ? (
            <>
              <button className="btn-get-started" onClick={handleLogout}>
                Выйти
              </button>
              <button
                className="btn-get-started"
                onClick={() => handleNavigate("/personal")}
              >
                {userData.login}
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-get-started"
                onClick={() => handleNavigate("/registration")}
              >
                Регистрация
              </button>
              <button
                className="btn-get-started"
                onClick={() => handleNavigate("/login")}
              >
                Войти
              </button>
            </>
          )}
          <OverlayTrigger
            trigger={["hover", "focus"]}
            placement="bottom"
            overlay={
              <Popover>
                <Popover.Header as="h3">Выбранные наборы</Popover.Header>
                <Popover.Body>
                  <ul>
                    {selectedBoxes.map((box, i) => (
                      <li key={`sub_${box.name}_${i}`}>
                        <strong>{box.title}</strong> - {box.selected} -{" "}
                        {box.costs[box.selected]}
                      </li>
                    ))}
                  </ul>
                  <div>
                    Итого:{" "}
                    <strong>
                      {selectedBoxes.reduce(
                        (acc, box) => acc + box.costs[box.selected],
                        0
                      )}
                    </strong>
                  </div>
                </Popover.Body>
              </Popover>
            }
          >
            <button
              className="btn-get-started"
              onClick={() => handleNavigate("/cart")}
            >
              {selectedBoxes.length || <i className="bi bi-basket2-fill"></i>}
            </button>
          </OverlayTrigger>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
