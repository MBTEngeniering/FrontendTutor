import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn, setUserRole }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const studentResponse = await axios.post("http://localhost:8080/api/students/login", {
                emailOrPhoneNumber: username,
                password: password,
            });
            if (studentResponse.status === 200) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userRole", "STUDENT");
                setIsLoggedIn(true);
                setUserRole("STUDENT");
                navigate("/schuelerSeite");
                return;
            }
        } catch (error) {
            try {
                const tutorResponse = await axios.post("http://localhost:8080/api/tutors/login", {
                    emailOrPhoneNumber: username,
                    password: password,
                });
                if (tutorResponse.status === 200) {
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userRole", "TUTOR");
                    setIsLoggedIn(true);
                    setUserRole("TUTOR");
                    navigate("/tutorseite");
                    return;
                }
            } catch (error) {
                setErrorMessage("Email/Telefonnummer und Passwort stimmen nicht.");
            }
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Benutzername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
}

export default Login;
