import React, { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import "../../styles/UserPage.css";
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { DayPilot } from "@daypilot/daypilot-lite-react";
import axios from "axios";
import { useUser } from "../../context/UserContext";

function TutorSeite() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [activeContent, setActiveContent] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { user } = useUser();
    const [startDate, setStartDate] = useState(DayPilot.Date.today());
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [availabilityTime, setAvailabilityTime] = useState([]);

    useEffect(() => {
        const fetchAvailability = async () => {
            if (!user.userId) return;

            try {
                const response = await axios.get(`${apiUrl}/api/allusers/${user.userId}`);
                const userData = response.data;
                if (userData.availabilityTime) {
                    const convertedEvents = userData.availabilityTime.map((iso) => {
                        const start = new DayPilot.Date(iso);
                        const end = start.addMinutes(30);
                        return {
                            id: `${start.toString()}-${end.toString()}`,
                            start,
                            end,
                            backColor: "#d0eaff",
                        };
                    });
                    const earliest = new DayPilot.Date(userData.availabilityTime[0]);
                    setStartDate(earliest.firstDayOfWeek());
                    setSelectedEvents(convertedEvents);
                    setAvailabilityTime(userData.availabilityTime.map((iso) =>
                        new Date(iso).toLocaleString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                    ));


                }


            } catch (error) {
                console.error("Fehler beim Abrufen der Verfügbarkeit:", error);
            }
        };


        fetchAvailability();
    }, [apiUrl, user.userId]);

    const TutorCalendar = () => {
        const calendarRef = useRef();


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

        const handleEventClick = (args) => {
            const eventId = args.e.data.id;
            const eventStart = args.e.data.start.value;

            setSelectedEvents((prevEvents) =>
                prevEvents.filter((e) => e.id !== eventId)
            );

            setAvailabilityTime((prevTimes) =>
                prevTimes.filter(
                    (t) =>
                        t !==
                        new Date(eventStart).toLocaleString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                )
            );
        };

        const handleTimeRangeSelected = (args) => {
            const newSelectedEvents = [...selectedEvents];
            const newAvailabilityTime = [...availabilityTime];

            let currentTime = args.start;
            const slotsToAdd = [];
            const slotsToRemoveIds = [];
            const timesToRemove = [];
            const timesToAdd = [];

            while (currentTime < args.end) {
                const start = currentTime;
                const end = currentTime.addMinutes(30);
                const id = `${start.toString()}-${end.toString()}`;

                const existing = newSelectedEvents.find((event) => event.id === id);

                if (existing) {
                    slotsToRemoveIds.push(id);
                    const formatted = new Date(start).toLocaleString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                    timesToRemove.push(formatted);
                } else {
                    slotsToAdd.push({
                        id,
                        start,
                        end,
                        backColor: "#d0eaff",
                    });

                    const formatted = new Date(start).toLocaleString("de-DE", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                    timesToAdd.push(formatted);
                }

                currentTime = currentTime.addMinutes(30);
            }

            const updatedEvents = newSelectedEvents
                .filter((event) => !slotsToRemoveIds.includes(event.id))
                .concat(slotsToAdd);

            const updatedTimes = newAvailabilityTime
                .filter((t) => !timesToRemove.includes(t))
                .concat(timesToAdd);

            setSelectedEvents(updatedEvents);
            setAvailabilityTime(updatedTimes);
        };

        const handleSave = async () => {
            if (availabilityTime.length > 0) {
                const slots = availabilityTime.join(", ");

                alert(`Ausgewählte Zeitfenster: ${slots}`);
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
                        onEventClick={handleEventClick}
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
                        <h3>Kalender</h3>
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
                        <h3>Gesamtverdienst</h3>
                    </div>
                );
            case "Support":
                return <p>Support-Bereich. Hier kannst du Hilfe anbieten oder anfordern.</p>;
            default:
                return <p>Bitte wähle eine Option aus der linken Spalte aus.</p>;
        }
    };

    return (
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
    );
}

export default TutorSeite;
