import React from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Checkout.css";
import "./Success.css";

function Success() {
    return (
        <main className="checkout-page">
            <div className="container success-container text-center">
                <span className="success-icon">
                    <i className="bi bi-check-lg" aria-hidden="true" />
                </span>

                <p className="checkout-eyebrow">Zahlung erfolgreich</p>
                <h1>Vielen Dank für deine Buchung</h1>
                <p className="success-lead">
                    Wir haben deine Zahlung erhalten. Deine Stunden werden in Kürze
                    freigeschaltet und du bekommst eine Bestätigung per E-Mail.
                </p>

                <div className="success-actions">
                    <Link to="/schueler" className="success-primary-link">
                        Zu meinem Bereich
                    </Link>

                    <Link to="/preise" className="success-secondary-link">
                        Weiteres Paket buchen
                    </Link>
                </div>

                <div className="checkout-trust-strip">
                    <i className="bi bi-envelope" aria-hidden="true" />
                    <span>
                        Falls du keine E-Mail erhältst, prüfe bitte deinen Spam-Ordner
                        oder melde dich bei unserem Support.
                    </span>
                </div>
            </div>
        </main>
    );
}

export default Success;
