import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService.js";

const MeineTermine = ({ student, lang = "de" }) => {
    const [termine, setTermine] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState({});
    const [tutorenMap, setTutorenMap] = useState({});
    const [jetzt, setJetzt] = useState(new Date());
    const [feedbackTermin, setFeedbackTermin] = useState(null);
    const [feedbackOption, setFeedbackOption] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setJetzt(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchDaten = async () => {
            try {
                const [termineResponse, faecherResponse] = await Promise.all([
                    ApiService.get(`/api/public/appointments/student/${student.id}`),
                    ApiService.get(`/api/fach/trans/${lang}`)
                ]);

                const termine = termineResponse.data;
                setTermine(termine);

                // Fächer zuordnen
                const fachMap = {};
                faecherResponse.data.forEach((fach) => {
                    fachMap[fach.id] = fach.translation || fach.bezeichnung || "Unbekannt";
                });
                setSubjects(fachMap);

                // Tutor-Daten abfragen
                const tutorIds = [...new Set(termine.map(t => t.tutorId))];
                const tutorMap = {};
                await Promise.all(
                    tutorIds.map(async (id) => {
                        try {
                            const res = await ApiService.get(`/api/allusers/${id}`);
                            tutorMap[id] = res.data;
                        } catch (e) {
                            console.warn("Fehler beim Laden des Tutors mit ID:", id);
                        }
                    })
                );
                setTutorenMap(tutorMap);

            } catch (error) {
                console.error("Fehler beim Laden der Termine oder Fächer:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDaten();
    }, [student, lang]);

    const einheitStarten = async (tutorId, studentIsPresent, terminId) => {
        try {
            const response = await ApiService.get(`/api/allusers/${tutorId}`);
            const tutor = response.data;
            const zoomLink = tutor.zoomLink;

            if (zoomLink) {
                window.open(zoomLink, "_blank");
                await ApiService.patch(`/api/public/appointments/${terminId}/student-present?isPresent=true`);
            } else {
                alert("Kein Zoom-Link für diesen Studenten gefunden.");
            }
        } catch (error) {
            console.error("Fehler beim Starten der Einheit:", error);
            alert("Fehler beim Starten der Einheit.");
        }
    };

    const handleFeedbackSenden = async () => {
        if (!feedbackOption || !feedbackTermin) return;

        try {
            await ApiService.patch(
                `/api/public/appointments/${feedbackTermin.id}/student-feedback?studentFeedback=${encodeURIComponent(feedbackOption)}`
            );

            setTermine((prev) =>
                prev.map((t) =>
                    t.id === feedbackTermin.id
                        ? { ...t, studentFeedback: feedbackOption }
                        : t
                )
            );
            alert("Feedback erfolgreich gesendet.");
            setFeedbackOption("");
            setFeedbackTermin(null);
        } catch (error) {
            console.error("Fehler beim Senden des Feedbacks:", error);
            alert("Feedback konnte nicht gesendet werden.");
        }
    };

    if (loading) return <div>Lade Termine...</div>;

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Meine gebuchten Termine</h3>
            {termine.map((termin) => {
                const startDate = new Date(termin.startDate);
                const endDate = new Date(termin.endDate);
                const istAktiv = jetzt >= startDate && jetzt <= endDate;
                const istVorbei = jetzt > endDate;
                const feedbackOffen = !termin.studentFeedback;

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

                const tutor = tutorenMap[termin.tutorId];

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
                                    {subjects[termin.fachId] || "Fach unbekannt"}
                                </span>
                                <div className="mt-2 font-bold">{uhrzeit}</div>
                                <div className="font-semibold">{datum}</div>
                                <div className="mt-1">
                                    {tutor ? `${tutor.firstName} ${tutor.lastName}` : "Tutor wird geladen..."}
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
                                    cursor: istAktiv ? "pointer" : "not-allowed",
                                    opacity: istAktiv ? 1 : 0.5,
                                }}
                                onClick={() =>
                                    einheitStarten(termin.tutorId, termin.studentIsPresent, termin.id)
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

                            {istVorbei && feedbackOffen && (
                                <button
                                    style={{
                                        backgroundColor: "#f0ad4e",
                                        color: "white",
                                        padding: "8px 16px",
                                        borderRadius: "6px",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        setFeedbackTermin(termin);
                                        setFeedbackOption("");
                                    }}
                                >
                                    Feedback
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Feedback Modal */}
            {feedbackTermin && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[300px]">
                        <h2 className="text-lg font-bold mb-4">Feedback geben</h2>
                        <div className="flex flex-col gap-2 mb-4">
                            <label>
                                <input
                                    type="radio"
                                    value="BOTH_PRESENT"
                                    checked={feedbackOption === "BOTH_PRESENT"}
                                    onChange={(e) => setFeedbackOption(e.target.value)}
                                />
                                <span className="ml-2">Beide waren da</span>
                            </label><br />
                            <label>
                                <input
                                    type="radio"
                                    value="TUTOR_ABSENT"
                                    checked={feedbackOption === "TUTOR_ABSENT"}
                                    onChange={(e) => setFeedbackOption(e.target.value)}
                                />
                                <span className="ml-2">Tutor ist nicht erschienen</span>
                            </label>
                        </div>
                        <div className="flex justify-between">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setFeedbackTermin(null)}
                            >
                                Abbrechen
                            </button>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={handleFeedbackSenden}
                                disabled={!feedbackOption}
                            >
                                Feedback senden
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MeineTermine;
