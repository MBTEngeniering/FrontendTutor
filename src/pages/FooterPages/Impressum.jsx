import React from 'react';
import '../../styles/UserPage.css';

export default function Impressum() {
  return (
    <div className="page page-container legal-page">
      <h1>Impressum</h1>
      
      <h2>Angaben gemäß § 5 TMG</h2>
      <p>
        FrontendTutor GmbH<br />
        Musterstraße 123<br />
        12345 Berlin
      </p>

      <h2>Kontakt</h2>
      <p>
        Telefon: +49 (0) 123 456789<br />
        E-Mail: info@frontendtutor.de
      </p>

      <h2>Registereintrag</h2>
      <p>
        Eingetragen im Handelsregister.<br />
        Registergericht: Amtsgericht Berlin<br />
        Registernummer: HRB 123456
      </p>

      <h2>Umsatzsteuer-ID</h2>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz:<br />
        DE123456789
      </p>
    </div>
  );
}
