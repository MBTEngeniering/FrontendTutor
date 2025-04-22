import React from "react";
import { Link } from "react-router-dom";

export default function WhoWeAre() {
  return (
      <div className="page">
        <h1>Wer sind wir?</h1>
        <p>
          Wir sind eine Lernplattform, die für Qualität und Fairness steht.
        </p>
        <p>
          Nachhilfeunterricht scheitert nur selten am Fachwissen des Lehrers, sondern vielmehr an der Art und
          Weise, wie der Stoff unterrichtet wird. Unser Unternehmen hat es sich deswegen zum Ziel gesetzt durch
          spezielle Schulungen den Lehrer pädagogisch unter die Arme zu greifen, so dass wir unseren Schülern
          einen Unterricht von höchster Qualität erleben dürfen!
        </p>
        <p>
          Selbstverständlich werden unsere Lehrkräfte fair und überdurchschnittlich entlohnt, um einen weiteren
          Anreiz zu haben. Unser Preis-Leistungs-Verhältnis ist unschlagbar!
        </p>
        <p>
          Für alle Eltern und erwachsenen Schüler gibt es ausgewählte Seminare und Schulungen. Wer möchte
          kann sogar ein Zertifikat nach abgeschlossener Prüfung erhalten!
        </p>
        <p>
          Wir hoffen sehr, dass alle mit unserer Leistunge und Angebot zufrieden sind. Für Kritik und Anregung
          kann man uns gerne unter <Link to="/kontakt">Kontakt</Link> erreichen.
        </p>
        <p>
          Wir freuen uns auf eine gute Zusammenarbeit!
        </p>
      </div>
  )
}
