import React from "react";
import { Link } from "react-router-dom";

function Vortraege() {
    return (
        <div className="page">
            <h2>Unsere Vorträge</h2>
            <p>Wir bieten regelmäßig Vorträge zu verschiedenen Bildungsthemen an.</p>
            <p>Besuche uns, um mehr zu erfahren!</p>
            <small><Link to="/tutors">.</Link></small>
        </div>
    );
}

export default Vortraege;
