import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Input, Modal, ModalBody, ModalFooter, ModalHeader, } from "reactstrap";
import { useAuth } from "../context/UseAuth.jsx";
import { userRoleIdToName, userRoleIdToPage } from "../util/mapping.js";

const Authenticate = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const {login, user, updateUser} = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => { // Make the function async
    try {
      setErrorMessage("");
      const userData = await login({ username, password });

      if (userData && userData.userRoleIds.length === 1) {
        updateUser({
          userRole: userRoleIdToName[userData.userRoleIds[0]],
          selectedUserRoleId: userData.userRoleIds[0],
          userPage: userRoleIdToPage[userData.userRoleIds[0]],
          isLoggedIn: true
        })
        navigate(userRoleIdToPage[userData.userRoleIds[0]]);
      } else if (userData && user.userRoleIds.length > 1) {
        setModalOpen(true);
      }
    } catch (error) {
      setErrorMessage("Email/Telefonnummer und Passwort stimmen nicht.");
      console.error("Login error:", error);
    }
  };

  const handleRoleSelection = (roleId) => {
    updateUser({
      userRole: userRoleIdToName[roleId],
      selectedUserRoleId: roleId,
      userPage: userRoleIdToPage[roleId], // 🔥 Speichert die zugehörige Seite
      isLoggedIn: true
    })

    setModalOpen(false); // Modal wird nach Auswahl der Rolle geschlossen
    navigate(userRoleIdToPage[roleId]);
  };

  return (
      <Container className="page m-auto mt-2">
        <div
            className="m-auto mt-3"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: "300px",
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
        >
          <h2>Anmelden über COOKIE</h2>
          {/*<Form onSubmit={e => {handleLogin(e)}} >*/}
          <form>
            <Input
                className="mb-2 form-control-lg"
                type="text"
                placeholder="Benutzername"
                value={username}
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                className="form-control-lg"
                type="password"
                placeholder="Passwort"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                className="mb-2 btn btn-success form-control"
                style={{padding: "10px", marginTop: "10px"}}
                onClick={handleLogin}
            >
              Login
            </Button>
          </form>
          {/*</Form>*/}
          {errorMessage && <p className="text-danger">{errorMessage}</p>}

          <p className="mt-2 mb-0">
            Noch kein Konto?{" "}
            <Link to="/registrierung" className="text-primary">
              Registrieren
            </Link>
          </p>
        </div>

        <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
          <ModalHeader toggle={() => setModalOpen(!modalOpen)}>Rolle auswählen</ModalHeader>
          <ModalBody>
            {user && user.userRoleIds.map((roleId, index) => (
                <Button
                    key={index}
                    color="secondary"
                    block
                    onClick={() => handleRoleSelection(roleId)}
                    style={{marginBottom: "10px"}}
                >
                  Als {userRoleIdToName[roleId]} einloggen
                </Button>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setModalOpen(false)}>
              Abbrechen
            </Button>
          </ModalFooter>
        </Modal>

        <p className="text-center mt-3">
          Passwort vergessen?{" "}
          <Link to="/passwort-vergessen" className="text-primary">
            Passwort zurücksetzen
          </Link>
        </p>
      </Container>
  );
};

export default Authenticate;
