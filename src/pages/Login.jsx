import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Container, Input } from "reactstrap";

function Login({setIsLoggedIn, setUserRole}) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const studentResponse = await axios.post(`${apiUrl}/api/students/login`, {
        emailOrPhoneNumber: username,
        password: password,
      });
      if (studentResponse.status === 200) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", "STUDENT");
        setIsLoggedIn(true);
        setUserRole("STUDENT");
        navigate("/schuelerSeite");
      }
    } catch (error) {
      try {
        const tutorResponse = await axios.post(`${apiUrl}/api/tutors/login`, {
          emailOrPhoneNumber: username,
          password: password,
        });
        if (tutorResponse.status === 200) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userRole", "TUTOR");
          setIsLoggedIn(true);
          setUserRole("TUTOR");
          navigate("/tutorseite");
        }
      } catch (error) {
        setErrorMessage("Email/Telefonnummer und Passwort stimmen nicht.");
      }
    }
  };

  return (
      <Container>
        <div className="m-auto mt-3"
             style={{
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center',
               width: '100%',
               maxWidth: '300px',
               padding: '20px',
               backgroundColor: '#f9f9f9',
               borderRadius: '10px',
               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
             }}>
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
                padding: '10px',
                marginTop: '10px'
              }}
          >
            Login
          </button>
          {errorMessage && <p>{errorMessage}</p>}
          <p className="mt-2 mb-0">
            Noch kein Konto? <Link to="/registrierung" className="text-primary">Registrieren</Link>
          </p>
        </div>
        <p className="text-center mt-3">
          Passwort vergessen? <Link to="/passwort-vergessen" className="text-primary">Passwort zurücksetzen</Link>
        </p>
      </Container>
  );
}

export default Login;
