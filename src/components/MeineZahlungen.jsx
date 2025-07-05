import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService.js";

export default function MeineZahlungen({ user }) {
    const [transaktionen, setTransaktionen] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ladeTransaktionen = async () => {
            try {
                const response = await ApiService.get(
                    `/api/public/transaktionen/person/${user.id}`
                );
                setTransaktionen(response.data);
            } catch (error) {
                console.error("Fehler beim Laden der Transaktionen:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            ladeTransaktionen();
        }
    }, [user]);

    return (
        <div>
            <h3>Meine Zahlungen</h3>

            {loading ? (
                <p>Lade Transaktionen...</p>
            ) : transaktionen.length === 0 ? (
                <p>Keine Transaktionen gefunden.</p>
            ) : (
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead>
                    <tr>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Datum</th>
                        <th style={{ border: "1px solid #ccc", padding: "8px" }}>Betrag (€)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transaktionen.map((t) => (
                        <tr key={t.id}>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                {new Date(t.transaktionDatum).toLocaleDateString()}
                            </td>
                            <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                                {t.transaktionBetrag.toFixed(2)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
