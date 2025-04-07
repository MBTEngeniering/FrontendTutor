import { lazy, Suspense, useEffect, useState } from "react";
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
import Homepage from "./pages/Homepage.jsx";
import Abikurs from "./pages/Abikurs.jsx";
import Beratung from "./pages/Beratung.jsx";
import RegisterStudent from "./pages/RegisterStudent.jsx";
import Konzept from "./pages/Konzept.jsx";
import RegisterTutor from "./pages/RegisterTutor.jsx";
import Prices from "./pages/Prices.jsx";
import Login from "./pages/Login.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Linker from "./components/Linker.jsx";
import TutorSeite from "./pages/Tutor/TutorSeite.jsx";
import SchuelerSeite from "./pages/Student/SchuelerSeite.jsx";
import Tutors from "./pages/Tutor/Tutors.jsx";
import Register from "./pages/Register.jsx";

const Notfound = lazy(() => import("./pages/Notfound.jsx"));
const Vortraege = lazy(() => import("./pages/Vortraege.jsx"));
import AdminSeite from "./pages/Admin/AdminSeite.jsx";
import EnterpriseSeite from "./pages/EnterpriseSeite.jsx";
import ManageSeite from "./pages/Support/ManageSeite.jsx";
import PasswordReset from "./pages/PasswordReset.jsx";
import FinanceSeite from "./pages/Billing/FinanceSeite.jsx";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Benutzer-Login-Status
  const [userRole, setUserRole] = useState(null); // Benutzer-Rolle (Schüler oder RegisterTutor)

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
          <NavbarBrand style={{cursor: 'pointer'}}>
            <Linker link='/' title="Home">
              <div className="logo-title">
                <img src="/assets/android-chrome-512x512.png" alt="Logo" className="logo"/>
                <span className="title">FGQTUTOR</span>
              </div>
            </Linker>
          </NavbarBrand>
          <NavbarToggler onClick={toggle}/>
          <Collapse isOpen={isOpen} navbar>
            <Nav className="me-auto" navbar>
              <NavItem>
                <Link to="/registrierung" className="nav-link">
                  Registrierung
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
                  <DropdownItem divider/>
                  <DropdownItem><Linker link='/lehrer'>Lehrer werden</Linker></DropdownItem>
                  <DropdownItem><Linker link='/konzept'>Konzept</Linker></DropdownItem>
                  <DropdownItem><Linker link='/vortraege'>Vorträge</Linker></DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem className="float-end d-flex justify-content-end">
                {!isLoggedIn ? (
                    <Link className="nav-link" to="/login">Anmelden</Link>
                ) : (
                    <>
                      <span className="nav-link">{userRole === "STUDENT" ? "Schüler" : "Tutor"} eingeloggt<br/></span>
                      <Link className="nav-link me-lg-3" onClick={handleLogout}
                            style={{
                              marginLeft: "20px",
                              padding: '10px 10px',
                              backgroundColor: 'rgb(61,100,196)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              textAlign: 'center',
                            }}
                            to="/">Abmelden<br/>
                      </Link>
                    </>
                )}
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>

        <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/registrierung" element={<Register/>}/>
          <Route path="/abikurs" element={<Abikurs/>}/>
          <Route path="/beratung" element={<Beratung/>}/>
          <Route path="/ueberuns" element={<AboutUs/>}/>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole}/>}/>
          <Route path="/preise" element={<Prices/>}/>
          <Route path="/elternschueler" element={<RegisterStudent/>}/>
          <Route path="/lehrer" element={<RegisterTutor/>}/>
          <Route path="/konzept" element={<Konzept/>}/>
          <Route path="/schuelerseite" element={<SchuelerSeite/>}/>
          <Route path="/tutorseite" element={<TutorSeite/>}/>
          <Route path="/vortraege" element={<Suspense fallback={<div>Loading...</div>}><Vortraege/></Suspense>}/>
          <Route path="/tutors" element={<Tutors/>}/>
          <Route path="/enterpriseseite" element={<EnterpriseSeite/>}/>
          <Route path="/manageseite" element={<ManageSeite/>}/>
          <Route path="/adminSeite" element={<AdminSeite/>}/>
          <Route path="/financeseite" element={<FinanceSeite/>}/>
          <Route path="/passwort-vergessen" element={<PasswordReset/>}/>

          {/* Immer zuletzt */}
          <Route path="*" element={<Notfound/>}/>
        </Routes>
      </BrowserRouter>
  );
}
