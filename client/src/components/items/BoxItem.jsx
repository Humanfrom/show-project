import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Popover } from "react-bootstrap";

function BoxItem({ box, active, selectHandler, className }) {
  const { classes } = useSelector((state) => state.dictionariesStore.data);

  console.log("classes", classes);

  const selectbox = () => {
    selectHandler(box.name);
  };

  const teas = [...new Set(box.teas.map((tea) => classes[tea.class]))]
    .join(", ")
    .toLowerCase();

  const costs = Object.values(box.variants).map(item => item.cost);
  const weights = Object.keys(box.variants).join(" | ").toUpperCase();


  return (
    <OverlayTrigger
      trigger={["hover", "focus"]}
      placement="top"
      overlay={
        <Popover>
          <Popover.Header as="h3">{box.title}</Popover.Header>
          <Popover.Body>
            <ul>
              {box.teas.map((tea) => (
                <li key={tea.name + box.name}>
                  <strong>{tea.title}</strong> - {tea.class}
                </li>
              ))}
            </ul>
          </Popover.Body>
        </Popover>
      }
    >
      <div className={`box-item-body ${className}`} onClick={() => selectbox()}>
        <div className="box-item-title">{box.title}</div>
        <div className="box-item-teas">{teas}</div>
        <div className="box-item-weights">{weights}</div>
        <div className="box-item-cost">
          {Math.min(...costs)} - {Math.max(...costs)}
        </div>
        <div className="box-item-img">
          <img href="" />
        </div>
      </div>
    </OverlayTrigger>
  );
}

export default BoxItem;
