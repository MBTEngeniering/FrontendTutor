import React, { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import ApiService from "../api/ApiService.js";
const clientId = import.meta.env.VITE_PP_CLIENT_ID;

const MeineStunden = ({ user }) => {
    const [stunden, setStunden] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [amount, setAmount] = useState(100.00); // default amount
    const [selectedPaket, setSelectedPaket] = useState(null);
    const [currency, setCurrency] = useState("EUR");
    const RANDOM_LENGTH = 10;

    const initialOptions = {
        clientId: clientId,
        currency: "EUR",
        intent: "capture",
    }

    const styles = {
        shape: "rect",
        layout: "vertical",
        color: "gold",
        label: "pay"
    }

    const getRandomInvoice = () => {
        return user.id + "-" + Math.random().toString(36).substring(2, RANDOM_LENGTH)
    }

    const onError = (err) => {
        // For example, redirect to a specific error page
        window.location.assign("/schueler");
    }

    // Das muss in die Datenbank!
    const paketAngebote = [
        { id: 1, name: "Einzelstunde", preis: 30, dauer: "1 Monat" },
        { id: 2, name: "4er-Paket", preis: 116, dauer: "2 Monate" },
        { id: 3, name: "8er-Paket", preis: 224, dauer: "3 Monate" },
        { id: 4, name: "12er-Paket", preis: 324, dauer: "4 Monate" },
        { id: 5, name: "20er-Paket", preis: 500, dauer: "5 Monate" },
        { id: 6, name: "25er-Paket", preis: 600, dauer: "6 Monate" },
        { id: 7, name: "50er-Paket", preis: 1100, dauer: "12 Monate" },
    ];

    const getStundenByUserId = async (userId) => {
        try {
            const response = await ApiService.get(`/api/public/meineStunde/user/${userId}`);
            if (response.data && response.data.length > 0) {
                return response.data[0];
            } else {
                return null;
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    useEffect(() => {
        if (!user || !user.id) {
            setStunden(null);
            setLoading(false);
            return;
        }

        getStundenByUserId(user.id)
            .then((data) => {
                setStunden(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [user]);


    const berechneAblaufdatum = (monatString) => {
        const monate = parseInt(monatString);
        if (isNaN(monate)) return null;

        const heute = new Date();
        const ablaufDatum = new Date(heute);
        ablaufDatum.setMonth(ablaufDatum.getMonth() + monate);

        return ablaufDatum; // <--- nicht toLocaleDateString!
    };


    const handlePaketKaufen = async () => {
        try {
            const paket = paketAngebote.find((p) => p.id === selectedPaket);
            if (!paket) return;

            const heute = new Date().toISOString();
            const ablaufDatum = berechneAblaufdatum(paket.dauer);

            const neueTransaktion = {
                transaktionDatum: heute,
                transaktionBetrag: paket.preis,
                personId: user.id,
                transaktionBestaetigt: false,
            };

            const transaktionResponse = await ApiService.post('/api/public/transaktionen', neueTransaktion);
            const gespeicherteTransaktion = transaktionResponse.data;

            let stundenAnzahl = 1;
            const match = paket.name.match(/^(\d+)/);
            if (match) {
                stundenAnzahl = parseInt(match[1], 10);
            }

            const meineStundeData = {
                id: null,
                anzahlStunde: stundenAnzahl,
                datumBuchen: heute.split('T')[0],
                datumAblauf: ablaufDatum.toISOString().split('T')[0], // ✅ echtes Date!
                gueltigkeit: true,
                userId: user.id,
                transaktionIds: [gespeicherteTransaktion.id],
            };

            const bestehendeStundenResponse = await ApiService.get(`/api/public/meineStunde/user/${user.id}`);
            const bestehendeStunden = bestehendeStundenResponse.data;

            if (!bestehendeStunden || bestehendeStunden.length === 0) {
                await ApiService.post('/api/public/meineStunde', meineStundeData);
            } else {
                const heuteDatum = new Date().toISOString().split('T')[0];
                const vorhandeneStunde = bestehendeStunden[0];

                const updatedStunde = {
                    ...vorhandeneStunde,
                    anzahlStunde: (vorhandeneStunde.anzahlStunde || 0) + stundenAnzahl,
                    datumBuchen: heuteDatum,
                    datumAblauf: ablaufDatum.toISOString().split('T')[0], // ✅
                    gueltigkeit: true,
                };
                await ApiService.put(`/api/public/meineStunde/${vorhandeneStunde.id}`, updatedStunde);
            }

            alert(
                `Paket: ${paket.name}\n` +
                `Preis: ${paket.preis} €\n` +
                `Gebucht am: ${heute.split('T')[0]}\n` +
                `Gültig bis: ${ablaufDatum.toLocaleDateString('de-DE')}`
            );

            const neueStunden = await getStundenByUserId(user.id);
            setStunden(neueStunden);
            setSelectedPaket(null);

        } catch (error) {
            console.error(error);
            alert('Fehler beim Kauf des Pakets');
        }
    };

    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    invoice_id: getRandomInvoice(),
                    amount: {
                        value: amount,
                        currency_code: "EUR",  // Must match script currency
                        breakdown: {
                            item_total: {
                                value: amount,
                                currency_code: currency
                            }
                        }
                    },
                    items: [
                        {
                            name: paketAngebote.find((p) => p.id === selectedPaket).name + " Stundenpaket",
                            description: "Super faires Nachhilfe für " + amount + " &euro;",
                            unit_amount: {
                                currency_code: "EUR",
                                value: amount
                            },
                            quantity: "1",
                            category: "DIGITAL_GOODS",
                            sku: "sku01",
                            link: "https://colorfulstandard.com/cdn/shop/files/CS2056_Male_OversizedOrganicT-Shirt-KellyGreen_2_7cee77f8-fd2d-48f3-b477-394de8fc63cd.jpg?v=1745839298&width=600"
                        }
                    ]
                }
            ]
        });
    };

    const onApprove = (data, actions) => {
        return actions.order.capture().then(details => {
            alert(`Transaction completed by ${details.payer.name.given_name}`);
            console.log("Transaction details:", details);
            // Add your success logic here

            handlePaketKaufen();
        });
    };

    const updatePaket = (paket) => {
        setSelectedPaket(paket.id);
        setAmount(paket.preis);
    }


    if (loading) return <p>Lade Stunden...</p>;
    if (error) return <p>Fehler: {error}</p>;

    return (
        <div>
            <h3>Meine Stunden:</h3>
            {stunden === null ? (
                <p>Du hast noch keine Stunde gebucht. Buche deine erste Stunde.</p>
            ) : stunden.anzahlStunde === 0 ? (
                <p>Du hast momentan keine Stunden mehr. Bitte kaufe neue Stunden.</p>
            ) : (
                <p>
                    Du hast {stunden.anzahlStunde} gültige Stunde{stunden.anzahlStunde > 1 ? 'n' : ''}
                    bis {stunden.datumAblauf}.
                </p>
            )}

            <h4>Pakete zum Kauf</h4>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {paketAngebote.map((paket) => (
                    <li key={paket.id}>
                        <label>
                            <input
                                type="radio"
                                name="paket"
                                value={paket.id}
                                checked={selectedPaket === paket.id}
                                onChange={() => updatePaket(paket)}
                            />
                            {paket.name}: {paket.preis} €, gültig {paket.dauer}
                        </label>
                    </li>
                ))}
            </ul>

            {selectedPaket && (
                <>
                    {/*
                    <button onClick={handlePaketKaufen}>
                        Paket kaufen
                    </button>
                    */}

                    <PayPalScriptProvider options={initialOptions} onError={onError}>
                        <PayPalButtons style={styles} onCancel={() => alert('Abort!')}
                            createOrder={createOrder}
                            onApprove={onApprove}
                        />
                    </PayPalScriptProvider>
                </>
            )}
        </div>
    );
};

export default MeineStunden;
