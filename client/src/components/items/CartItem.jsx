import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { Image, Form, Row, Col, Button, InputGroup } from "react-bootstrap";

function CartItem({ box, index, className, updateHandler, deleteHandler }) {
  const { weights, classes } = useSelector(
    (state) => state.dictionariesStore.data
  );

  const teas = [...new Set(box.teas.map((tea) => classes[tea.class]))]
    .join(", ")
    .toLowerCase();
  const costs = Object.values(box.variants).map(item => item.cost);
  const weightsAvalible = Object.keys(box.variants).join(" | ").toUpperCase();

  return (
    <div className={`cart-box row ${className}`}>
      <div>
        <Image src="" rounded className="cart-box-img me-3" />
        <strong>{box.title}</strong> -
      </div>

      <div>
        <h5>{`${weights[box.selected]} - ${box.variants[box.selected].weight} г`}</h5>
        <h5>{`Стоимость: ${box.costs[box.selected]} руб.`}</h5>
      </div>

      <div className="buttons-block">
        <div className="buttons-count">
          <Button
            variant="secondary square"
            onClick={() => updateHandler(index, null, "del")}
          >
            -
          </Button>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="1"
              value={box.count}
              onChange={(e) => {
                console.log(e);
                updateHandler(index, e.target.value, "set");
              }}
            />
          </InputGroup>
          <Button
            variant="secondary square"
            onClick={() => updateHandler(index, null, "add")}
          >
            +
          </Button>
        </div>

        <Button variant="secondary w-100" onClick={() => deleteHandler(index)}>
          Удалить
        </Button>
      </div>
    </div>
  );
}

export default CartItem;
