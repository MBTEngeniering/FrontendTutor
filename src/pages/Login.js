import React, { useState } from "react";

function Login({ closeModal }) {  // closeModal als Prop erhalten
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        console.log("Benutzername:", username);
        console.log("Passwort:", password);
        // Hier kannst du eine Login-Logik einfügen (z. B. API-Call)
        closeModal(); // Modal schließen nach dem Login
    };

    const handleCancel = () => {
        // Abbrechen und Modal schließen
        closeModal();
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '400px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
            <h2>Anmelden</h2>
            <input
                type="text"
                placeholder="Benutzername oder Nummer"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                    padding: '10px',
                    margin: '8px 0',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    width: '100%'
                }}
            />
            <input
                type="password"
                placeholder="Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                    padding: '10px',
                    margin: '8px 0',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    width: '100%'
                }}
            />
            <button
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
            <button
                onClick={handleCancel}
                style={{
                    padding: '10px',
                    marginTop: '10px',
                    backgroundColor: '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    width: '100%'
                }}
            >
                Abbrechen
            </button>
        </div>
    );
}

export default Login;
