import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
              className="mb-2"
              type="text"
              placeholder="Benutzername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
          />
          <Input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
          />
          <button
              className="mb-2"
              onClick={handleLogin}
              style={{
                padding: '10px',
                marginTop: '10px',
                backgroundColor: '#0044cc',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                width: '100%'
              }}
          >
            Login
          </button>
          {errorMessage && <p>{errorMessage}</p>}
        </div>
      </Container>
  );
}

export default Login;
