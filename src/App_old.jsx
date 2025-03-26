import { useState } from "react";
import { BrowserRouter, Route, Routes, Link } from "react-router";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

// Seitenkomponenten importieren
import Startseite from "./pages/Startseite.jsx";
import Abikurs from "./pages/Abikurs.jsx";
import Beratung from "./pages/Beratung.jsx";
import ElternSchueler from "./pages/ElternSchueler.jsx";
import Konzept from "./pages/Konzept.jsx";
import Lehrer from "./pages/Lehrer.jsx";
import Preise from "./pages/Preise.jsx";
import Login from "./pages/Login.jsx";
import UeberUns from "./pages/UeberUns.jsx";
import Tutors from "./pages/Tutors.jsx";
import MeineTermine from "./pages/MeineTermine.jsx";

export default function App() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="navbar">
        <div className="container">
          {/* Logo und Titel */}
          <div className="logo-title">
            <img src="/assets/android-chrome-512x512.png" alt="Logo" className="logo" />
            <span className="title">FGQTUTOR</span>
          </div>

          {/* Navigation */}
          <nav className="nav-links">
            <Link to="/">Startseite</Link>
            <Link to="/abikurs">Abikurs</Link>
            <Link to="/beratung">Kostenlose Beratung</Link>
            <Link to="/ueberuns">Über Uns</Link>
            <Link to="/login">Anmelden</Link>

            {/* Dropdown Menü */}
            <li className="dropdown" onClick={() => setDropdownOpen(!isDropdownOpen)}>
              <span>Nachhilfe</span>
              {isDropdownOpen && (
                <ul className="dropdown-content">
                  <li>
                    <Link to="/preise">Preise</Link>
                  </li>
                  <li>
                    <Link to="/elternschueler">Eltern/Schüler-Portal</Link>
                  </li>
                  <li>
                    <Link to="/lehrer">Lehrer werden</Link>
                  </li>
                  <li>
                    <Link to="/konzept">Konzept</Link>
                  </li>
                  <li>
                    <Link to="/tutors">Tutoren</Link>
                  </li>
                </ul>
              )}
            </li>
            <Link to="/meinetermine">Mein Termine</Link>
          </nav>
        </div>
      </div>

      {/* Routing mit React Router v6 */}
      <Routes>
        <Route path="/" element={<Startseite />} />
        <Route path="/abikurs" element={<Abikurs />} />
        <Route path="/beratung" element={<Beratung />} />
        <Route path="/ueberuns" element={<UeberUns />} />
        <Route path="/meinetermine" element={<MeineTermine />} />
        <Route path="/login" element={<Login />} />
        <Route path="/preise" element={<Preise />} />

        <Route path="/elternschueler" element={<ElternSchueler />} />
        <Route path="/lehrer" element={<Lehrer />} />
        <Route path="/konzept" element={<Konzept />} />
        <Route path="/tutors" element={<Tutors />} />
      </Routes>
    </BrowserRouter>
  );
}
