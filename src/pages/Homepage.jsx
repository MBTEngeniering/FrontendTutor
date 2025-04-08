import React, { useState, useEffect } from "react";
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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="page text-center p-4" style={{ height: "100vh", margin: 0 }}>
            <img
                src={logo}
                alt="FGQTUTORD Logo"
                style={{
                    width: "200px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    margin: "40px auto",
                    display: "block",
                }}
            />


            <div
                style={{
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                    margin: "0",
                }}
            >

                <img
                    src={images[currentIndex]}
                    alt={`Bild ${currentIndex + 1}`}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "0",
                        display: "block",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                        transition: "opacity 1s ease-in-out",
                    }}
                />


                <div
                    style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        padding: "20px",
                        borderRadius: "12px",
                        maxWidth: "90%",
                        textAlign: "right",
                    }}
                >
                    <h1 style={{ margin: "0.5em 0" }}>Willkommen bei FGQTUTORD!</h1>
                    <h2 style={{ margin: "0.5em 0" }}>
                        Wir bieten individuelle Nachhilfe für alle Schulstufen.
                    </h2>
                    <h2 style={{ margin: "0.5em 0" }}>
                        Flexibel, Günstig und Qualitativ lernen
                    </h2>
                    <p style={{ margin: "0.5em 0" }}>
                        Erfahre mehr über uns und unsere Angebote!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
