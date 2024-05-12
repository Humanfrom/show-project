import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Accordion, Form, Row, Col, Button } from "react-bootstrap";
import Footer from "../components/footer/Footer";
import "@Scss/style.scss";

function General() {
  const items = useSelector((state) => state.boxesStore.boxesList);
  const dispatch = useDispatch();

  return (
    <>
      <section id="hero">
        <div className="container" data-aos="fade-up">
          <div className="hero-elements">
            <div className="hero-title">NAVI-LI</div>
            <div className="hero-icons d-inline-flex mb-2">
              <div className="hero-icon">
                <a href="#" className="instagram">
                  <i className="bx bxl-instagram"></i>
                </a>
                <div className="hexagon-solid" />
              </div>
              <div className="hero-icon">
                <a href="#" className="instagram">
                  <i className="bx bxl-instagram"></i>
                </a>
                <div className="hexagon-solid" />
              </div>
              <div className="hero-icon">
                <a href="#" className="instagram">
                  <i className="bx bxl-instagram"></i>
                </a>
                <div className="hexagon-solid" />
              </div>
              <div className="hero-icon">
                <a href="#" className="instagram">
                  <i className="bx bxl-instagram"></i>
                </a>
                <div className="hexagon-solid" />
              </div>
            </div>
          </div>
          <div className="hero-elements mt-2">
            <h4>ЧАЙ ПО ПОДПИСКЕ</h4>
            <h4>НОВОСТИ</h4>
          </div>
          <div
            className="hero-container"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <div className="light-over">
              <div className="down-step center">
                <div className="hexagon center"></div>
              </div>
              <div className="hexagon-border center"></div>
            </div>
          </div>
        </div>
      </section>

      <main id="main">
        <section id="about" className="about section-bg">
          <div className="container" data-aos="fade-up">
            <div className="row">
              <div className="col-lg-6 tea-image">
                <img src="assets/img/teas.png" className="img-fluid" alt="" />
              </div>
              <div className="col-lg-6 pt-4 pt-lg-0 content">
                <div className="block-header">
                  <h3>Хороший выбор</h3>
                  <div className="subtitle">
                    <h4>Чего ты ищешь?</h4>
                  </div>
                </div>
                <p>
                  Иногда так хочется выбрать, то что тебе нужно, но трдуно
                  определиться в разнообразии китайского чая, коего по истине
                  неизмеримое количество.{" "}
                </p>
                <p>
                  Специально для таких случаев мы приготовили типовые кейсы для
                  тех, кто примерно представляет вектор свеого вкуса.{" "}
                </p>
                <p>
                  Крепкие смолистые пуэры, нежнейшие белые чаи, терпкие
                  представители красного чая, цветочные весенние улуны и конечно
                  же витаминные зелёные чаи. Но что выберешь ты? Чего ты ищешь?{" "}
                </p>
                <button className="btn-get-started" onClick={() => {}}>
                  Выбрать готовый набор
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="delivery" className="delivery">
          <div className="container" data-aos="fade-up">
            <div className="row">
              <div className="col-lg-6 pt-4 pt-lg-0 content">
                <div className="block-header-left">
                  <h3>Как плавает карп</h3>
                  <div className="subtitle">
                    <h4>Оплата и доставка</h4>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p>
                Оплата выполняется так-то. Я хз, надо описать процесс оплаты по
                уму и потом посмотреть что и как, а потом уже от этого можно
                будет добавить какую-то кортинку сюда. Плюс текст будет больше,
                чем этот, поэтому я просто пока оставлю место внизу, а там как
                напишем, будем уже двигать по факту длинны текста.
                Соответственно также и с размером шрифта...
              </p>
              <p>
                По доставке тоже надо продумать текст, так как мы сможем
                заказать доставку до пункта выдачи или при желании клиента можно
                подумать о доставке до дома, если чел готов за это заплатить
                больше. Мы об этом чёт не думали. Можно будет сделать
                интерактивную панельку, чтобы чел выбирал желаемый тип доставки,
                который есть в его городе, а мы уже писали ему можем ли мы ему в
                эту кантору отправить или нет. Просто есть места где только СДЕК
                или только почта. Короче такое, надо подумать об этом ещё.
              </p>
            </div>

            <div className="delivery-steps mt-5">
              <div className="delivery-marks">
                <div className="hexagon-solid" />
                <div className="hexagon-solid hexagon-bold-border" />
                <div className="hexagon-solid hexagon-bold-border" />
                <div className="hexagon-solid hexagon-bold-border" />
              </div>
              <div className="delivery-line"></div>
            </div>

            <Form className="delivery-form mt-5 container">
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  md="4"
                  className="mb-2"
                  controlId="validationCustom03"
                >
                  <Form.Control
                    type="text"
                    variant="dark"
                    placeholder="Куда везти..."
                    required
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
                  >
                    <option value="0">Способ доставки неважен</option>
                    <option value="1">Доставка до двери СДЕК</option>
                    <option value="2">Почта России - самовывоз</option>
                    <option value="3">Яндекс доставка - курьер</option>
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
          </div>
        </section>

        <section id="faq" className="faq section-bg">
          <div className="container" data-aos="fade-up">
            <div className="row">
              <div className="col-lg-6 pt-4 pt-lg-0 content">
                <div className="block-header">
                  <h3>Остались вопросы?</h3>
                  <div className="subtitle">
                    <h4>Спроси и тебе ответят</h4>
                  </div>
                </div>
              </div>
              <span>Ниже представлены ответы на распространённые вопросы.</span>
              <span>
                Если этого недостаточно, вы можете связаться с нами{" "}
                <a href="#about">здесь</a>
              </span>
            </div>

            <Accordion className="faq-accordion" flush>
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  В чём смысл воот вообще всего?
                </Accordion.Header>
                <Accordion.Body className="accordion-body">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  Какая рыба в океане плавает быстрее всех?
                </Accordion.Header>
                <Accordion.Body>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Нахуя мне чай?</Accordion.Header>
                <Accordion.Body>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <div className="row">
              <span>
                Вы также можете оставить отзыв о работе нашего сервиса.
              </span>
              <span>
                Или связаться с нами через форму ниже. Мы ответим Вам как можно
                быстрее.
              </span>
            </div>
          </div>
        </section>

        <section id="contact" className="contact section-normal-bg">
          <div className="container" data-aos="fade-up">
            <Form className="contact-form">
              <Row className="mb-4">
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Control
                    type="text"
                    placeholder="Как к Вам обращаться?"
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Control
                    type="email"
                    placeholder="Почта для обратной связи"
                  />
                </Form.Group>
              </Row>

              <Form.Group
                className="mb-4"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Control type="text" placeholder="Тема сообщения" />
              </Form.Group>

              <Form.Group
                className="mb-4"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Ваше сообщение"
                />
              </Form.Group>

              <Form.Group
                as={Col}
                md="4"
                className="mb-4"
                controlId="validationCustom03"
              >
                <Button variant="light">Отправить сообщение</Button>
              </Form.Group>
            </Form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default General;
