import React from 'react';
import '../../styles/impressum.css';

export default function Impressum() {
  return (
    <div className="impressum-container">
      <div className="container impressum-content"></div>

      <h1 className="impressum-title">Impressum</h1>   
      
      <h1 className="section-title">Angaben gemäß § 5 TMG</h1>
      <p>
        fairstudy UG <span class="section-text-small2">haftungsbeschrängt - in Gründung</span><br />
        Musterstraße 123<br />
        12345 Berlin<br />
        Deutschland<br />
        <br />
        Vertretungsberechtigter Geschäftsführer: Max Mustermann
      </p>

      <h1 className="section-title">Kontakt</h1>
      <p>
        Telefon: +49 (0) 123 456789<br />
        E-Mail: info@fairstudy.de<br />
        Internet: www.fairstudy.de
      </p>

      <h1 className="section-title">Registereintrag</h1>
      <p>
        Eingetragen im Handelsregister.<br />
        Registergericht: Amtsgericht Berlin<br />
        Registernummer: HRB 123456
      </p>

      <h1 className="section-title">Umsatzsteuer-ID</h1>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz:<br />
        DE123456789
      </p>
      
    </div>
  );
}
