import React from 'react';
import '../styles/UserPage.css';

export default function Datenschutz() {
  return (
    <div className="page page-container legal-page">
      <h1>Datenschutzerklärung</h1>
      
      <h2>1. Datenschutz auf einen Blick</h2>
      <p>
        Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
        Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der
        gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
      </p>

      <h2>2. Hosting</h2>
      <p>
        Unser Hoster erhebt in sogenannten Logfiles folgende Daten, die Ihr Browser übermittelt:
        IP-Adresse, Browsertyp, Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners,
        Uhrzeit der Serveranfrage.
      </p>

      <h2>3. Allgemeine Hinweise & Pflichtinformationen</h2>
      <p>
        Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich.
        Soweit auf unseren Seiten personenbezogene Daten erhoben werden, erfolgt dies stets auf
        freiwilliger Basis.
      </p>

      <h2>4. Datenerfassung auf unserer Website</h2>
      <p>
        <strong>Cookies:</strong> Die Internetseiten verwenden teilweise so genannte Cookies.
        Diese dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
      </p>
    </div>
  );
}
