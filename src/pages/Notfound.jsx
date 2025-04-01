import { Link } from "react-router-dom";

export default function Notfound() {
  return (
    <div className="container">
      <h1 className="text-center">404 - Seite nicht gefunden</h1>
      <p className="text-center">
        Die angeforderte Seite existiert nicht. Bitte überprüfen Sie die URL oder kehren Sie zur{" "}
        <Link to="/">Startseite</Link> zurück.
      </p>
    </div>
  );
}
