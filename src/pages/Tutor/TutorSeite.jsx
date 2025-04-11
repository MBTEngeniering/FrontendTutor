import React, { useState } from "react";
import { jsPDF } from "jspdf";
import '../../styles/UserPage.css';

function TutorSeite() {
    const [activeContent, setActiveContent] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
         startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
 
         const weekDays = Array.from({ length: 7 }, (_, index) => {
             const day = new Date(startOfWeek);
             day.setDate(day.getDate() + index);
             return day;
         });
 
        return (
            <div>
                 <table className="calendar-table">
                     <thead>
                     <tr>
                         <th>Uhrzeit</th>
                         {weekDays.map((day, index) => (
                             <th key={index}>
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
                                 <td className="calendar-time-cell">{`${hour}:${minute === 0 ? "00" : minute}`}</td>
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
                                             className={`calendar-event-cell ${isMarked ? 'marked' : ''}`}
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
                <button className="action-button" onClick={saveChanges}>
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
                            <div key={termin.id} className="appointment-card">
                                <p><strong>Datum:</strong> {termin.datum.toLocaleDateString('de-DE')}</p>
                                <p><strong>Uhrzeit:</strong> {termin.datum.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</p>
                                <p><strong>Fach:</strong> {termin.fach}</p>
                                <p><strong>Schüler:</strong> {termin.schueler}</p>
                                <button
                                    className="action-button"
                                    onClick={() => window.open("https://rwth.zoom-x.de/j/2697981011", "_blank")}
                                >
                                    Einheit starten
                                </button>
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
                    <div>
                        {gehalt.map((eintrag) => (
                            <div key={eintrag.id} className="salary-item">
                                <strong>{eintrag.termin}:</strong> {eintrag.betrag}
                            </div>
                        ))}
                    </div>
                );
            case "Support":
                return <p>Support-Bereich. Hier kannst du Hilfe anbieten oder anfordern.</p>;
            default:
                return <p>Bitte wähle eine Option aus der linken Spalte aus.</p>;
        }
    };

    return (
        <>
            <div className="user-container">
                <button 
                    className="sidebar-toggle" 
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                >
                    ☰
                </button>
                <div className={`user-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                    <button onClick={() => setActiveContent("Kalender")}>📅 Kalender</button>
                    <button onClick={() => setActiveContent("Vertrag")}>📝 Vertrag</button>
                    <button onClick={() => setActiveContent("Meine Termine")}>⏰ Meine Termine</button>
                    <button onClick={() => setActiveContent("Meine Schüler")}>👨‍🏫 Meine Schüler</button>
                    <button onClick={() => setActiveContent("Mein Gehalt")}>⏳ Mein Gehalt</button>
                    <button onClick={() => setActiveContent("Support")}>🛟 Support</button>
                </div>

                <div className="user-content">
                    {renderContent()}
                </div>
            </div>
        </>
    );
}

export default TutorSeite;
