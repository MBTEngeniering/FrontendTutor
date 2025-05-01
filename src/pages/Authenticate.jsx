import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Input, Modal, ModalBody, ModalFooter, ModalHeader, } from "reactstrap";
import { useUser } from "../context/UserContext";

const Authenticate = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userRoleIds, setUserRoleIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const {setUser} = useUser(); // Zugriff auf den Context

  const userRoleIdToName = {
    1: "STUDENT",
    2: "TUTOR",
    3: "ENTERPRISE",
    4: "FINANCE",
    5: "ADMIN",
    6: "SUPPORT",
  };

  const userRoleIdToPage = {
    1: "/schueler",
    2: "/tutor",
    3: "/enterprise",
    4: "/finance",
    5: "/admin",
    6: "/support",
  };

  const handleLogin = async () => {
    setErrorMessage("");
    try {
      const UserResponse = await axios.post(`${apiUrl}/api/auth/authenticate`, {
            emailOrPhoneNumber: username,
            password: password,
          },
          {
            withCredentials: true, // Required for cookies to be sent/received
            headers: {
              'Content-Type': 'application/json'
            }
          });

      if (UserResponse.status === 200) {
        console.log(UserResponse);
        console.log(UserResponse.data);
        console.log("Login erfolgreich:", UserResponse);
        // const allUser = UserResponse.data;
        // const roleIds = allUser.userRoleIds || [];
        // setUserRoleIds(roleIds);
      }
    } catch (error) {
      setErrorMessage("Email/Telefonnummer und Passwort stimmen nicht.");
      console.log(error);
    }
  };


  const handleRoleSelection = (roleId) => {
    setUser((prevUser) => ({
      ...prevUser,
      isLoggedIn: true,
      userRole: userRoleIdToName[roleId],
      selectedUserRoleId: roleId,
      userPage: userRoleIdToPage[roleId],
    }));

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
          <h2>Anmelden</h2>
          <Input
              className="mb-2 form-control-lg"
              type="text"
              placeholder="Benutzername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
          />
          <Input
              className="form-control-lg"
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />
          <button
              className="mb-2 btn btn-primary form-control"
              onClick={handleLogin}
              style={{padding: "10px", marginTop: "10px"}}
          >
            Login
          </button>

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
            {userRoleIds.map((roleId, index) => (
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
