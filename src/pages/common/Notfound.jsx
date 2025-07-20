import { Link } from "react-router-dom";

export default function Notfound() {
  return (
      <div className="container">
        <p className="page">
          <h1 className="text-center mt-5">404 - Seite nicht gefunden</h1>
          <p className="text-center fs-4">
            Die angeforderte Seite existiert nicht. Bitte überprüfen Sie die URL oder kehren Sie zur{" "}
            <Link to="/">Startseite</Link> zurück.
          </p>
        </p>
      </div>
  );
}
