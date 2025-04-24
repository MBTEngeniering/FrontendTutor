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
import logo from "/img/android-chrome-512x512.png";
import lupe from "bootstrap-icons/icons/search.svg";
import WhoWeAre from "./pages/WhoWeAre.jsx";
import Kontakt from "./pages/Kontakt.jsx";
import ManageSeite from "./pages/ManageSeite.jsx";
import CorporateIdentity from "./pages/CorporateIdentity.jsx";
import lettering from "/img/fs-logo-trans.png";

// import { io } from "socket.io-client";
// import Home from "./pages/chat/Home.jsx";
// import ChatPage from "./pages/chat/ChatPage.jsx";

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
const Tutor = lazy(() => import("./pages/Tutor/TutorSeite.jsx"));
const Schueler = lazy(() => import("./pages/Student/SchuelerSeite.jsx"));
const Tutors = lazy(() => import("./pages/Tutor/Tutors.jsx"));
const Admin = lazy(() => import("./pages/Admin/AdminSeite.jsx"));
const Enterprise = lazy(() => import("./pages/EnterpriseSeite.jsx"));
const Support = lazy(() => import("./pages/Support/SupportSeite.jsx"));
const PasswordReset = lazy(() => import("./pages/PasswordReset.jsx"));
const Finance = lazy(() => import("./pages/Billing/FinanceSeite.jsx"));
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
const Manage = lazy(() => import("./pages/ManageSeite.jsx"));

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Benutzer-Login-Status
  const [userRole, setUserRole] = useState(null); // Benutzer-Rolle (Schüler oder RegisterTutor)


  // Establish a socket connection to the server at the specified URL
  // const socket = io.connect('http://localhost:3003');
  const [receiveMessage, setReceiveMessage] = useState(""); // State to store received message

  // Function to send a message
  /*
  const sendMessage = async () => {

    // Emit a socket event with the message details
    socket.emit("send_message", {
      senderId: "123",     // ID of the sender
      receiverId: "456", // ID of the receiver
      message: "Maintenance is going!"   // The actual message content
    });

  }
*/
  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    // Überprüfen, ob der Benutzer angemeldet ist (z.B. durch LocalStorage oder Cookies)
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("userRole");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
      setUserRole(role);
    }

/*
    console.log("Socket connected: ", socket.id); // Log the socket ID when connected
    // Listen for incoming messages from the server
    socket.on("receive_message", (data) => {
      console.log(data); // Log the received message data to the console
      setReceiveMessage(data); // Set the received message data to state
    });

    // Cleanup the effect by removing the event listener when the component unmounts
    return () => {
      socket.off("receive_message");
    };
 */
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
                <span><img src={lettering} alt="fairstudy"/></span>
              </div>
            </Linker>
          </NavbarBrand>
          <NavbarToggler onClick={toggle}/>
          <Collapse isOpen={isOpen} navbar className="justify-content-end">
            <form>
              <input name="search" type="text" placeholder="Schnellsuche..." className="form-control-sm bg-body-secondary"
              style={{
                borderRadius: '20px 0 0 20px',
              }}
              />
                <button type="submit" className="btn btn-primary btn-sm" style={{
                    marginLeft: "0px",
                    marginRight: "10px",
                    padding: '5px 12px',
                    backgroundColor: '#00847F',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0 20px 20px 0',
                }}><img src={lupe} alt="Search"/></button>
          </form>
            <Nav className="" navbar>
              <NavItem>
                <Link to="/wer-sind-wir" className="nav-link">
                  Wer sind wir?
                </Link>
              </NavItem>
              <NavItem>
                <Link to="/abikurs" className="nav-link">
                  Abikurs
                </Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link" to="/ueberuns">Über Uns</Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link" to="/ueberuns">Angebote</Link>
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
                  <DropdownItem><Linker link="/beratung">Kostenlose Beratung</Linker></DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem>
                <Link to="/registrierung" className="nav-link">
                  Registrierung
                </Link>
              </NavItem>
              <NavItem className="d-flex">
                {!isLoggedIn ? (
                    <Link className="nav-link" to="/login">
                        <button
                            style={{
                                padding: '2px 20px',
                                backgroundColor: 'black',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 'bold',
                                marginTop: '0px',
                            }}>
                        Anmelden
                        </button>
                    </Link>
                ) : (
                    <>
                      <span className="nav-link">  Willkommen, {localStorage.getItem("firstName")} {localStorage.getItem("lastName")}<br/></span>
                      <Link className="nav-link me-lg-3" onClick={handleLogout}
                            style={{
                              marginLeft: "20px",
                              padding: '10px 10px',
                              backgroundColor: 'rgb(1,1,16)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              textAlign: 'center',
                            }}
                            to="/">Abmelden
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
          <Route path="/schueler" element={<Schueler/>}/>
          <Route path="/tutor" element={<Tutor/>}/>
          <Route path="/vortraege" element={<Suspense fallback={<LoadingScreen/>}><Vortraege/></Suspense>}/>
          <Route path="/tutors" element={<Tutors/>}/>
          <Route path="/enterprise" element={<Enterprise/>}/>
          <Route path="/manage" element={<Manage/>}/>
          <Route path="/support" element={<Support/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/finance" element={<Finance/>}/>
          <Route path="/passwort-vergessen" element={<PasswordReset/>}/>
          <Route path="/impressum" element={<Impressum/>}/>
          <Route path="/datenschutz" element={<Datenschutz/>}/>
          <Route path="/agb" element={<Agb/>}/>
          <Route path="/faq" element={<Faq/>}/>
          <Route path="/hilfe" element={<Hilfe/>}/>
          <Route path="/blog" element={<Blog/>}/>
          <Route path="/wer-sind-wir" element={<WhoWeAre/>}/>
          <Route path="/kontakt" element={<Kontakt/>}/>
            <Route path="/ci" element={<CorporateIdentity/>}/>
          {/*<Route path="/chathome" element={<Home socket={socket}/>}></Route>*/}
          {/*<Route path="/chat" element={<ChatPage socket={socket}/>}/>*/}

          {/* Immer zuletzt */}
          <Route path="*" element={<Notfound/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
  );
}
