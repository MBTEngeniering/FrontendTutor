import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "../../styles/UserPage.css";
import TutorCalendar from "./TutorCalendar.jsx";
import { useAuth } from "../../context/UseAuth.jsx";
import ApiService from "../../api/ApiService";
import "react-big-calendar/lib/css/react-big-calendar.css";
import MyPost from "../../components/MyPost.jsx";
import SchuelerVertrag from "../Student/SchulerVertrag.jsx";
import TutorVertrag from "./TutorVertrag.jsx";
import MeinTerminTutor from "../../components/MeinTerminTutor.jsx";
import MeinGehalt from "../../components/MeinGehalt.jsx";
import MeineNachricht from "../../components/MeineNachricht.jsx";


function TutorSeite() {
    //const apiUrl = import.meta.env.VITE_API_URL;
    const [activeContent, setActiveContent] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { user } = useAuth(); // Assuming you have a custom hook for authentication
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [originalUser, setOriginalUser] = useState(null);
    const [post, setPost] = useState(null);
    const [meineStudent, setMeineStudent] = useState([]);
    const [selectedId, setSelectedId] = React.useState(null);

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
        const fetchLoggedInUser = async () => {
            const loggedInUser = await getLoggedInUser();
            if (loggedInUser) {
                setLoggedInUser(loggedInUser); // Zustand aktualisieren
                setOriginalUser(loggedInUser)// Originalwerte speichern, damit "Abbrechen" funktioniert
            }
        };
        const fetchMeinePost = async () => {
            const result = await MeinePost();
            setPost(result);
        };
        const fetchMeineStudents = async () => {
            const result = await MeineStudent();
            setMeineStudent(result);
        };

        fetchMeineStudents();
        fetchMeinePost();
        fetchLoggedInUser();
        fetchAvailability();
    }, [user]);

    const updateUser = async () => {
        try {
            const userId = loggedInUser.id;
            const userRole = loggedInUser.role;
            let endpoint = "";
            if (userRole === "STUDENT") {
                endpoint = `/api/students/${userId}`;
            } else {
                endpoint = `/api/tutors/${userId}`;
            }
            const response = await ApiService.put(endpoint, loggedInUser);
            // Bei erfolgreichem Update werden beide Zustände aktualisiert
            setLoggedInUser(response.data);
            setOriginalUser(response.data);
            alert("Änderungen wurden gespeichert");
        } catch (error) {
            console.error("Fehler beim Aktualisieren des Benutzers:", error);
            alert("Fehler beim Aktualisieren des Benutzers!");
        }
    };
    const MeinePost = async () => {
        const userId = user.id;
        try {
            const gesendetMessage = await ApiService.get(`/api/public/post/sender/${userId}`);
            const empfangMessage = await ApiService.get(`/api/public/post/empfaenger/${userId}`);

            const schowSendet= gesendetMessage.data;
            const schowRecieved= empfangMessage.data;
            const posts = [...schowSendet, ...schowRecieved];
            const nachrichtentexte = posts.flatMap(post => post.nachrichten.map(nachricht => nachricht.text));
            return posts;

        } catch (error) {
            alert("Fehler beim Laden der Nachrichten:", error);
            return [];
        }
    };

    const MeineStudent = async () => {
        const userId = user.id;
        try {
            const responseUser = await ApiService.get(`/api/allusers/${userId}`);
            const showUser = responseUser.data;

            if (!showUser.schoolTutorsIds || showUser.schoolTutorsIds.length === 0) {
              //  alert("Du hast noch keine Shüler.");
                return [];
            }

            const studentPromises = showUser.schoolTutorsIds.map(studentId =>
                ApiService.get(`/api/allusers/${studentId}`)
            );

            const studentsResponses = await Promise.all(studentPromises);
            const students = studentsResponses.map(response => response.data);

            return students;

        } catch (error) {
            console.log("Fehler beim Laden der Lehrer:", error);
            return [];
        }
    };

    // Funktion, um alle Änderungen abzubrechen, d.h. den Zustand zurückzusetzen
    const cancelChanges = () => {
        setLoggedInUser(originalUser);
    };

    const getLoggedInUser = async () => {
        if (!user) {
            return null;
        }

        // const userId = localStorage.getItem("userId");
        // const userRole = localStorage.getItem("userRole");
        const userId = user.id;
        const userRole = user.userRole;

        try {
            const response = await ApiService.get(`/api/allusers/${userId}`);

            const user = response.data;
            return user;
        } catch (error) {
            console.error("Fehler beim Laden des Benutzers:", error);
            return null;
        }
    };

    if(user.accountActive){
        const renderContent = () => {
            switch (activeContent) {
                case "Kalender":
                    return (
                        <div>
                            <h3>Kalender</h3>
                            <TutorCalendar tutorId={user?.id}/>
                        </div>
                    );
                case "Postfach":
                    return <MyPost userId={user.id} />;

                case "Vertrag":
                    return <TutorVertrag user={user} />;
                case "Meine Termine":
                    return (
                        <MeinTerminTutor tutor={user} />
                    );
                case "Meine Schüler":
                    return (
                        <div style={{ padding: "20px" }}>
                            <h2>Meine Student</h2>
                            {meineStudent.length > 0 ? (
                                <ul>
                                    {meineStudent.map(meineStudent => (
                                        <li key={meineStudent.id}>
                                            {meineStudent.firstName} {meineStudent.lastName}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Keine Student gefunden.</p>
                            )}
                        </div>
                    );
                case "Mein Profil":
                    return (
                        <div>
                            <h3>Mein Profil</h3>
                            <p>Hier können Sie Ihre persönlichen Daten bearbeiten:</p>
                            {loggedInUser ? (
                                <div className="user-details">
                                    <div>
                                        <label htmlFor="salutation"><strong>Anrede:</strong></label>
                                        <input
                                            type="text"
                                            id="salutation"
                                            value={loggedInUser.salutation || ""}
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, salutation: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="title"><strong>Titel:</strong></label>
                                        <input
                                            type="text"
                                            id="title"
                                            value={loggedInUser.title || ""}
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, title: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName"><strong>Nachname:</strong></label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            value={loggedInUser.lastName || ""}
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, lastName: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="firstName"><strong>Vorname:</strong></label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            value={loggedInUser.firstName || ""}
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, firstName: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="emailAddress"><strong>Email:</strong></label>
                                        <input
                                            type="email"
                                            id="emailAddress"
                                            value={loggedInUser.emailAddress || ""}
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, emailAddress: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="password"><strong>Passwort:</strong></label>
                                        <input
                                            type="password"
                                            id="password"
                                            value={loggedInUser.password || ""}
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, password: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="street"><strong>Straße:</strong></label>
                                        <input
                                            type="text"
                                            id="street"
                                            value={loggedInUser.street || ""}
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, street: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="houseNumber"><strong>Hausnummer:</strong></label>
                                        <input
                                            type="text"
                                            id="houseNumber"
                                            value={loggedInUser.houseNumber || ""}
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, houseNumber: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="postalCode"><strong>Postleitzahl:</strong></label>
                                        <input
                                            type="text"
                                            id="postalCode"
                                            value={loggedInUser.postalCode || ""}
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, postalCode: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phoneNumber"><strong>Telefonnummer:</strong></label>
                                        <input
                                            type="text"
                                            id="phoneNumber"
                                            value={loggedInUser.phoneNumber || ""}
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, phoneNumber: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="city"><strong>Stadt:</strong></label>
                                        <input
                                            type="text"
                                            id="city"
                                            value={loggedInUser.city || ""}
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, city: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="country"><strong>Land:</strong></label>
                                        <input
                                            type="text"
                                            id="country"
                                            value={loggedInUser.country || ""}
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, country: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="dateOfBirth"><strong>Geburtsdatum:</strong></label>
                                        <input
                                            type="date"
                                            id="dateOfBirth"
                                            value={
                                                loggedInUser.dateOfBirth
                                                    ? loggedInUser.dateOfBirth.substring(0, 10)
                                                    : ""
                                            }
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, dateOfBirth: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="placeOfBirth"><strong>Geburtsort:</strong></label>
                                        <input
                                            type="text"
                                            id="placeOfBirth"
                                            value={loggedInUser.placeOfBirth || ""}
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, placeOfBirth: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="countryOfBirth"><strong>Geburtsland:</strong></label>
                                        <input
                                            type="text"
                                            id="countryOfBirth"
                                            value={loggedInUser.countryOfBirth || ""}
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, countryOfBirth: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="bankCode"><strong>Bankleitzahl:</strong></label>
                                        <input
                                            type="text"
                                            id="bankCode"
                                            value={loggedInUser.bankCode || ""}
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, bankCode: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="iban"><strong>IBAN:</strong></label>
                                        <input
                                            type="text"
                                            id="iban"
                                            value={loggedInUser.iban || ""}
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, iban: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="description"><strong>Beschreibung:</strong></label>
                                        <textarea
                                            id="description"
                                            value={loggedInUser.description || ""}
                                            onChange={(e) =>
                                                setLoggedInUser({...loggedInUser, description: e.target.value})
                                            }
                                        />
                                    </div>
                                    <div style={{marginTop: "20px"}}>
                                        <button className="action-button" onClick={updateUser}>
                                            Änderung speichern
                                        </button>
                                        <button className="action-button" onClick={cancelChanges}
                                                style={{marginLeft: "10px"}}>
                                            Abbrechen
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p>Benutzerdaten konnten nicht geladen werden.</p>
                            )}
                        </div>
                    );
                case "Mein Honorar":
                    return <MeinGehalt TutorId={user.id} />;
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
                    <button onClick={() => setActiveContent("Mein Honorar")}>⏳ Mein Honorar</button>
                    <button onClick={() => setActiveContent("Support")}>🛟 Support</button>
                    <button onClick={() => setActiveContent("Postfach")}>📬 Postfach</button>
                    <button
                        className={activeContent === "Mein Profil" ? "active" : ""}
                        onClick={() => setActiveContent("Mein Profil")}
                    >
                        👤 Mein Profil
                    </button>
                </div>

                <div className="user-content">
                    {renderContent()}
                </div>
            </div>
        );
    }

    else{
        return <TutorVertrag user={user} />;
    }

}

export default TutorSeite;
