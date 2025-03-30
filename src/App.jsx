import { useState, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  UncontrolledDropdown,
} from 'reactstrap';
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
import Linker from "./components/Linker.jsx";
import TutorSeite from "./pages/TutorSeite.jsx";
import SchuelerSeite from "./pages/SchuelerSeite.jsx";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Benutzer-Login-Status
  const [userRole, setUserRole] = useState(null); // Benutzer-Rolle (Schüler oder Lehrer)

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Überprüfen, ob der Benutzer angemeldet ist (z.B. durch LocalStorage oder Cookies)
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("userRole");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    // Benutzer abmelden
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
      <BrowserRouter>
        <Navbar container="fluid" className="mb-1" expand="lg">
          <NavbarBrand style={{ cursor: 'pointer' }}>
            <Linker link='/' title="Home">
              <div className="logo-title">
                <img src="/assets/android-chrome-512x512.png" alt="Logo" className="logo" />
                <span className="title">FGQTUTOR</span>
              </div>
            </Linker>
          </NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="me-auto" navbar>
              <NavItem>
                <Link to="/" className="nav-link">
                  Startseite
                </Link>
              </NavItem>
              <NavItem>
                <Link to="/abikurs" className="nav-link">
                  Abikurs
                </Link>
              </NavItem>
              <NavItem>
                <Link to="/beratung" className="nav-link">
                  Kostenlose Beratung
                </Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link" to="/ueberuns">Über Uns</Link>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Nachhilfe
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem><Linker link="/preise">Preise</Linker></DropdownItem>
                  <DropdownItem><Linker link="/elternschueler">Eltern/Schüler-Portal</Linker></DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem><Linker link='/lehrer'>Lehrer werden</Linker></DropdownItem>
                  <DropdownItem><Linker link='/konzept'>Konzept</Linker></DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem className="float-end">
                {!isLoggedIn ? (
                    <Link className="nav-link" to="/login">Anmelden</Link>
                ) : (
                    <>
                      <span className="nav-link">{userRole === "STUDENT" ? "Schüler" : "Tutor"} eingeloggt</span>
                      <button
                          onClick={handleLogout}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: 'rgba(204,0,0,0.2)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                          }}
                      >
                        <Link className="nav-link" to="/">Abmelden</Link>
                      </button>
                    </>
                )}
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>

        <Routes>
          <Route path="/" element={<Startseite />} />
          <Route path="/abikurs" element={<Abikurs />} />
          <Route path="/beratung" element={<Beratung />} />
          <Route path="/ueberuns" element={<UeberUns />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
          <Route path="/preise" element={<Preise />} />
          <Route path="/elternschueler" element={<ElternSchueler />} />
          <Route path="/lehrer" element={<Lehrer />} />
          <Route path="/konzept" element={<Konzept />} />
          <Route path="/schuelerseite" element={<SchuelerSeite />} />
          <Route path="/tutorseite" element={<TutorSeite />} />
        </Routes>
      </BrowserRouter>
  );
}
