import React, { useEffect, useState } from "react";
import logo from "/assets/android-chrome-512x512.png";

const Homepage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "/assets/pictures/istockphoto-875614148-1024x1024.jpg",
    "/assets/pictures/istockphoto-1864671713-1024x1024.jpg",
    "/assets/pictures/pexels-diimejii-3118214.jpg",
    "/assets/pictures/pexels-gabby-k-6238038.jpg",
    "/assets/pictures/pexels-george-milton-7014876.jpg",
    "/assets/pictures/pexels-katerina-holmes-5905557.jpg",
    "/assets/pictures/pexels-katerina-holmes-5905703.jpg",
    "/assets/pictures/pexels-keira-burton-6084263.jpg",
    "/assets/pictures/pexels-yankrukov-8520496.jpg",
  ];

  // currentIndex is declared here


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
      <div className="m-0 p-0">
        <div style={{position: "relative", height: "92vh"}}>
          {images.map((image, mapIndex) => (
              <img
                  key={image}
                  src={image}
                  alt={`Slide ${mapIndex + 1}`}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "opacity 3s ease-in-out",
                    opacity: mapIndex === currentIndex ? 1 : 0,
                    pointerEvents: "none"
                  }}
              />
          ))}


          <div className="d-flex flex-row p-4"
               style={{
                 position: "absolute",
                 top: "10px",
                 right: "20px",
                 backgroundColor: "rgba(0, 0, 0, 0.70)",
                 color: "white",
                 padding: "20px",
                 borderRadius: "12px",
                 maxWidth: "90%",
                 textAlign: "left",
               }}
          >
            <div className="me-4 d-none d-md-block">
              <img
                  src={logo}
                  alt="fairstudy Logo"
                  style={{
                    width: "200px",
                    display: "block",
                    zIndex: 1,
                  }}
              />
            </div>
            <div>
              <h1 className="mb-3">Willkommen bei Fairstudy!</h1>
              <h2>
                Wir bieten individuelle Nachhilfe für alle Schulstufen.<br/>
                Flexibel, Günstig und Qualitativ lernen
              </h2>
              <p>
                Erfahre mehr über uns und unsere Angebote!
              </p>
            </div>
          </div>
        </div>

        <div className="position-relative" style={{padding: "20px", backgroundColor: "#f8f9fa"}}>
          <div className="text-center">
            <h1>Hier kriegen Sie echte faire Nachhilfe!</h1>
            <p>Hier ist der Inhalt der Homepage.</p>
            <button
                className="btn btn-primary"
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  borderRadius: "5px",
                }}
            >
              Mehr erfahren
            </button>
          </div>
        </div>
      </div>
  );
};

export default Homepage;
