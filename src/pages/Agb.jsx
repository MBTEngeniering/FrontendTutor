import React from 'react';
import '../styles/UserPage.css';

export default function Agb() {
  return (
    <div className="page-container legal-page">
      <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>
      
      <h2>§ 1 Geltungsbereich</h2>
      <p>
        Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen FrontendTutor GmbH
        und unseren Kunden über die Erbringung von Nachhilfeleistungen.
      </p>

      <h2>§ 2 Vertragsschluss</h2>
      <p>
        Der Vertrag kommt zustande durch die Online-Buchung des Kunden und unsere schriftliche Bestätigung.
      </p>

      <h2>§ 3 Leistungen</h2>
      <p>
        Wir erbringen Nachhilfeleistungen in den gebuchten Fächern zum vereinbarten Zeitpunkt.
        Die Leistungen werden online über unsere Plattform erbracht.
      </p>

      <h2>§ 4 Zahlungsbedingungen</h2>
      <p>
        Die Zahlung erfolgt im Voraus per Überweisung oder über unser Online-Zahlungssystem.
        Stornierungen sind bis 24 Stunden vor Terminbeginn kostenfrei möglich.
      </p>

      <h2>§ 5 Haftung</h2>
      <p>
        Wir haften nicht für den Lernerfolg der Schüler, sondern lediglich für die ordnungsgemäße
        Erbringung der vereinbarten Nachhilfestunden.
      </p>
    </div>
  );
}
