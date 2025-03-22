import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";

// Seitenkomponenten importieren
import Startseite from "./pages/Startseite";
import Abikurs from "./pages/Abikurs";
import Beratung from "./pages/Beratung";
import ElternSchueler from "./pages/ElternSchueler";
import Konzept from "./pages/Konzept";
import Lehrer from "./pages/Lehrer";
import Preise from "./pages/Preise";
import Login from "./pages/Login";
import UeberUns from "./pages/UeberUns";
import Tutors from "./pages/Tutors";

function App() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
      <Router>
        <div className="navbar">
          <div className="container">
            {/* Logo und Titel */}
            <div className="logo-title">
              <img src="/android-chrome-512x512.png" alt="Logo" className="logo" />
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
            </nav>
          </div>
        </div>

        {/* Routing mit React Router v6 */}
        <Routes>
          <Route path="/" element={<Startseite />} />
          <Route path="/abikurs" element={<Abikurs />} />
          <Route path="/beratung" element={<Beratung />} />          
          <Route path="/ueberuns" element={<UeberUns />} />
          <Route path="/login" element={<Login />} />
          <Route path="/preise" element={<Preise />} />

          <Route path="/elternschueler" element={<ElternSchueler />} />          
          <Route path="/lehrer" element={<Lehrer />} />
          <Route path="/konzept" element={<Konzept />} />
          <Route path="/tutors" element={<Tutors />} />                    
        </Routes>
      </Router>
  );
}

export default App;
