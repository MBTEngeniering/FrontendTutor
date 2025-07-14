import React, { useEffect, useState } from "react";
import logo from "/img/android-chrome-512x512.png";
import { Col, Container, Row } from "reactstrap";
import { Link } from "react-router-dom";


const Homepage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "/img/pictures/istockphoto-875614148-1024x1024.jpg",
    "/img/pictures/istockphoto-1864671713-1024x1024.jpg",
    "/img/pictures/pexels-diimejii-3118214.jpg",
    "/img/pictures/pexels-gabby-k-6238038.jpg",
    "/img/pictures/pexels-george-milton-7014876.jpg",
    "/img/pictures/pexels-katerina-holmes-5905557.jpg",
    "/img/pictures/pexels-katerina-holmes-5905703.jpg",
    "/img/pictures/pexels-keira-burton-6084263.jpg",
    "/img/pictures/pexels-yankrukov-8520496.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
      <>
        <h1 className="size-50 text-center text-black mt-5">
          Die faire Nachhilfe-Plattform
        </h1>

        <h2 className="text-center text-black mb-5">
          Hier kriegen Sie echte wertvolle Nachhilfe!
        </h2>

        <div style={{position: "relative", height: "60vh"}}>
          {images.map((image, mapIndex) => (
              <img
                  key={image}
                  src={image}
                  alt={`Slide ${mapIndex + 1}`}
                  loading="lazy"
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "opacity 3s ease-in-out",
                    opacity: mapIndex === currentIndex ? 1 : 0,
                    pointerEvents: "none"
                  }}
              />
          ))}
        </div>

        <Container className="text-center mt-5 mb-5">

          <h2>Bei uns können Sie folgendes genießen:</h2>

          <Row className="mt-5">
            <Col md="3">
              <img src={logo} alt="Logo" style={{width: "50px", height: "50px"}}/>
              <br/><br/>
              <h2 className="fw-bold">Flexibel</h2>
              <p>Unsere Nachhilfe ist flexibel und passt sich Ihren Bedürfnissen an</p>
            </Col>
            <Col md="3">
              <img src={logo} alt="Logo" style={{width: "50px", height: "50px"}}/>
              <br/><br/>
              <h2 className="fw-bolder">Günstig</h2>
              <p>Wir bieten faire Preise für qualitativ hochwertige Nachhilfe</p>
            </Col>
            <Col md="3">
              <img src={logo} alt="Logo" style={{width: "50px", height: "50px"}}/>
              <br/><br/>
              <h2 className="fw-bold">Qualitativ</h2>
              <p>Unsere Tutoren sind erfahren und qualifiziert</p>
            </Col>
            <Col md="3">
              <img src={logo} alt="Logo" style={{width: "50px", height: "50px"}}/>
              <br/><br/>
              <h2 className="fw-bold">Kommunikation</h2>
              <p>Wir sind jederzeit für Sie verfügbar. Sie erhalten immer zügig eine Antwort auf alle Ihre Fragen</p>
            </Col>
          </Row>
        </Container>


        <div className="text-center mt-5 pt-5 pb-5 prime-bg">
          <h2>Wir sind da, um Ihnen zu helfen!</h2>
          <h2>Wir bieten individuelle Nachhilfe für alle Schulstufen.</h2>
          Flexibel, Günstig und Qualitativ lernen
          Erfahren Sie mehr über uns und unsere Philosophie!

          <p className="text-center pt-5 pb-5">
            <Link to="/wer-sind-wir">
              <button
                  className="btn btn-primary"
                  style={{
                    padding: "10px 20px",
                    fontSize: "26px",
                    borderRadius: "0",
                    backgroundColor: "#086972",
                  }}
              >
                Wer wir sind
              </button>
            </Link>
          </p>
        </div>

        <div className="pt-5 pb-5 petrol-bg">
          <Container>
            <ul className="list-group">
              <li><h2>Wir sind ein waschechtes Unternehmen mit Sitz in Deutschland und somit "Made in Germany".</h2>
              </li>
              <li><h2>Wir sind ein Team von erfahrenen Lehrern und Tutoren, die sich leidenschaftlich für Bildung
                einsetzen.</h2></li>
              <li><h2>Unsere Mission ist es, jedem Schüler die bestmögliche Unterstützung zu bieten.</h2></li>
              <li><h2>Wir glauben an die Kraft der Bildung und daran, dass jeder Schüler das Potenzial hat, erfolgreich
                zu sein.</h2></li>
              <li><h2>Wir sind hier, um Ihnen zu helfen, Ihre Ziele zu erreichen und Ihr volles Potenzial
                auszuschöpfen.</h2></li>
              <li><h2>Wir freuen uns darauf, Sie auf Ihrem Bildungsweg zu begleiten!</h2></li>
            </ul>
          </Container>
        </div>


        <Container className="text-center pt-5 mt-5 mb-5">

          <h2 className="mt-5 mb-5">Wir sind hier, um Ihnen zu helfen!</h2>
          <Row>
            <Col md="4" className="text-center">
              <img src="//i.pravatar.cc/300" className="profile-pic" alt="Type"/>

              <div className="m-auto mt-5 mb-2" style={{width: "25px", height: "25px"}}
                   data-element-type="graphic">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1664 1792" id="1140442998"
                     className="svg u_1140442998" data-icon-name="fa-quote-right">
                  <path fill="inherit"
                        d="M768 320v704q0 104-40.5 198.5t-109.5 163.5-163.5 109.5-198.5 40.5h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64q106 0 181-75t75-181v-32q0-40-28-68t-68-28h-224q-80 0-136-56t-56-136v-384q0-80 56-136t136-56h384q80 0 136 56t56 136zM1664 320v704q0 104-40.5 198.5t-109.5 163.5-163.5 109.5-198.5 40.5h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64q106 0 181-75t75-181v-32q0-40-28-68t-68-28h-224q-80 0-136-56t-56-136v-384q0-80 56-136t136-56h384q80 0 136 56t56 136z"
                        id="1938712236"></path>
                </svg>
              </div>
              Ich bin sehr zufrieden mit der Nachhilfe, die ich hier bekommen habe. Die Tutoren sind sehr kompetent und
              helfen mir immer weiter. Ich kann es nur empfehlen!

              <h2 className="fw-bold">Max Mustermann</h2>

            </Col>
            <Col md="4" className="text-center">
              <img src="//i.pravatar.cc/300" className="profile-pic" alt="Type"/>

              <div className="m-auto mt-5 mb-2" style={{width: "25px", height: "25px"}}
                   data-element-type="graphic">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1664 1792" id="1140442998"
                     className="svg u_1140442998" data-icon-name="fa-quote-right">
                  <path fill="inherit"
                        d="M768 320v704q0 104-40.5 198.5t-109.5 163.5-163.5 109.5-198.5 40.5h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64q106 0 181-75t75-181v-32q0-40-28-68t-68-28h-224q-80 0-136-56t-56-136v-384q0-80 56-136t136-56h384q80 0 136 56t56 136zM1664 320v704q0 104-40.5 198.5t-109.5 163.5-163.5 109.5-198.5 40.5h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64q106 0 181-75t75-181v-32q0-40-28-68t-68-28h-224q-80 0-136-56t-56-136v-384q0-80 56-136t136-56h384q80 0 136 56t56 136z"
                        id="1938712236"></path>
                </svg>
              </div>

              fairstudy ist eine tolle Plattform für Nachhilfe. Ich habe hier viele neue Dinge gelernt und meine Noten
              haben sich
              <h2 className="fw-bold">Max Mustermann</h2>
            </Col>

            <Col md="4" className="text-center">
              <img src="//i.pravatar.cc/300" className="profile-pic" alt="Type"/>

              <div className="m-auto mt-5 mb-2" style={{width: "25px", height: "25px"}}
                   data-element-type="graphic">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1664 1792" id="1140442998"
                     className="svg u_1140442998" data-icon-name="fa-quote-right">
                  <path fill="inherit"
                        d="M768 320v704q0 104-40.5 198.5t-109.5 163.5-163.5 109.5-198.5 40.5h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64q106 0 181-75t75-181v-32q0-40-28-68t-68-28h-224q-80 0-136-56t-56-136v-384q0-80 56-136t136-56h384q80 0 136 56t56 136zM1664 320v704q0 104-40.5 198.5t-109.5 163.5-163.5 109.5-198.5 40.5h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64q106 0 181-75t75-181v-32q0-40-28-68t-68-28h-224q-80 0-136-56t-56-136v-384q0-80 56-136t136-56h384q80 0 136 56t56 136z"
                        id="1938712236"></path>
                </svg>
              </div>

              fairstudy ist ein tolles Unternehmen, das sich für faire Bildungschancen einsetzt. Ich bin sehr dankbar
              für die Unterstützung, die ich hier bekommen habe.
              <h2 className="fw-bold">Max Mustermann</h2>
            </Col>
          </Row>
        </Container>

        <p className="text-center pt-5 pb-5">
          <Link to="/kontakt">
            <button
                className="btn btn-primary"
                style={{
                  padding: "10px 20px",
                  fontSize: "26px",
                  borderRadius: "0",
                  backgroundColor: "#086972",
                }}
            >
                Kontaktieren Sie uns
            </button>
          </Link>
        </p>

      </>
  );
};

export default Homepage;
