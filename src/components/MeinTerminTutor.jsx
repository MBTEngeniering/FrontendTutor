import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService.js";

const MeinTerminTutor = ({ tutor, lang = "de" }) => {
    const [termine, setTermine] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fächer, setFächer] = useState({});
    const [jetzt, setJetzt] = useState(new Date());
    const [feedbackTermin, setFeedbackTermin] = useState(null);
    const [feedbackOption, setFeedbackOption] = useState("");
    const [schueler, setSchueler] = useState({});

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
                    `/api/public/appointments/tutor/${tutor.id}`
                );
                setTermine(termineResponse.data);

                const faecherResponse = await ApiService.get(
                    `/api/fach/trans/${lang}`
                );
                const fachMap = {};
                faecherResponse.data.forEach((fach) => {
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
    }, [tutor, lang]);

    useEffect(() => {
        const fetchSchueler = async () => {
            const neueSchueler = {};
            for (const termin of termine) {
                const studentId = termin.studentId;
                if (studentId && !schueler[studentId]) {
                    try {
                        const res = await ApiService.get(`/api/allusers/${studentId}`);
                        const student = res.data;
                        neueSchueler[studentId] = `${student.firstName} ${student.lastName}`;
                    } catch (err) {
                        console.error("Fehler beim Laden des Schülers:", err);
                    }
                }
            }
            if (Object.keys(neueSchueler).length > 0) {
                setSchueler((prev) => ({ ...prev, ...neueSchueler }));
            }
        };

        if (termine.length > 0) fetchSchueler();
    }, [termine, schueler]);

    const einheitStarten = async (tutorId, tutorIspresent, terminId) => {
        try {
            const response = await ApiService.get(`/api/allusers/${tutorId}`);
            const tutor = response.data;
            const zoomLink = tutor.zoomLink;

            if (zoomLink) {
                window.open(zoomLink, "_blank");
                await ApiService.patch(`/api/public/appointments/${terminId}/tutor-present?isPresent=true`);
            } else {
                alert("Kein Zoom-Link für diesen Tutor gefunden.");
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
                `/api/public/appointments/${feedbackTermin.id}/tutor-feedback?tutorFeedback=${encodeURIComponent(feedbackOption)}`
            );

            setTermine((prev) =>
                prev.map((t) =>
                    t.id === feedbackTermin.id
                        ? { ...t, tutorFeedback: feedbackOption }
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
                const feedbackOffen = !termin.tutorFeedback;

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
                                    Schüler: {schueler[termin.studentId] || "Lade Schüler..."}
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
                                    einheitStarten(termin.tutorId, termin.tutorIsPresent, termin.id)
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
                                    value="STUDENT_ABSENT"
                                    checked={feedbackOption === "STUDENT_ABSENT"}
                                    onChange={(e) => setFeedbackOption(e.target.value)}
                                />
                                <span className="ml-2">Der Schüler ist nicht erschienen</span>
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

export default MeinTerminTutor;
