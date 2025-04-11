import React from "react";
import './AboutUs.css';

function AboutUs() {
    return (
        <div className="about-us-container">
            <div className="container about-us-content">
                <h1 className="about-us-title">Über Uns</h1>
                
                <div className="about-us-section">
                    <h2 className="section-title">Unser Team</h2>
                    <p className="section-text">
                        Wir sind ein engagiertes Team von erfahrenen Lehrkräften und Pädagogen, 
                        die sich leidenschaftlich für faire Bildungschancen einsetzen.
                    </p>
                </div>

                <div className="about-us-section">
                    <h2 className="section-title">Unsere Mission</h2>
                    <p className="section-text">
                        Unser Ziel ist es, jedem Schüler zu helfen, sein volles Potenzial zu entfalten - 
                        unabhängig von Herkunft oder Vorbildung.
                    </p>
                </div>

                <div className="team-grid">
                    <div className="team-member">
                        <div className="member-image placeholder"></div>
                        <h3>Dr. Anna Müller</h3>
                        <p>Mathematik & Physik</p>
                        <p>10 Jahre Erfahrung</p>
                    </div>
                    <div className="team-member">
                        <div className="member-image placeholder"></div>
                        <h3>Thomas Schmidt</h3>
                        <p>Englisch & Geschichte</p>
                        <p>8 Jahre Erfahrung</p>
                    </div>
                    <div className="team-member">
                        <div className="member-image placeholder"></div>
                        <h3>Lisa Bauer</h3>
                        <p>Deutsch & Philosophie</p>
                        <p>6 Jahre Erfahrung</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutUs;
