import { useEffect } from "react";
import { Accordion, Spinner, Placeholder } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchInfo } from "../slices/infoSlice";
import useToken from "@Utils/useToken";

function Info() {
  const { name, data } = useSelector((state) => state.infoStore.currentData);
  const dispatch = useDispatch();
  const { token } = useToken();

  useEffect(() => {
    dispatch(fetchInfo({ token, name: "help" }));
  }, []);

  return (
    <section className="solid-bg">
      <div className="container" data-aos="fade-up">
        <div className="row">
          <div className="col-lg-6 pt-4 pt-lg-0 content">
            <div className="block-header-left">
              <h3>ПОМОЩЬ</h3>
              <div className="subtitle">
                <h4>Внимательность - ключ к счастью</h4>
              </div>
            </div>
          </div>
          <span>
            Проверьте все параметры и пункты перед переходом к оплате.
          </span>

          {data ? (
            <Accordion
              defaultActiveKey="0"
              flush
              className="help-accorion mt-3"
              alwaysOpen
            >
              {data.map((chapter, i) => {
                const { header, description, text } = chapter;
                return (
                  <Accordion.Item eventKey={i} key={`info-${i}`}>
                    <Accordion.Header>
                      <div>
                        <h2>{header}</h2>
                        <p>{description}</p>
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>{text}</Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          ) : (
            <div className="loader-line">
              <Spinner animation="border" role="status" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Info;
