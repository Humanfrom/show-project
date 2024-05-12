import { useDispatch, useSelector } from "react-redux";

function Delivery() {
  const dispatch = useDispatch();

  return (
    <section className="solid-bg">
      <div className="container" data-aos="fade-up">
        <div className="row">
          <div className="col-lg-6 pt-4 pt-lg-0 content">
            <div className="block-header-left">
              <h3>ДОСТАВКА И ОПЛАТА</h3>
              <div className="subtitle">
                <h4>КАК ПЛАВАЕТ КАРП</h4>
              </div>
            </div>
          </div>
          <span>
           Здесь вся информация по процессам оплаты и доставки.
          </span>
        </div>
      </div>
    </section>
  );
}

export default Delivery;
