import React from 'react';
import '../styles/UserPage.css';

export default function Faq() {
  return (
    <div className="page-container">
      <h1>Häufig gestellte Fragen (FAQ)</h1>
      <div className="content-section">
        <h2>Allgemeine Fragen</h2>
        <div className="faq-item">
          <h3>Wie buche ich einen Tutor?</h3>
          <p>Sie können über Ihr Schülerprofil verfügbare Tutoren einsehen und Termine buchen.</p>
        </div>
        <div className="faq-item">
          <h3>Wie bezahle ich für den Unterricht?</h3>
          <p>Zahlungen erfolgen über unser sicheres Zahlungssystem per Kreditkarte oder PayPal.</p>
        </div>
      </div>
      <div className="content-section">
        <h2>Technische Fragen</h2>
        <div className="faq-item">
          <h3>Welche technischen Voraussetzungen benötige ich?</h3>
          <p>Sie benötigen einen Computer mit Internetzugang und eine Webcam für den Online-Unterricht.</p>
        </div>
      </div>
    </div>
  );
}
