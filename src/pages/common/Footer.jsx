import '../../styles/Footer.css';
import { Link } from "react-router-dom";

export default function Footer() {
    // Footer component
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Rechtliches</h3>
          <ul>
            <li><Link to="/impressum">Impressum</Link></li>
            <li><Link to="/datenschutz">Datenschutz</Link></li>
            <li><Link to="/agb">AGB</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Hilfe & Support</h3>
          <ul>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/hilfe">Hilfe</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Kontakt</h3>
          <ul>
            <li>Email: info@fairstudy.de</li>
            <li>Telefon: (in Bearbeitung)</li>
            <li>Adresse: (in Bearbeitung)</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Folgen Sie uns</h3>
          <div className="social-icons">
            <Link to="#"><i className="fab fa-facebook"></i></Link>
            <Link to="#"><i className="fab fa-twitter"></i></Link>
            <Link to="#"><i className="fab fa-instagram"></i></Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} fairstudy UG. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
};
