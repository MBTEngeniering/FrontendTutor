import React from "react";
import { Link, useParams } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { lessonPackages } from "../../shared/lessonPackages.js";
import "./Checkout.css";

const euroFormatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

function PackageFacts({ paket }) {
    const hoursText = paket.hours === 1 ? "Stunde" : "Stunden";
    const pricePerHour = paket.price / paket.hours;

    return (
        <div className="checkout-facts">
            <div className="checkout-fact">
                <i className="bi bi-clock" aria-hidden="true" />
                <span>{paket.hours} {hoursText}</span>
            </div>

            <div className="checkout-fact">
                <i className="bi bi-calendar3" aria-hidden="true" />
                <span>Gültig für {paket.validityLabel}</span>
            </div>

            <div className="checkout-fact">
                <i className="bi bi-currency-euro" aria-hidden="true" />
                <span>{euroFormatter.format(pricePerHour)} pro Stunde</span>
            </div>
        </div>
    );
}

function SelectedPackage({ paket }) {
    return (
        <article className="checkout-package-card">
            <span className="checkout-selected-label">Ausgewählt</span>

            <p className="checkout-eyebrow">Dein Paket</p>
            <h2>{paket.name}</h2>
            <p className="checkout-package-price">
                {euroFormatter.format(paket.price)}
            </p>

            <PackageFacts paket={paket} />

            <Link to="/preise" className="checkout-change-link">
                Anderes Paket wählen
            </Link>
        </article>
    );
}

function OrderSummary({ paket }) {
    async function handleCheckout(packageId) {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        const response = await fetch(`/api/checkout/${packageId}`, {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
            alert("Fehler beim Starten der Zahlung. Bitte erneut versuchen.");
            return;
        }

        const url = await response.text();
        window.location.href = url;
    }

    return (
        <section className="checkout-summary" aria-labelledby="summary-title">
            <div className="checkout-summary-heading">
                <div>
                    <p className="checkout-eyebrow">Bestellübersicht</p>
                    <h2 id="summary-title">Zusammenfassung</h2>
                </div>

                <i className="bi bi-receipt" aria-hidden="true" />
            </div>

            <dl className="checkout-summary-list">
                <div>
                    <dt>Paket</dt>
                    <dd>{paket.name}</dd>
                </div>

                <div>
                    <dt>Unterricht</dt>
                    <dd>{paket.hours} {paket.hours === 1 ? "Stunde" : "Stunden"}</dd>
                </div>

                <div>
                    <dt>Gültigkeit</dt>
                    <dd>{paket.validityLabel}</dd>
                </div>

                <div className="checkout-total-row">
                    <dt>Gesamtbetrag</dt>
                    <dd>{euroFormatter.format(paket.price)}</dd>
                </div>
            </dl>

            <div className="checkout-payment-box">
                <div className="checkout-security-note">
                    <i className="bi bi-lock" aria-hidden="true" />
                    <span>Sichere Zahlung über Stripe</span>
                </div>

                <button
                    type="button"
                    className="checkout-pay-button"
                    onClick={() => handleCheckout(paket.id)}
                >
                    Mit Stripe bezahlen
                </button>
            </div>
        </section>
    );
}

function Checkout() {
    const { packageId } = useParams();
    const selectedPackage = lessonPackages.find(
        (paket) => paket.id === Number(packageId),
    );

    if (!selectedPackage) {
        return (
            <main className="checkout-page">
                <div className="container checkout-not-found text-center">
                    <i className="bi bi-exclamation-circle" aria-hidden="true" />
                    <h1>Paket nicht gefunden</h1>
                    <p>
                        Das ausgewählte Stundenpaket existiert nicht oder ist nicht mehr verfügbar.
                    </p>
                    <Link to="/preise" className="btn btn-outline-secondary">
                        Zurück zur Preisliste
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="checkout-page">
            <div className="container checkout-container">
                <Link to="/preise" className="checkout-back-link">
                    <i className="bi bi-arrow-left" aria-hidden="true" />
                    Zurück zur Preisliste
                </Link>

                <header className="checkout-header">
                    <p className="checkout-eyebrow">Fast geschafft</p>
                    <h1>Dein Stundenpaket</h1>
                    <p>
                        Prüfe deine Auswahl, bevor du sicher zur Zahlung weitergehst.
                    </p>
                </header>

                <div className="row g-4 align-items-stretch">
                    <div className="col-12 col-lg-5">
                        <SelectedPackage paket={selectedPackage} />
                    </div>

                    <div className="col-12 col-lg-7">
                        <OrderSummary paket={selectedPackage} />
                    </div>
                </div>

                <div className="checkout-trust-strip">
                    <i className="bi bi-shield-check" aria-hidden="true" />
                    <span>
                        Deine Stunden werden nach erfolgreichem Zahlungseingang freigeschaltet.
                    </span>
                </div>
            </div>
        </main>
    );
}

export default Checkout;
