import { lazy, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
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
import lettering from "/img/fs-logo-trans.png";
import lupe from "bootstrap-icons/icons/search.svg";
import logo from "/img/android-chrome-512x512.png";
import { useAuth } from "../../context/UseAuth.jsx";

const Linker = lazy(() => import("../../components/Linker.jsx"));

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  const {user, logout} = useAuth();

  return (
      <Navbar container="fluid" className="mb-0" expand="lg">
        <NavbarBrand style={{cursor: 'pointer'}}>
          <Linker link="/" title="Home">
            <div className="logo-title">
              <img src={logo} alt="Logo" className="logo"/>
              <span><img src={lettering} alt="fairstudy"/></span>
            </div>
          </Linker>
        </NavbarBrand>
        <NavbarToggler onClick={toggle}/>
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
          <form>
            <input
                name="search"
                type="text"
                placeholder="Schnellsuche..."
                className="form-control-sm bg-body-secondary"
                style={{borderRadius: '14px 0 0 14px'}}
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
              <img src={lupe} alt="Search"/>
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
              {/*  <DropdownItem><Linker link="/elternschueler">Eltern/Schüler-Portal</Linker></DropdownItem>*/}
                <DropdownItem divider/>
                <DropdownItem><Linker link="/konzept">Konzept</Linker></DropdownItem>
                <DropdownItem><Linker link="/vortraege">Vorträge</Linker></DropdownItem>
                <DropdownItem><Linker link="/beratung">Kostenlose Beratung</Linker></DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
              <Link to="/registrierung" className="nav-link">Registrierung</Link>
            </NavItem>
            {!user || !user.isLoggedIn ? (
                <NavItem>
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
                </NavItem>
            ) : (
                <>
                  <NavItem className="nav-link">
                    {user.firstName} {user.lastName}
                  </NavItem>
                  {user.isLoggedIn && user.userPage && (
                      <NavItem className="nav-link">
                        <button
                            className="btn btn-info"
                            onClick={() => navigate(user.userPage)}
                            title={user.userRole}
                        >
                          Meine Seite
                        </button>
                      </NavItem>
                  )}
                  <NavItem className="nav-link">
                    <Link
                        onClick={logout}
                        style={{
                          // marginLeft: "20px",
                          padding: '8px 10px',
                          backgroundColor: 'rgb(1,1,16)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          textAlign: 'center',
                          textDecoration: 'none',
                        }}
                        to="/"
                    >
                      Abmelden
                    </Link>
                  </NavItem>
                </>
            )}
          </Nav>
        </Collapse>
      </Navbar>
  );
}
