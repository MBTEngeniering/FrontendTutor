import React from "react";
import { Card, CardBody, CardFooter, CardTitle, Col, Container, Row } from "reactstrap";
import "./Register.css";
import { Link } from "react-router-dom";

const Register = () => {
  return (
      <div className="page">
        <h2 className="text-lg-center">Registrierung</h2>
        <Container className="mt-2 mt-sm-4">
          <Row>
            <Col md="6">
              <Card className="mb-3 mb-md-0" style={{backgroundColor: "#eff", padding: "20px", border: "1px solid #ccc", borderRadius: "20px"}}>
                <CardTitle>
                  <h3>Ich bin...</h3>
                </CardTitle>
                <CardBody>
                  <p>Um/Schüler:in</p>
                  <p>Student:in</p>
                  <p>Lernhilfe suchende:r</p>
                  <p>Elternteil</p>
                </CardBody>
                <CardFooter style={{backgroundColor: "transparent", border: "none"}}>
                  <hr/>
                  <Link to="/elternschueler" title="Eltern/Schüler-Portal">
                  <button
                      className="mb-2 btn btn-primary glossy-button"
                      style={{
                        padding: '10px',
                        marginTop: '10px',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        width: '100%',
                        fontWeight: "bolder",
                      }}
                  >
                    Registrieren
                  </button>
                    </Link>
                </CardFooter>
              </Card>
            </Col>

            <Col md="6">
              <Card style={{backgroundColor: "#efe", padding: "20px", border: "1px solid #ccc", borderRadius: "20px"}}>
                <CardTitle>
                  <h3>Ich bin...</h3>
                </CardTitle>
                <CardBody>
                  <p>Lehrer:in</p>
                  <p>Tutor:in</p>
                  <p>Nachhilfelehrer:in</p>
                  <p>Lernhilfe anbietende:r</p>
                </CardBody>
                <CardFooter style={{backgroundColor: "transparent", border: "none"}}>
                  <hr/>
                  <Link to="/lehrer" title="Tutor werden">
                  <button
                      className="mb-2 btn btn-success glossy-button"
                      style={{
                        padding: '10px',
                        marginTop: '10px',
                        width: '100%',
                        fontWeight: "bolder",
                      }}
                  >
                    Registrieren
                  </button>
                  </Link>
                </CardFooter>
              </Card>

            </Col>
          </Row>
        </Container>
      </div>
  );
}

export default Register;
