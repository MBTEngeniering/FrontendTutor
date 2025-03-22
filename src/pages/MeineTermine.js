import React, { useState } from "react";
import { jsPDF } from "jspdf";
import 'react-calendar/dist/Calendar.css';

function MeineTermine() {
    const [activeContent, setActiveContent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [markedDates, setMarkedDates] = useState([]);

    const termine = [
        { id: 1, datum: new Date(2025, 2, 24, 10, 30), fach: "Mathematik", schueler: "Max" },
        { id: 2, datum: new Date(2025, 2, 25, 14, 0), fach: "Physik", schueler: "Anna" },
        { id: 3, datum: new Date(2025, 2, 27, 16, 0), fach: "Englisch", schueler: "Lukas" },
        { id: 4, datum: new Date(2025, 2, 29, 11, 30), fach: "Geschichte", schueler: "Sophie" }
    ];

    const gehalt = [
        { id: 1, termin: "Mathe Nachhilfe", betrag: "15€" },
        { id: 2, termin: "Physik Nachhilfe", betrag: "15€" },
        { id: 3, termin: "Englisch Nachhilfe", betrag: "15€" },
        { id: 4, termin: "Geschichte Nachhilfe", betrag: "15€" }
    ];

    const handleMarkCell = (day, hour, minute) => {
        const newMarkedDate = new Date(day);
        newMarkedDate.setHours(hour, minute);
        setMarkedDates([...markedDates, newMarkedDate]);
    };
    const saveChanges = () => {
        console.log("Änderungen gespeichert:", markedDates);
        alert("Änderungen im Kalender wurden gespeichert!");
    };

    const renderWeeklyCalendar = () => {
        const startOfWeek = new Date(selectedDate);
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay()); // Montag als Start der Woche

        const weekDays = Array.from({ length: 7 }, (_, index) => {
            const day = new Date(startOfWeek);
            day.setDate(day.getDate() + index);
            return day;
        });

        return (
            <div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr>
                        <th style={{ border: "1px solid #ccc", padding: "5px" }}>Uhrzeit</th>
                        {weekDays.map((day, index) => (
                            <th key={index} style={{ border: "1px solid #ccc", padding: "5px" }}>
                                {day.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({ length: 48 }, (_, index) => {
                        const hour = Math.floor(index / 2);
                        const minute = index % 2 === 0 ? 0 : 30;
                        return (
                            <tr key={index}>
                                <td style={{ border: "1px solid #ccc", padding: "5px" }}>{`${hour}:${minute === 0 ? "00" : minute}`}</td>
                                {weekDays.map((day, index) => {
                                    const termin = termine.find((t) =>
                                        t.datum.getDay() === day.getDay() &&
                                        t.datum.getHours() === hour &&
                                        t.datum.getMinutes() === minute
                                    );
                                    const isMarked = markedDates.some((md) =>
                                        md.getDay() === day.getDay() &&
                                        md.getHours() === hour &&
                                        md.getMinutes() === minute
                                    );
                                    return (
                                        <td
                                            key={index}
                                            style={{
                                                border: "1px solid #ccc",
                                                padding: "5px",
                                                textAlign: "center",
                                                backgroundColor: isMarked ? "lightgreen" : "white",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => handleMarkCell(day, hour, minute)}
                                        >
                                            {termin ? `${termin.schueler} (${termin.fach})` : ""}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                <button
                    style={{
                        marginTop: "10px",
                        padding: "10px 20px",
                        backgroundColor: "blue",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                    onClick={saveChanges}
                >
                    Änderungen speichern
                </button>
            </div>
        );
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Vertrag: Zusammenarbeit für Online-Nachhilfe", 10, 10);
        doc.text("Dieser Vertrag regelt die Zusammenarbeit zwischen dem Anbieter und den Schülern.", 10, 20);
        doc.text("AGB:", 10, 30);
        doc.text("- Pünktlichkeit und Einhaltung der Termine.", 10, 40);
        doc.text("- 24 Stunden vorher absagen, um Gebühren zu vermeiden.", 10, 50);
        doc.text("- Technische Voraussetzungen beim Schüler.", 10, 60);
        doc.save("Vertrag.pdf");
    };

    const renderContent = () => {
        switch (activeContent) {
            case "Kalender":
                return (
                    <div>
                        <h3>Wochenkalender</h3>
                        {renderWeeklyCalendar()}
                    </div>
                );
            case "Vertrag":
                return (
                    <div>
                        <h3>Vertrag</h3>
                        <p>
                            Dieser Vertrag regelt die Zusammenarbeit zwischen dem Anbieter und den Schülern.
                            Es gelten folgende AGB:
                        </p>
                        <ul>
                            <li>Pünktlichkeit und Einhaltung der vereinbarten Termine.</li>
                            <li>Absage von Terminen mindestens 24 Stunden im Voraus.</li>
                            <li>Technische Voraussetzungen liegen in der Verantwortung des Schülers.</li>
                        </ul>
                        <button onClick={downloadPDF}>Vertrag als PDF herunterladen</button>
                    </div>
                );
            case "Meine Termine":
                return (
                    <div>
                        <h3>Liste der Termine</h3>
                        {termine.map((termin) => (
                            <div
                                key={termin.id}
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "5px",
                                    padding: "10px",
                                    margin: "10px 0",
                                    backgroundColor: "#f9f9f9",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                                }}
                            >
                                <p><strong>Datum:</strong> {termin.datum.toLocaleDateString('de-DE')}</p>
                                <p><strong>Uhrzeit:</strong> {termin.datum.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <p><strong>Fach:</strong> {termin.fach}</p>
                                <p><strong>Schüler:</strong> {termin.schueler}</p>
                            </div>
                        ))}
                    </div>
                );
            case "Meine Schüler":
                return (
                    <div>
                        <h3>Schülerliste</h3>
                        <ul>
                            {termine.map((termin) => (
                                <li key={termin.id}>{termin.schueler}</li>
                            ))}
                        </ul>
                    </div>
                );
            case "Mein Gehalt":
                return (
                    <ul>
                        {gehalt.map((eintrag) => (
                            <li key={eintrag.id}>
                                {eintrag.termin}: {eintrag.betrag}
                            </li>
                        ))}
                    </ul>
                );
            case "Support":
                return <p>Support-Bereich. Hier kannst du Hilfe anbieten oder anfordern.</p>;
            default:
                return <p>Bitte wähle eine Option aus der linken Spalte aus.</p>;
        }
    };

    return (
        <div className="page" style={{ display: "flex" }}>
            {/* Linke Spalte mit allen Buttons */}
            <div style={{ flex: 1, padding: "10px", borderRight: "1px solid gray", display: "flex", flexDirection: "column" }}>
                <button onClick={() => setActiveContent("Kalender")}>Kalender</button>
                <button onClick={() => setActiveContent("Vertrag")}>Vertrag</button>
                <button onClick={() => setActiveContent("Meine Termine")}>Meine Termine</button>
                <button onClick={() => setActiveContent("Meine Schüler")}>Meine Schüler</button>
                <button onClick={() => setActiveContent("Mein Gehalt")}>Mein Gehalt</button>
                <button onClick={() => setActiveContent("Support")}>Support</button>
            </div>

            {/* Rechte Spalte */}
            <div style={{ flex: 2, padding: "10px" }}>
                {renderContent()}
            </div>
        </div>
    );
}

export default MeineTermine;
