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
import LoadingScreen from "./components/LoadingScreen.jsx";
import logo from "/assets/android-chrome-512x512.png";

// Seitenkomponenten importieren
const Homepage = lazy(() => import("./pages/Homepage.jsx"));
const Abikurs = lazy(() => import("./pages/Abikurs.jsx"));
const Beratung = lazy(() => import("./pages/Beratung.jsx"));
const RegisterStudent = lazy(() => import("./pages/RegisterStudent.jsx"));
const Konzept = lazy(() => import("./pages/Konzept.jsx"));
const RegisterTutor = lazy(() => import("./pages/RegisterTutor.jsx"));
const Prices = lazy(() => import("./pages/Prices.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const AboutUs = lazy(() => import("./pages/AboutUs.jsx"));
const Linker = lazy(() => import("./components/Linker.jsx"));
const TutorSeite = lazy(() => import("./pages/Tutor/TutorSeite.jsx"));
const SchuelerSeite = lazy(() => import("./pages/Student/SchuelerSeite.jsx"));
const Tutors = lazy(() => import("./pages/Tutor/Tutors.jsx"));
const AdminSeite = lazy(() => import("./pages/Admin/AdminSeite.jsx"));
const EnterpriseSeite = lazy(() => import("./pages/EnterpriseSeite.jsx"));
const SupportSeite = lazy(() => import("./pages/Support/SupportSeite.jsx"));
const PasswordReset = lazy(() => import("./pages/PasswordReset.jsx"));
const FinanceSeite = lazy(() => import("./pages/Billing/FinanceSeite.jsx"));
const Footer = lazy(() => import("./components/Footer.jsx"));
const Impressum = lazy(() => import("./pages/FooterPages/Impressum.jsx"));
const Datenschutz = lazy(() => import("./pages/FooterPages/Datenschutz.jsx"));
const Agb = lazy(() => import("./pages/FooterPages/Agb.jsx"));
const Faq = lazy(() => import("./pages/FooterPages/Faq.jsx"));
const Hilfe = lazy(() => import("./pages/FooterPages/Hilfe.jsx"));
const Blog = lazy(() => import("./pages/FooterPages/Blog.jsx"));
const Notfound = lazy(() => import("./pages/Notfound.jsx"));
const Vortraege = lazy(() => import("./pages/Vortraege.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));

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
        <Navbar container="fluid" className="mb-0" expand="lg">
          <NavbarBrand style={{cursor: 'pointer'}}>
            <Linker link='/' title="Home">
              <div className="logo-title">
                <img src={logo} alt="Logo" className="logo"/>
                <span className="title">fairstudy</span>
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
          <Route path="/registrierung" element={<Suspense fallback={<LoadingScreen/>}><Register/></Suspense>}/>
          <Route path="/abikurs" element={<Suspense fallback={<LoadingScreen/>}><Abikurs/></Suspense>}/>
          <Route path="/beratung" element={<Beratung/>}/>
          <Route path="/ueberuns" element={<AboutUs/>}/>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole}/>}/>
          <Route path="/preise" element={<Prices/>}/>
          <Route path="/elternschueler" element={<Suspense fallback={<LoadingScreen/>}><RegisterStudent/></Suspense>}/>
          <Route path="/lehrer" element={<Suspense fallback={<LoadingScreen/>}><RegisterTutor/></Suspense>}/>
          <Route path="/konzept" element={<Konzept/>}/>
          <Route path="/schueler" element={<SchuelerSeite/>}/>
          <Route path="/tutorseite" element={<TutorSeite/>}/>
          <Route path="/vortraege" element={<Suspense fallback={<LoadingScreen/>}><Vortraege/></Suspense>}/>
          <Route path="/tutors" element={<Tutors/>}/>
          <Route path="/enterprise" element={<EnterpriseSeite/>}/>
          <Route path="/support" element={<SupportSeite/>}/>
          <Route path="/admin" element={<AdminSeite/>}/>
          <Route path="/finance" element={<FinanceSeite/>}/>
          <Route path="/passwort-vergessen" element={<PasswordReset/>}/>
          <Route path="/impressum" element={<Impressum/>}/>
          <Route path="/datenschutz" element={<Datenschutz/>}/>
          <Route path="/agb" element={<Agb/>}/>
          <Route path="/faq" element={<Faq/>}/>
          <Route path="/hilfe" element={<Hilfe/>}/>
          <Route path="/blog" element={<Blog/>}/>

          {/* Immer zuletzt */}
          <Route path="*" element={<Notfound/>}/>
        </Routes>



        {/*<div className=" position-absolute bottom-0 w-100">*/}
        {/*<div className=" justify-content-sm-around position-relative w-100">*/}
          <Footer/>
        {/*</div>*/}
        {/*</div>*/}
      </BrowserRouter>
  );
}
