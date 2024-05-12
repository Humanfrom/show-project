import { useDispatch, useSelector } from "react-redux";
import BoxItem from "../components/items/BoxItem";
import { useEffect, useState } from "react";
import { fetchBoxes, fetchBox, setBoxFilter, setBox } from "@Slices/boxSlice";
import { addBox } from "@Slices/subscribeSlice";
import { useBoxes } from "@Utils/useBoxes";
import {
  Offcanvas,
  Form,
  Row,
  Col,
  Button,
  InputGroup,
  Accordion,
  Figure,
} from "react-bootstrap";

function Boxes() {
  const defaultFilters = {
    classes: [],
    weights: [],
    levels: [],
    promotions: [],
    costs: {
      from: 0,
      to: 10000,
    },
    onlyAchievements: false,
    onlyAccess: false,
  };

  const currentBox = useSelector((state) => state.boxesStore.currentBox);
  const items = useSelector((state) => state.boxesStore.boxesList);
  const { weights, classes, levels, promos } = useSelector(
    (state) => state.dictionariesStore.data
  );

  const [filter, setFilter] = useState({ sort: "", query: "" });
  const [extendedFilter, setExtendedFilter] = useState({ ...defaultFilters });
  const [showBoxInfo, setShowBoxInfo] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useDispatch();
  const filredSortedBoxes = useBoxes(items, filter.sort, filter.query);

  const selectHandler = (name) => {
    dispatch(fetchBox({ name }));
    setShowBoxInfo(true);
  };

  const selectBox = (type) => {
    dispatch(setBox({ ...currentBox, selected: type }));
  };

  useEffect(() => {
    if (currentBox.name && !currentBox.selected) {
      selectBox(Object.keys(currentBox.variants)[0]);
    }
  }, [currentBox]);

  const handleShowBox = (show) => {
    setShowBoxInfo(show);
  };

  const handleShowFilter = (show) => {
    setShowFilters(show);
  };

  const handleAddCurrentBox = () => {
    dispatch(addBox(currentBox));
  };

  const setFilterParam = (name, value) => {
    setExtendedFilter((prev) => {
      let newValue = null;

      if (["classes", "weights", "promotions", "levels"].includes(name)) {
        newValue = prev[name].includes(value)
          ? prev[name].filter((item) => item !== value)
          : [...prev[name], value];
      }

      if (["onlyAccess", "onlyAchievements"].includes(name)) {
        console.log(name, value);
        newValue = value;
      }

      if (name === "costs") {
        newValue = { ...value };
      }

      return newValue !== null ? { ...prev, [name]: newValue } : prev;
    });
  };

  const setStoreFilter = async (filter) => await dispatch(setBoxFilter(filter));

  const startFullFilter = () => {
    setStoreFilter({ ...extendedFilter }).then(() => dispatch(fetchBoxes()));
    handleShowFilter(false);
  };

  const resetFilter = () => {
    setExtendedFilter({ ...defaultFilters });
    setStoreFilter(null).then(() => dispatch(fetchBoxes()));
    setShowFilters(false);
  };

  useEffect(() => {
    dispatch(fetchBoxes());
  }, []);

  console.log("currentBox", currentBox);

  return (
    <section className="solid-bg">
      <Offcanvas
        show={showFilters}
        onHide={() => handleShowFilter(false)}
        scroll={true}
        className="filters"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Фильтры</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Form.Label htmlFor="basic-url">Стоимость набора</Form.Label>
          <div className="d-flex delivery-form" style={{ gap: "1em" }}>
            <InputGroup className="authorisation__input">
              <Form.Control
                type="text"
                placeholder="0"
                value={extendedFilter.costs.from}
                onChange={(e) =>
                  setFilterParam("costs", {
                    from: Number(e.target.value),
                    to: extendedFilter.costs.to,
                  })
                }
              />
            </InputGroup>

            <InputGroup className="authorisation__input">
              <Form.Control
                type="text"
                placeholder="10000"
                value={extendedFilter.costs.to}
                onChange={(e) =>
                  setFilterParam("costs", {
                    to: Number(e.target.value),
                    from: extendedFilter.costs.from,
                  })
                }
              />
            </InputGroup>
          </div>
          <Accordion
            className="faq-accordion"
            flush
            alwaysOpen
            defaultActiveKey={["0"]}
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header>Чаи в наборе</Accordion.Header>
              <Accordion.Body className="accordion-body">
                {Object.keys(classes).map((key) => (
                  <Form.Check
                    key={key}
                    type="checkbox"
                    className="filter-checkbox"
                    id={`tea-class-${key}`}
                    label={`${classes[key]} чай`}
                    checked={extendedFilter.classes.includes(key)}
                    onChange={(e) => setFilterParam("classes", key)}
                  />
                ))}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Вариация по весу</Accordion.Header>
              <Accordion.Body>
                {Object.keys(weights).map((key) => (
                  <Form.Check
                    key={key}
                    type="checkbox"
                    className="filter-checkbox"
                    id={`tea-wieght-${key}`}
                    label={weights[key]}
                    checked={extendedFilter.weights.includes(key)}
                    onChange={(e) => setFilterParam("weights", key)}
                  />
                ))}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Редкость набора</Accordion.Header>
              <Accordion.Body>
                {levels.map((item, i) => (
                  <Form.Check
                    key={"level" + i}
                    type="checkbox"
                    className="filter-checkbox"
                    id={`tea-levels-${i}`}
                    label={item}
                    checked={extendedFilter.levels.includes(i)}
                    onChange={(e) => setFilterParam("levels", i)}
                  />
                ))}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Текущие акции</Accordion.Header>
              <Accordion.Body>
                {Object.keys(promos).map((key) => (
                  <Form.Check
                    key={key}
                    type="checkbox"
                    className="filter-checkbox"
                    id={`tea-promos-${key}`}
                    label={promos[key]}
                    checked={extendedFilter.promotions.includes(key)}
                    onChange={(e) => setFilterParam("promotions", key)}
                  />
                ))}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          <Form.Check
            type="checkbox"
            className="filter-checkbox"
            name="tea-access"
            id="tea-access"
            label="Только доступные мне"
            checked={extendedFilter.onlyAccess}
            onChange={(e) => setFilterParam("onlyAccess", e.target.checked)}
          />

          <Form.Check
            type="checkbox"
            className="filter-checkbox"
            name="tea-achievements"
            id="tea-achievements"
            label="Только наборы по акциям"
            checked={extendedFilter.onlyAchievements}
            onChange={(e) =>
              setFilterParam("onlyAchievements", e.target.checked)
            }
          />

          <div className="d-flex filter-buttons mt-3">
            <Button
              className="primary-button"
              variant="primary"
              onClick={() => startFullFilter()}
            >
              Применить фильтр
            </Button>
          </div>

          <div className="d-flex filter-buttons">
            <Button
              className="secondary-button"
              variant="secondary"
              onClick={() => handleShowFilter(false)}
            >
              Отмена
            </Button>
            <Button
              className="secondary-button"
              variant="secondary"
              onClick={() => resetFilter()}
            >
              Сбросить
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas
        show={showBoxInfo}
        onHide={() => handleShowBox(false)}
        placement="end"
        className="box-details"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{currentBox.title}</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <div>{currentBox.description}</div>

          <div className="mt-2">
            <ul>
              {currentBox.name &&
                currentBox.teas.map((tea, i) => (
                  <li key={`${tea.name}_${i}`}>
                    {tea.title} - {classes[tea.class]}
                  </li>
                ))}
            </ul>
          </div>

          <div className="offcanvas-footer">
            {currentBox.name ? (
              <div className="d-flex action-buttons">
                <Form.Group
                  as={Col}
                  md="6"
                  className="select-group mb-2"
                  controlId="validationCustom03"
                >
                  <Form.Select
                    aria-label="Default select example"
                    className="my-custom-select"
                    value={currentBox.selected}
                    onChange={(e) => selectBox(e.target.value)}
                  >
                    {Object.keys(currentBox.variants).map((type, i) => (
                      <option key={`type-${i}`} value={type}>
                        {weights[type]}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <h4>{`Стоимость: ${
                  currentBox.variants[currentBox.selected].cost
                } руб.`}</h4>
                <h4>{`Вес: ${
                  currentBox.variants[currentBox.selected].wieght
                } г`}</h4>
              </div>
            ) : null}

            <div className="d-flex action-buttons mt-3">
              <Button variant="secondary" onClick={() => handleShowBox(false)}>
                Назад
              </Button>
              <Button variant="primary" onClick={() => handleAddCurrentBox()}>
                Добавить в подписку
              </Button>
              <Button variant="primary" onClick={() => handleShowBox(false)}>
                Перейти к оформлению
              </Button>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="container" data-aos="fade-up">
        <div className="row">
          <div className="col-lg-6 pt-4 pt-lg-0 content">
            <div className="block-header-left">
              <h3>ВЫБЕРИ СВОЙ НАБОР</h3>
              <div className="subtitle">
                <h4>Функция ума - движение</h4>
              </div>
            </div>
          </div>
          <span>
            Вы можете выбрать активные наборы для оформления подписок.
          </span>

          <div>
            <Form className="delivery-form mt-5 container">
              <Row className="mb-3">
                <Form.Group
                  as={Col}
                  md="3"
                  className="select-group mb-2"
                  controlId="validationCustom03"
                >
                  <Form.Select
                    as={Col}
                    aria-label="Default select example"
                    className="my-custom-select"
                    onChange={(e) =>
                      setFilter((prev) => ({ ...prev, sort: e.target.value }))
                    }
                  >
                    <option value="name-up">По имени - возрастание</option>
                    <option value="name-down">По имени - убывание</option>
                    <option value="cost-up">По стоимости - возрастание</option>
                    <option value="cost-down">По стоимости - убывание</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="6"
                  className="mb-2 d-flex"
                  controlId="validationCustom03"
                >
                  <Button className="button-search">
                    <i className="bi bi-search"></i>
                  </Button>
                  <Form.Control
                    type="text"
                    variant="dark"
                    placeholder="Поиск..."
                    required
                    value={filter.query}
                    onChange={(e) =>
                      setFilter((prev) => ({ ...prev, query: e.target.value }))
                    }
                  />
                </Form.Group>
                <Form.Group
                  as={Col}
                  md="2"
                  className="mb-2"
                  controlId="validationCustom03"
                >
                  <Button
                    variant="light"
                    onClick={() => handleShowFilter(true)}
                  >
                    Фильтр
                  </Button>
                </Form.Group>
              </Row>
            </Form>
          </div>

          <div className="row gy-4">
            {filredSortedBoxes.map(
              (box, i) =>
                box.active && (
                  <BoxItem
                    className="col-lg-4 col-md-6 service-item d-flex"
                    key={`${box.name}-${i}`}
                    box={box}
                    selectHandler={selectHandler}
                  />
                )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Boxes;
