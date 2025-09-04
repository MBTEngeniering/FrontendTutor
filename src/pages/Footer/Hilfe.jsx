import React from 'react';
import '../../styles/UserPage.css';

export default function Hilfe() {
  return (
    <div className="page page-container">
      <h1>Hilfe & Support</h1>
      <div className="content-section">
        <h2>Kontaktieren Sie uns</h2>
        <p>Bei Fragen oder Problemen können Sie uns gerne kontaktieren:</p>
        <ul>
          <li>Email: support@frontendtutor.de</li>
          <li>Telefon: +49 123 456789</li>
          <li>Live-Chat: Verfügbar Mo-Fr 9-18 Uhr</li>
        </ul>
      </div>
      <div className="content-section">
        <h2>Häufige Probleme</h2>
        <div className="help-item">
          <h3>Ich kann mich nicht einloggen</h3>
          <p>Bitte überprüfen Sie Ihre Login-Daten oder nutzen Sie die Passwort-Reset-Funktion.</p>
        </div>
        <div className="help-item">
          <h3>Mein Termin wurde nicht gebucht</h3>
          <p>Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.</p>
        </div>
      </div>
    </div>
  );
}
