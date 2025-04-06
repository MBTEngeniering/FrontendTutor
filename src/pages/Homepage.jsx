import React from "react";
import logo from "../../public/assets/android-chrome-512x512.png";

const Homepage = () => {
  return (
      <div className="page">

        <img
            src={logo}
            alt="Another example"
            style={{ width: '200px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', textAlign: 'center', margin: '40px auto', display: 'block' }}
        />

        <h1>Willkommen bei FGQTUTOR!</h1>
        <h2>Wir bieten individuelle Nachhilfe für alle Schulstufen.</h2>
        <h2>Flexibel Günstig und Qualitativ lernen</h2>
        <p>Erfahre mehr über uns und unsere Angebote!</p>

      </div>
  );
}

export default Homepage;
