import { useDispatch, useSelector } from "react-redux";
import { Card, Button, Badge, Container, Row, Col } from "react-bootstrap";
import AddressesList from "../components/items/AddressesList";
import { useState, useMemo } from "react";

const achievementList = {
  monster: "монстр",
};

const gradeList = [
  "Новичок",
  "Продвинутый",
  "Мастер",
  "Джедай",
  "Великий мастер",
  "Владыка",
];

function Personal() {
  const { userData } = useSelector((state) => state.userStore);
  const dispatch = useDispatch();
  const [addressIndex, setAddressIndex] = useState(-1);

  const statusLocale = useMemo(() => {
    switch (userData.status) {
      case "user":
        return "активен";
      case "admin":
        return "администратор";
      case "superadmin":
        return "кодер";
      default:
        return "неизвестный";
    }
  }, [userData.status]);

  const achievementLocale = (name) => {
    console.log(name);
    return achievementList[name] || "секретная награда";
  };

  return (
    <section className="solid-bg">
      <div className="container" data-aos="fade-up">
        <div className="row">
          <div className="col-lg-6 pt-4 pt-lg-0 content">
            <div className="block-header-left">
              <h3>МОЙ ПРОФИЛЬ</h3>
              <div className="subtitle">
                <h4>И оглянулся я на все дела мои</h4>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <h5 className="mb-3">Список адресов:</h5>
            <AddressesList
              addressIndex={addressIndex}
              setAddressIndex={setAddressIndex}
            />
          </div>

          <div>
            <h5>Ваша активность:</h5>

            <Container className="mt-3 personal">
              <Row>
                <Col>
                  <Card>
                    <Card.Header>
                      <h5>Активная подписка</h5>
                    </Card.Header>
                    <Card.Body>
                      <Card.Title>Статус подписки: активна</Card.Title>
                      <Card.Title>Срок подписки: 2 месяца</Card.Title>
                      <Card.Text>
                        Общий срок подписки начиная с даты оформления
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>
                      <h5>Статистика подписок</h5>
                    </Card.Header>
                    <Card.Body>
                      <Card.Title>Количество подписок: 3</Card.Title>
                      <Card.Title>Получено наборов: 4</Card.Title>
                      <Card.Title>Любимый набор: Весенний сбор</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card>
                    <Card.Header>
                      <h5>Данные аккаунта</h5>
                    </Card.Header>
                    <Card.Body>
                      <Card.Title>Логин: {userData.login}</Card.Title>
                      <Card.Title>Статус: {statusLocale}</Card.Title>
                      <Card.Title>
                        Награды:{" "}
                        {userData.achievements.map((item) => (
                          <Badge bg="info">{achievementLocale(item)}</Badge>
                        ))}
                      </Card.Title>
                      <Card.Title>Ранг: {gradeList[userData.grade]}</Card.Title>
                      <Card.Title>Дополнительная информация: {userData.info || "-"}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Header>
                      <h5>Общая статистика</h5>
                    </Card.Header>
                    <Card.Body>
                      <Card.Title>Количество кликов в секунду: 0.0019</Card.Title>
                      <Card.Title>Количество пуков в день: 32</Card.Title>
                      <Card.Title>Дата последнего мытья головы: 02.02.24</Card.Title>
                      <Card.Title>КПД рук: 76%</Card.Title>
                      <Card.Title>Уровень СДВГ: 22%</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Personal;
