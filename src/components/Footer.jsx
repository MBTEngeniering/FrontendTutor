import React from 'react';
import '../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Rechtliches</h3>
          <ul>
            <li><a href="/impressum">Impressum</a></li>
            <li><a href="/datenschutz">Datenschutz</a></li>
            <li><a href="/agb">AGB</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Hilfe & Support</h3>
          <ul>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/hilfe">Hilfe</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Kontakt</h3>
          <ul>
            <li>Email: info@frontendtutor.de</li>
            <li>Telefon: +49 123 456789</li>
            <li>Adresse: Musterstraße 1, 12345 Berlin</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Folgen Sie uns</h3>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} FrontendTutor. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
};
