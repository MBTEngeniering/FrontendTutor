import {useState} from "react";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
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
//import { useNavigate } from "react-router";
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
import Linker from "./components/Linker.jsx";

export default function App() {

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);


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
              <Link className="nav-link" to="/ueberuns">Über Uns
              </Link>
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
                {/*<DropdownItem><Linker link='/tutors'>Tutoren</Linker></DropdownItem>*/}
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
            </NavItem>
            <NavItem className="float-end">
              <Link className="nav-link" to="/login">Anmelden</Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
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
      </Routes>
    </BrowserRouter>
  );
}  
