import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService.js";

const MeineTermine = ({ student, lang = "de" }) => {
    const [termine, setTermine] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fächer, setFächer] = useState({}); // { fachId: fachName }

    useEffect(() => {
        const fetchTermineUndFaecher = async () => {
            try {
                // Termine laden
                const termineResponse = await ApiService.get(`/api/public/appointments/student/${student.id}`);
                const termineData = termineResponse.data;
                setTermine(termineData);

                // Alle Fächer auf einmal laden
                const faecherResponse = await ApiService.get(`/api/fach/trans/${lang}`);
                const alleFaecher = faecherResponse.data;

                // Map von fachId zu fachName erstellen
                const fachMap = {};
                alleFaecher.forEach(fach => {
                    fachMap[fach.id] = fach.fach || fach.bezeichnung || "Unbekannt";
                });
                setFächer(fachMap);

            } catch (error) {
                console.error("Fehler beim Laden der Termine oder Fächer:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTermineUndFaecher();
    }, [student, lang]);

    const einheitStarten = async (tutorId) => {
        try {
            // Tutor-Daten laden
            const response = await ApiService.get(`/api/allusers/${tutorId}`);
            const tutor = response.data;

            // Zoom-Link aus Tutor-Daten holen
            const zoomLink = tutor.zoomLink; // Beispiel: nehme an das Feld heißt so

            if (zoomLink) {
                window.open(zoomLink, "_blank"); // Link in neuem Tab öffnen
                console.log("Zoom-Link gestartet:", zoomLink);
            } else {
                alert("Kein Zoom-Link für diesen Tutor gefunden.");
            }
        } catch (error) {
            console.error("Fehler beim Laden des Tutors oder Starten der Einheit:", error);
            alert("Fehler beim Starten der Einheit.");
        }
    };

    if (loading) return <div>Lade Termine...</div>;
    if (termine.length === 0) return <div>Keine Termine gefunden.</div>;

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Meine gebuchten Termine</h3>
            {termine.map((termin) => {
                const startDate = new Date(termin.startDate);
                const uhrzeit = startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                const datum = startDate.toLocaleDateString("de-DE", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                });

                return (
                    <div
                        key={termin.id}
                        className="flex items-center justify-between border rounded-lg p-4 mb-4 shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src="/avatar.png"
                                alt="Avatar"
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
                  {fächer[termin.fachId] || "Fach unbekannt"}
                </span>
                                <div className="mt-2 font-bold">{uhrzeit}</div>
                                <div className="font-semibold">{datum}</div>
                                <div className="mt-1">
                                    {student.firstName} {student.lastName}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                style={{
                                    backgroundColor: "blue",
                                    color: "white",
                                    padding: "8px 16px",
                                    borderRadius: "6px",
                                    border: "none",
                                    cursor: "pointer",
                                    marginBottom: "8px",
                                }}
                                onClick={() => einheitStarten(termin.tutorId)}
                            >
                                Einheit starten
                            </button>
                            <button
                                style={{
                                    backgroundColor: "transparent",
                                    color: "#28a745",
                                    padding: "8px 16px",
                                    borderRadius: "6px",
                                    border: "2px solid #28a745",
                                    cursor: "pointer",
                                }}
                                onClick={() => console.log("Offener Arbeitsbereich", termin.id)}
                            >
                                Offener Arbeitsbereich
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MeineTermine;
