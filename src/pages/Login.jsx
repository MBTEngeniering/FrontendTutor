import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Container, Input, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

function Login({ setIsLoggedIn, setUserRole }) {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [userRoleIds, setUserRoleIds] = useState([]);
    const [tutorId, setTutorId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);  // State for modal visibility
    const navigate = useNavigate();

    const userRoleIdToName = {
        1: "Student",
        2: "Tutor",
        3: "Enterprise",
        4: "Finance",
        5: "Admin",
        6: "Manage",
    };
    const userRoleIdToPage = {
        1: "/schuelerseite",
        2: "/tutorseite",
        3: "/enterpriseseite",
        4: "/financeseite",
        5: "/adminSeite",
        6: "/manageseite",
    };


    const handleLogin = async () => {
        setErrorMessage("");
        try {
            const studentResponse = await axios.post(`${apiUrl}/api/students/login`, {
                emailOrPhoneNumber: username,
                password: password,
            });

            if (studentResponse.status === 200) {
                const student = studentResponse.data;
                const roleIds = student.userRoleIds || [];
                setTutorId(student.id);
                setUserRoleIds(roleIds);
                if (roleIds.length === 1) {
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userRole", "STUDENT");
                    localStorage.setItem("selectedUserRoleId", roleIds[0]);
                    setIsLoggedIn(true);
                    setUserRole("STUDENT");
                    navigate(userRoleIdToPage[roleIds[0]]);

                } else {
                    setModalOpen(true);
                }

                return;
            }
        } catch (error) {
            // Ignorieren, versuche Tutor-Login

            try {
                const tutorResponse = await axios.post(`${apiUrl}/api/tutors/login`, {
                    emailOrPhoneNumber: username,
                    password: password,
                });

                if (tutorResponse.status === 200) {
                    const tutor = tutorResponse.data;
                    const roleIds = tutor.userRoleIds || [];

                    //alert(`Erfolgreich als Tutor eingeloggt. Tutor-ID: ${tutor.id}`);
                    setTutorId(tutor.id);
                    setUserRoleIds(roleIds);

                    if (roleIds.length === 1) {
                        localStorage.setItem("isLoggedIn", "true");
                        localStorage.setItem("userRole", "TUTOR");
                        localStorage.setItem("selectedUserRoleId", roleIds[0]);
                        setIsLoggedIn(true);
                        setUserRole("TUTOR");
                        navigate(userRoleIdToPage[roleIds[0]]);
                    } else {
                        setModalOpen(true);
                    }
                }

            } catch (error) {
                setErrorMessage("Email/Telefonnummer und Passwort stimmen nicht.");
            }
        }
    };

    const handleRoleSelection = (roleId) => {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", "TUTOR");
        localStorage.setItem("selectedUserRoleId", roleId);
        setIsLoggedIn(true);
        setUserRole("TUTOR");
        setModalOpen(false); // Schließe das Modal
        navigate(userRoleIdToPage[roleId]);
    };

    return (
        <Container>
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
                    style={{
                        padding: "10px",
                        marginTop: "10px",
                    }}
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

            {/* Modal für die Auswahl der Rolle */}
            <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
                <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
                </ModalHeader>
                <ModalBody>
                    {userRoleIds.map((roleId, index) => (
                        <Button
                            key={index}
                            color="secondary"
                            block
                            onClick={() => handleRoleSelection(roleId)}
                            style={{ marginBottom: "10px" }}
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
}

export default Login;
