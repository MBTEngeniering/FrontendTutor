import React from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
    lessonPackages,
    getPackageSavings,
    formatEuro,
} from "../../shared/lessonPackages.js";
import "../../styles/PriceList.css";

function RecommendedBadge({ recommended }) {
    if (!recommended) {
        return null;
    }

    return <span className="package-badge">Beliebt</span>;
}

function SavingsChip({ savings, percent }) {
    if (savings <= 0) {
        return null;
    }

    return (
        <span className="package-savings">
            <i className="bi bi-piggy-bank" aria-hidden="true" />
            {percent} % günstiger – du sparst {formatEuro(savings)}
        </span>
    );
}

function PackagePrice({ price, referencePrice, pricePerHour, align = "center" }) {
    const rowAlignment = align === "start" ? "justify-content-start" : "justify-content-center";
    const textAlignment = align === "start" ? "text-start" : "text-center";

    return (
        <div>
            <div className={`d-flex align-items-baseline gap-2 ${rowAlignment}`}>
                <span className="package-price">{formatEuro(price)}</span>
                {referencePrice > price && (
                    <span className="package-reference">{formatEuro(referencePrice)}</span>
                )}
            </div>
            <p className={`package-rate mt-2 mb-0 ${textAlignment}`}>
                {formatEuro(pricePerHour)} pro Stunde
            </p>
        </div>
    );
}

function PackageDetails({ hours, validityLabel }) {
    const hoursText = hours === 1 ? "Stunde" : "Stunden";

    return (
        <div className="package-details">
            <div className="d-flex align-items-center gap-2">
                <i className="bi bi-clock" aria-hidden="true" />
                <span>{hours} {hoursText}</span>
            </div>

            <div className="d-flex align-items-center gap-2">
                <i className="bi bi-calendar3" aria-hidden="true" />
                <span>Gültig für {validityLabel}</span>
            </div>
        </div>
    );
}

function PackageButton({ packageId, packageName, className = "" }) {
    return (
        <Link
            to={`/checkout/${packageId}`}
            className={`btn package-cta ${className}`}
            aria-label={`${packageName} buchen`}
        >
            Jetzt starten
        </Link>
    );
}

function PackageCard({ paket }) {
    const { referencePrice, savings, percent, pricePerHour } = getPackageSavings(paket);

    return (
        <div className="col-12 col-md-6 col-lg-4">
            <article
                className={`package-card h-100 d-flex flex-column p-4${
                    paket.recommended ? " package-card--recommended" : ""
                }`}
            >
                <RecommendedBadge recommended={paket.recommended} />

                <h3 className="package-name text-center mb-3">{paket.name}</h3>

                <PackagePrice
                    price={paket.price}
                    referencePrice={referencePrice}
                    pricePerHour={pricePerHour}
                />

                <div className="package-savings-slot text-center">
                    <SavingsChip savings={savings} percent={percent} />
                </div>

                <PackageDetails hours={paket.hours} validityLabel={paket.validityLabel} />

                <PackageButton
                    packageId={paket.id}
                    packageName={paket.name}
                    className="mt-4 w-100"
                />
            </article>
        </div>
    );
}

// Groesstes Paket als breite Karte: fuellt die letzte Rasterreihe des
// Dreier-Rasters und gibt dem hoechsten Rabatt den Platz, den er verdient.
function BestValueCard({ paket }) {
    const { referencePrice, savings, percent, pricePerHour } = getPackageSavings(paket);

    return (
        <article className="package-card package-card--wide p-4 p-lg-5">
            <div className="row align-items-center g-4">
                <div className="col-12 col-lg-5">
                    <h3 className="package-name mb-2">{paket.name} – bester Preis</h3>
                    <p className="package-wide-copy mb-3">
                        Für alle, die langfristig planen: der günstigste Stundenpreis,
                        den wir anbieten.
                    </p>
                    <PackageDetails hours={paket.hours} validityLabel={paket.validityLabel} />
                </div>

                <div className="col-12 col-lg-4">
                    <PackagePrice
                        price={paket.price}
                        referencePrice={referencePrice}
                        pricePerHour={pricePerHour}
                        align="start"
                    />
                    <div className="mt-3">
                        <SavingsChip savings={savings} percent={percent} />
                    </div>
                </div>

                <div className="col-12 col-lg-3">
                    <PackageButton
                        packageId={paket.id}
                        packageName={paket.name}
                        className="w-100"
                    />
                </div>
            </div>
        </article>
    );
}

function PriceList() {
    const gridPackages = lessonPackages.filter((paket) => !paket.bestValue);
    const bestValuePackage = lessonPackages.find((paket) => paket.bestValue);

    return (
        <section className="container py-4 px-3" aria-label="Stundenpakete">
            <div className="row g-4">
                {gridPackages.map((paket) => (
                    <PackageCard key={paket.id} paket={paket} />
                ))}
            </div>

            {bestValuePackage && (
                <div className="mt-4">
                    <BestValueCard paket={bestValuePackage} />
                </div>
            )}

            <div className="row justify-content-center mt-4">
                <div className="col-12 col-lg-8">
                    <div className="prices-note d-flex align-items-center justify-content-center gap-2 px-3 py-2 text-center">
                        <i className="bi bi-shield-check" aria-hidden="true" />
                        <span>
                            Alle Pakete sind flexibel einsetzbar und für alle Fächer und Themen gültig.
                        </span>
                    </div>
                    <p className="prices-vat text-center mt-2 mb-0">
                        Alle Preise inkl. gesetzlicher MwSt. Keine Vertragsbindung, keine versteckten Kosten.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default PriceList;
