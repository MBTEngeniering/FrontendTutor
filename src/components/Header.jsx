import { lazy, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
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
  UncontrolledDropdown
} from "reactstrap";
import { Link } from "react-router-dom";
import lettering from "/img/fs-logo-trans.png";
import lupe from "bootstrap-icons/icons/search.svg";
import logo from "/img/android-chrome-512x512.png";
import { useAuth } from "../context/UseAuth.jsx";

const Linker = lazy(() => import("./Linker.jsx"));

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
    const { user, logout } = useAuth();

  return (
      <Navbar container="fluid" className="mb-0" expand="lg">
        <NavbarBrand style={{ cursor: 'pointer' }}>
          <Linker link="/" title="Home">
            <div className="logo-title">
              <img src={logo} alt="Logo" className="logo" />
              <span><img src={lettering} alt="fairstudy" /></span>
            </div>
          </Linker>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
          <form>
            <input
                name="search"
                type="text"
                placeholder="Schnellsuche..."
                className="form-control-sm bg-body-secondary"
                style={{ borderRadius: '14px 0 0 14px' }}
            />
            <button type="submit" className="btn btn-primary btn-sm"
                    style={{
                      marginLeft: "0px",
                      marginRight: "10px",
                      padding: '5px 12px',
                      backgroundColor: '#00847F',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0 14px 14px 0'
                    }}>
              <img src={lupe} alt="Search" />
            </button>
          </form>
          <Nav navbar>
            <NavItem>
              <Link to="/wer-sind-wir" className="nav-link">Wer sind wir?</Link>
            </NavItem>
            <NavItem>
              <Link to="/abikurs" className="nav-link">Abikurs</Link>
            </NavItem>
            <NavItem>
              <Link to="/ueberuns" className="nav-link">Über Uns</Link>
            </NavItem>
            <NavItem>
              <Link to="/angebote" className="nav-link">Angebote</Link>
            </NavItem>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>Nachhilfe</DropdownToggle>
              <DropdownMenu right>
                <DropdownItem><Linker link="/preise">Preise</Linker></DropdownItem>
                <DropdownItem><Linker link="/elternschueler">Eltern/Schüler-Portal</Linker></DropdownItem>
                <DropdownItem divider />
                <DropdownItem><Linker link="/lehrer">Lehrer werden</Linker></DropdownItem>
                <DropdownItem><Linker link="/konzept">Konzept</Linker></DropdownItem>
                <DropdownItem><Linker link="/vortraege">Vorträge</Linker></DropdownItem>
                <DropdownItem><Linker link="/beratung">Kostenlose Beratung</Linker></DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              <Link to="/registrierung" className="nav-link">Registrierung</Link>
            </NavItem>
            <NavItem className="d-flex align-items-center">

              {!user || !user.isLoggedIn ? (
                  <Link className="nav-link" to="/authenticate">
                    <button style={{
                      padding: '6px 20px',
                      backgroundColor: 'black',
                      color: 'white',
                      border: 'none',
                      fontWeight: 'bold',
                    }}>
                      Anmelden
                    </button>
                  </Link>
              ) : (
                  <>
                <span className="nav-link">
                  {user.firstName} {user.lastName}
                </span>
                    <Link
                        className="nav-link me-lg-3"
                        onClick={logout}
                        style={{
                          marginLeft: "20px",
                          padding: '10px 10px',
                          backgroundColor: 'rgb(1,1,16)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          textAlign: 'center'
                        }}
                        to="/"
                    >
                      Abmelden
                    </Link>
                    <Nav navbar>
                      {/* 🔥 Neuer Button: "Meine Seite" */}
                      {user.isLoggedIn && user.userPage && (
                          <NavItem>
                            <button
                                className="btn btn-info"
                                style={{ marginRight: "10px" }}
                                onClick={() => navigate(user.userPage)}
                            >
                              Meine Seite<br/>
                              {user.userRole}
                            </button>
                          </NavItem>
                      )}
                    </Nav>
                  </>
              )}
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
  );
}
