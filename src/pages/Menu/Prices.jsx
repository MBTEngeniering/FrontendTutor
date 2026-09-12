import React from "react";
import PriceList from "../../components/Zahlungen/PriceList.jsx";
import "../../styles/Prices.css";

function Prices() {
    return (
        <div className="page">
            {/* Gleicher .container wie in PriceList, damit Ueberschrift und
                Karten auf derselben Achse ausgerichtet sind. */}
            <header className="container px-3 prices-header text-center">
                <span className="prices-eyebrow">Preise</span>
                <h1 className="prices-title">Faire Preise, keine Abos</h1>
                <p className="prices-subtitle">
                    Du bezahlst nur die Stunden, die du wirklich brauchst – und je größer
                    das Paket, desto günstiger wird die einzelne Stunde.
                </p>
            </header>

            <PriceList />
        </div>
    );
}

export default Prices;
