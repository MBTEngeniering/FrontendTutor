import React, { useState } from "react";
import { jsPDF } from "jspdf";
import Calendar from "../../components/Calendar";
import "../../styles/UserPage.css";

function SchuelerSeite() {
    const [activeContent, setActiveContent] = useState("Kalender");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [markedDates, setMarkedDates] = useState([]);

    // Student-specific data
    const termine = [
        { id: 1, datum: new Date(2025, 2, 24, 10, 30), fach: "Mathematik", tutor: "Herr Müller" },
        { id: 2, datum: new Date(2025, 2, 25, 14, 0), fach: "Physik", tutor: "Frau Schmidt" },
        { id: 3, datum: new Date(2025, 2, 27, 16, 0), fach: "Englisch", tutor: "Herr Wagner" }
    ];

    const stunden = [
        { id: 1, fach: "Mathematik", verbleibend: 5 },
        { id: 2, fach: "Physik", verbleibend: 3 },
        { id: 3, fach: "Englisch", verbleibend: 2 }
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
        return (
            <div>
                <h3>Mein Stundenplan</h3>
                <Calendar 
                    events={termine.map(t => ({
                        ...t,
                        person: t.tutor
                    }))}
                    onDateClick={(date) => {
                        const newMarkedDate = new Date(date);
                        setMarkedDates([...markedDates, newMarkedDate]);
                    }}
                    onEventClick={(event) => {
                        console.log('Event clicked:', event);
                    }}
                />
                <button className="action-button" onClick={saveChanges}>
                    Terminwünsche speichern
                </button>
            </div>
        );
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Vertrag: Nachhilfevereinbarung", 10, 10);
        doc.text("Dieser Vertrag regelt die Zusammenarbeit zwischen Ihnen und Ihrem Nachhilfelehrer.", 10, 20);
        doc.text("AGB:", 10, 30);
        doc.text("- Pünktlichkeit und Einhaltung der Termine.", 10, 40);
        doc.text("- 24 Stunden vorher absagen, um Gebühren zu vermeiden.", 10, 50);
        doc.text("- Technische Voraussetzungen müssen erfüllt sein.", 10, 60);
        doc.save("Nachhilfevertrag.pdf");
    };

    const renderContent = () => {
        switch (activeContent) {
            case "Postfach":
                return (
                    <div>
                        <h3>Mein Postfach</h3>
                        <p>Hier finden Sie alle Nachrichten und Benachrichtigungen.</p>
                    </div>
                );
            case "Studienübersicht":
                return (
                    <div>
                        <h3>Meine Studienübersicht</h3>
                        <p>Hier sehen Sie Ihren Lernfortschritt in allen Fächern.</p>
                    </div>
                );
            case "Kalender":
                return renderWeeklyCalendar();
            case "Vertrag":
                return (
                    <div>
                        <h3>Mein Vertrag</h3>
                        <p>
                            Dieser Vertrag regelt die Zusammenarbeit zwischen Ihnen und Ihrem Nachhilfelehrer.
                        </p>
                        <ul>
                            <li>Pünktlichkeit und Einhaltung der Termine</li>
                            <li>Absage von Terminen mindestens 24 Stunden im Voraus</li>
                            <li>Technische Voraussetzungen müssen erfüllt sein</li>
                        </ul>
                        <button className="action-button" onClick={downloadPDF}>
                            Vertrag herunterladen
                        </button>
                    </div>
                );
            case "Meine Termine":
                return (
                    <div>
                        <h3>Meine gebuchten Termine</h3>
                        {termine.map((termin) => (
                            <div key={termin.id} className="appointment-card">
                                <p><strong>Datum:</strong> {termin.datum.toLocaleDateString('de-DE')}</p>
                                <p><strong>Uhrzeit:</strong> {termin.datum.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</p>
                                <p><strong>Fach:</strong> {termin.fach}</p>
                                <p><strong>Lehrer:</strong> {termin.tutor}</p>
                                <button
                                    className="action-button"
                                    onClick={() => window.open("https://rwth.zoom-x.de/j/2697981011", "_blank")}
                                >
                                    Unterricht starten
                                </button>
                            </div>
                        ))}
                    </div>
                );
            case "Meine Lehrer":
                return (
                    <div>
                        <h3>Meine Lehrer</h3>
                        <ul>
                            {termine.map((termin) => (
                                <li key={termin.id}>
                                    <strong>{termin.tutor}</strong> ({termin.fach})
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case "Meine Stunden":
                return (
                    <div>
                        <h3>Verbleibende Stunden</h3>
                        {stunden.map((stunde) => (
                            <div key={stunde.id} className="appointment-card">
                                <p><strong>{stunde.fach}:</strong> {stunde.verbleibend} Stunden verbleibend</p>
                            </div>
                        ))}
                    </div>
                );
            case "Support":
                return (
                    <div>
                        <h3>Support</h3>
                        <p>Bei Fragen oder Problemen kontaktieren Sie uns bitte:</p>
                        <p>Email: support@fgqtutor.de</p>
                        <p>Telefon: 0123-456789</p>
                    </div>
                );
            case "Meine Zahlung":
                return (
                    <div>
                        <h3>Meine Zahlungen</h3>
                        <p>Hier können Sie Ihre Zahlungshistorie einsehen.</p>
                    </div>
                );
            case "Mein Profil":
                return (
                    <div>
                        <h3>Mein Profil</h3>
                        <p>Hier können Sie Ihre persönlichen Daten verwalten.</p>
                    </div>
                );
            case "Lehrer suchen":
                return (
                    <div>
                        <h3>Lehrer suchen</h3>
                        <p>Hier können Sie nach neuen Lehrern für weitere Fächer suchen.</p>
                    </div>
                );
            default:
                return <p>Bitte wählen Sie eine Option aus der linken Spalte aus.</p>;
        }
    };

    return (
        <>
            <div className="user-container">
                <div className="user-sidebar">
                    <button 
                        className={activeContent === "Postfach" ? "active" : ""}
                        onClick={() => setActiveContent("Postfach")}
                    >
                        📬 Postfach
                    </button>
                    <button 
                        className={activeContent === "Studienübersicht" ? "active" : ""}
                        onClick={() => setActiveContent("Studienübersicht")}
                    >
                        📊 Studienübersicht
                    </button>
                    <button 
                        className={activeContent === "Kalender" ? "active" : ""}
                        onClick={() => setActiveContent("Kalender")}
                    >
                        📅 Kalender
                    </button>
                    <button 
                        className={activeContent === "Meine Termine" ? "active" : ""}
                        onClick={() => setActiveContent("Meine Termine")}
                    >
                        ⏰ Meine Termine
                    </button>
                    <button 
                        className={activeContent === "Meine Lehrer" ? "active" : ""}
                        onClick={() => setActiveContent("Meine Lehrer")}
                    >
                        👨‍🏫 Meine Lehrer
                    </button>
                    <button 
                        className={activeContent === "Meine Stunden" ? "active" : ""}
                        onClick={() => setActiveContent("Meine Stunden")}
                    >
                        ⏳ Meine Stunden
                    </button>
                    <button 
                        className={activeContent === "Support" ? "active" : ""}
                        onClick={() => setActiveContent("Support")}
                    >
                        🛟 Support
                    </button>
                    <button 
                        className={activeContent === "Vertrag" ? "active" : ""}
                        onClick={() => setActiveContent("Vertrag")}
                    >
                        📝 Vertrag
                    </button>
                    <button 
                        className={activeContent === "Meine Zahlung" ? "active" : ""}
                        onClick={() => setActiveContent("Meine Zahlung")}
                    >
                        💰 Meine Zahlung
                    </button>
                    <button 
                        className={activeContent === "Mein Profil" ? "active" : ""}
                        onClick={() => setActiveContent("Mein Profil")}
                    >
                        👤 Mein Profil
                    </button>
                    <button 
                        className={activeContent === "Lehrer suchen" ? "active" : ""}
                        onClick={() => setActiveContent("Lehrer suchen")}
                    >
                        🔍 Lehrer suchen
                    </button>
                </div>

                <div className="user-content">
                    {renderContent()}
                </div>
            </div>
        </>
    );
}

export default SchuelerSeite;