import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import "../../styles/UserPage.css";
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { DayPilot } from "@daypilot/daypilot-lite-react";
import axios from "axios";

function TutorSeite() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [activeContent, setActiveContent] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        const fetchAvailability = async () => {
            const userId = localStorage.getItem("userId");
            const userRole = localStorage.getItem("userRole");

            let response;
            if (userRole === "STUDENT") {
                response = await axios.get(`${apiUrl}/api/students/${userId}`);
            } else {
                response = await axios.get(`${apiUrl}/api/tutors/${userId}`);
            }

            const availabilityTime = response.data.availabilityTime;
        };

        fetchAvailability();
    }, [apiUrl]);

    const TutorCalendar = () => {
        const calendarRef = useRef();
        const [startDate, setStartDate] = useState(DayPilot.Date.today());
        const [selectedEvents, setSelectedEvents] = useState([]);
        const [availabilityTime, setAvailabilityTime] = useState([]);

        useEffect(() => {
            const calendar = calendarRef.current.control;
            calendar.update({
                cellDuration: 30,
                events: selectedEvents,
                startDate,
            });
        }, [startDate, selectedEvents]);

        const handlePreviousWeek = () => {
            setStartDate(startDate.addDays(-7));
        };

        const handleNextWeek = () => {
            setStartDate(startDate.addDays(7));
        };

        const handleTimeRangeSelected = (args) => {
            // Add each 30-minute slot between start and end time
            const addSlots = (start, end) => {
                const slots = [];
                let currentTime = start;

                while (currentTime < end) {
                    slots.push({
                       id: DayPilot.guid(),
                        start: currentTime,
                        end: currentTime.addMinutes(30), // Assuming 30-minute slots
                        backColor: "#d0eaff", // Only set color, no text
                    });
                    currentTime = currentTime.addMinutes(30); // Increment by 30 minutes
                }
                return slots;
            };

            const newEvents = addSlots(args.start, args.end);
            setSelectedEvents((prev) => [...prev, ...newEvents]);

            // Add the individual times to availabilityTime
            const newTimes = [];
            let currentTime = args.start;
            while (currentTime < args.end) {
                newTimes.push(new Date(currentTime));
                currentTime = currentTime.addMinutes(30);
            }

            setAvailabilityTime((prev) => [...prev, ...newTimes]);
        };

        const handleSave = () => {
            if (availabilityTime.length > 0) {
                const slots = availabilityTime.join(", "); // Kombiniert alle Slots in einem String
                alert(`Anzahl ausgewählter Slots: ${availabilityTime.length}\nAusgewählte Slots: ${slots}`);
                // Hier könnten die Daten an das Backend gesendet werden
            } else {
                alert("Bitte wählen Sie mindestens einen Termin aus.");
            }
        };

        return (
            <div>
                <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
                    <button onClick={handlePreviousWeek}>← Vorherige Woche</button>
                    <button onClick={handleNextWeek}>Nächste Woche →</button>
                    <button
                        onClick={handleSave}
                        style={{
                            marginLeft: "auto",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            padding: "5px 10px",
                            borderRadius: "5px",
                        }}
                    >
                        Speichern
                    </button>
                </div>
                <div style={{ height: "500px" }}>
                    <DayPilotCalendar
                        ref={calendarRef}
                        startDate={startDate}
                        viewType="Week"
                        durationBarVisible={false}
                        timeRangeSelectedHandling="JavaScript"
                        onTimeRangeSelected={handleTimeRangeSelected}
                        eventDeleteHandling="Disabled"
                        eventMoveHandling="Disabled"
                        eventResizeHandling="Disabled"
                    />
                </div>
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
                    <div style={{ height: "80vh" }}>
                        <h3>kalender</h3>
                        <TutorCalendar />
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
                        {/* Hier könntest du die gespeicherten Termine anzeigen */}
                    </div>
                );
            case "Meine Schüler":
                return (
                    <div>
                        <h3>Schülerliste</h3>
                    </div>
                );
            case "Mein Gehalt":
                return (
                    <div>
                        <h3>gesamt Verdienst</h3>
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
