import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService.js";

const MeineTermine = ({ student, lang = "de" }) => {
    const [termine, setTermine] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fächer, setFächer] = useState({});
    const [jetzt, setJetzt] = useState(new Date());
    const [tutoren, setTutoren] = useState({}); // 🟢 Hier speichern wir die Tutor-Namen

    useEffect(() => {
        const interval = setInterval(() => {
            setJetzt(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchTermineUndFaecher = async () => {
            try {
                const termineResponse = await ApiService.get(
                    `/api/public/appointments/student/${student.id}`
                );
                const termineData = termineResponse.data;
                setTermine(termineData);

                const faecherResponse = await ApiService.get(
                    `/api/fach/trans/${lang}`
                );
                const alleFaecher = faecherResponse.data;

                const fachMap = {};
                alleFaecher.forEach((fach) => {
                    fachMap[fach.id] =
                        fach.fach || fach.bezeichnung || "Unbekannt";
                });
                setFächer(fachMap);
            } catch (error) {
                console.error(
                    "Fehler beim Laden der Termine oder Fächer:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTermineUndFaecher();
    }, [student, lang]);

    // 🟢 Für alle Termine die Tutor-Namen laden
    useEffect(() => {
        const ladeTutoren = async () => {
            const neueTutoren = {};
            for (const termin of termine) {
                const tutorId = termin.tutorId;
                if (tutorId && !tutoren[tutorId]) {
                    try {
                        const res = await ApiService.get(`/api/allusers/${tutorId}`);
                        const tutor = res.data;
                        neueTutoren[tutorId] = `${tutor.firstName} ${tutor.lastName}`;
                    } catch (error) {
                        console.error("Fehler beim Laden des Tutors:", error);
                    }
                }
            }
            if (Object.keys(neueTutoren).length > 0) {
                setTutoren((prev) => ({ ...prev, ...neueTutoren }));
            }
        };
        if (termine.length > 0) ladeTutoren();
    }, [termine, tutoren]);

    const einheitStarten = async (tutorId, studentIspresent, terminId) => {
        try {
            const response = await ApiService.get(`/api/allusers/${tutorId}`);
            const tutor = response.data;
            const zoomLink = tutor.zoomLink;

            if (zoomLink) {
                window.open(zoomLink, "_blank");
                console.log("Zoom-Link gestartet:", zoomLink);
                await ApiService.patch(
                    `/api/public/appointments/${terminId}/student-present?isPresent=true`
                );
            } else {
                alert("Kein Zoom-Link für diesen Tutor gefunden.");
            }
        } catch (error) {
            console.error(
                "Fehler beim Laden des Tutors oder Starten der Einheit:",
                error
            );
            alert("Fehler beim Starten der Einheit.");
        }
    };

    if (loading) return <div>Lade Termine...</div>;

    const nochNichtVorbei = termine.filter(
        (t) => new Date(t.endDate) > jetzt
    );

    if (nochNichtVorbei.length === 0)
        return <div>Keine Termine gefunden.</div>;

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Meine gebuchten Termine</h3>
            {nochNichtVorbei.map((termin) => {
                const startDate = new Date(termin.startDate);
                const endDate = new Date(termin.endDate);
                const istAktiv = jetzt >= startDate && jetzt <= endDate;

                const uhrzeit = startDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                });
                const datum = startDate.toLocaleDateString("de-DE", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                });

                const tutorName = tutoren[termin.tutorId] || "Lade Tutor...";

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
                                <div className="mt-1">{tutorName}</div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                style={{
                                    backgroundColor: istAktiv ? "blue" : "blue",
                                    color: "white",
                                    padding: "8px 16px",
                                    borderRadius: "6px",
                                    border: "none",
                                    cursor: istAktiv ? "pointer" : "not-allowed",
                                    marginBottom: "8px",
                                    opacity: istAktiv ? 1 : 0.5,
                                }}
                                onClick={() =>
                                    einheitStarten(
                                        termin.tutorId,
                                        termin.studentIsPresent,
                                        termin.id
                                    )
                                }
                                disabled={!istAktiv}
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
                                onClick={() =>
                                    console.log("Offener Arbeitsbereich", termin.id)
                                }
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
