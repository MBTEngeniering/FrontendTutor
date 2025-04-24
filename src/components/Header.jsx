import { lazy, useState } from "react";
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

const Linker = lazy(() => import(":comp/Linker.jsx"));

export default function Header({isLoggedIn, logoutFunc}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
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
                    <span
                        className="nav-link">  Willkommen, {localStorage.getItem("firstName")} {localStorage.getItem("lastName")}<br/></span>
                    <Link className="nav-link me-lg-3" onClick={logoutFunc}
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
  )
}
