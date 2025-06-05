import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "../../styles/UserPage.css";
import TutorCalendar from "../../components/TutorCalendar";
import { useAuth } from "../../context/UseAuth.jsx";
import ApiService from "../../api/ApiService";
import "react-big-calendar/lib/css/react-big-calendar.css";

function TutorSeite() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [activeContent, setActiveContent] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { user } = useAuth(); // Assuming you have a custom hook for authentication

    useEffect(() => {
        const fetchAvailability = async () => {
            if (!user) return;

            try {
                const response = await ApiService.get(`/api/allusers/${user.id}`);
                const userData = response.data;


            } catch (error) {
                console.error("Fehler beim Abrufen der Verfügbarkeit:", error);
            }
        };


        fetchAvailability();
    }, [user]);



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
                        <h3>Kalender</h3>
                        <TutorCalendar tutorId={user?.id}/>
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
