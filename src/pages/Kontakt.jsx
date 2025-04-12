import { Col, Container, Row } from "reactstrap";

export default function Kontakt() {
  return (
      <Container className="page">
        <Row>
          <Col xs="12" md="8" className="">
            <h2>Kontakt</h2>
            <p>Wir freuen uns, von Ihnen zu hören! Bitte füllen Sie das folgende Formular aus, um uns zu
              kontaktieren.</p>
            <form>
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" name="name" required className="form-control"/>

              <label htmlFor="email">E-Mail:</label>
              <input type="email" id="email" name="email" required className="form-control"/>

              <label htmlFor="message">Nachricht:</label>
              <textarea id="message" className="form-control" name="message" required rows="10"></textarea>

              <div className="d-flex justify-content-between">
                <button type="submit" className="mt-2 btn btn-success">Absenden</button>
                <button type="button" className="justify-content-end mt-2 btn btn-warning">Text löschen</button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
  )
}
