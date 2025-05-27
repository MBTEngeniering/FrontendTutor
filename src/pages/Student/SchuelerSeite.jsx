import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "../../styles/UserPage.css";
import { DateTime } from 'luxon';
import ApiService from "../../api/ApiService.js";
import { useAuth } from "../../context/UseAuth.jsx";

function SchuelerSeite() {
    const [activeContent, setActiveContent] = useState("Kalender");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [markedDates, setMarkedDates] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [selectedTutor, setSelectedTutor] = useState(null); // Zustand für den ausgewählten Tutor
    const [showModal, setShowModal] = useState(false);
    const [selectedSalutation, setSelectedSalutation] = useState("");
    const [selectedTitle, setSelectedTitle] = useState("");
    const [selectedPostalCode, setSelectedPostalCode] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedAge, setSelectedAge] = useState("");
    const [selectedFachId, setSelectedFachId] = useState(null);
    const [meineTutoren, setMeineTutoren] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [originalUser, setOriginalUser] = useState(null);
    const {user} = useAuth();


    // Student-specific data
    const termine = [

    ];


    const stunden = [

    ];

    useEffect(() => {
        // @TTODO: Use language from settings
        const lang = navigator.languages[1].substring(0, 2);
        ApiService.get(`/api/fach/trans/${lang}`)
            .then(response => setAvailableSubjects(response.data))
            .catch(function (error) {
                console.error("Fehler beim Laden der Fächer:", error.message);
                ApiService.get(`/api/fach`)
                    .then(response => setAvailableSubjects(response.data))
                    .catch(error => console.error("Fehler beim Laden der Fächer:", error))
            })

            .catch(error => console.error("Fehler beim Laden der Fächer:", error));

        ApiService.get(`/api/allusers`)
            .then(response => {
                // console.log(response.data);  // Überprüfe, ob die Tutor-Daten ankommen
                setTutors(response.data);
            })
            .catch(error => console.error("Fehler beim Laden der Tutoren:", error));
        const fetchMeineTutoren = async () => {
            const result = await MeineTutor();
            setMeineTutoren(result);
        };
        const fetchLoggedInUser = async () => {
            const loggedInUser = await getLoggedInUser();
            if (loggedInUser) {
                setLoggedInUser(loggedInUser); // Zustand aktualisieren
                setOriginalUser(loggedInUser)// Originalwerte speichern, damit "Abbrechen" funktioniert
            }
        };


        fetchMeineTutoren();
        fetchLoggedInUser();
    }, [user]);

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


    const showDetails = (tutor) => {
        setSelectedTutor(tutor);
        //setShowModal(true); // Modal anzeigen
        const tutorInfo = `
        Name: ${tutor.firstName} ${tutor.lastName}
        Titel: ${tutor.title}
        Anrede: ${tutor.salutation}
        Land: ${tutor.country}
        Stadt: ${tutor.city}
        Postleitzahl: ${tutor.postalCode}
        Alter: ${calculateAge(tutor.dateOfBirth)}
        Beschreibung: ${tutor.description || 'Keine Beschreibung verfügbar'}
    `;
        alert(tutorInfo);
    };

    const MeineTutor = async () => {
        try {
            const loggedInUser = user.id;
            if (!loggedInUser) {
                alert("Bitte melden Sie sich an, um einen Tutor auszuwählen.");
                return [];
            }

            const userId = user.id;
            const userRole = user.userRole;

            if (!userId || !userRole) {
                console.warn("Benutzer nicht eingeloggt oder keine Rolle gesetzt.");
                return [];
            }

            let response = await ApiService.get(`/api/allusers/${userId}`);

            const userData = response.data;
            const tutorsIds = userData.tutorsIds || [];
            const tutorsList = [];
            for (const tutorId of tutorsIds) {
                try {
                    const tutorResponse = ApiService.get(`/api/tutors/${tutorId}`);
                    tutorsList.push(tutorResponse.data);
                } catch (tutorError) {
                    console.warn(`Tutor mit ID ${tutorId} konnte nicht geladen werden:`, tutorError);
                }
            }

            return tutorsList;

        } catch (error) {
            console.error("Fehler beim Laden der Tutoren:", error);
            return [];
        }
    };

    const chooseTutor = async (tutor) => {
        try {
            setSelectedTutor(tutor);
            const loggedInUser = JSON.parse(localStorage.getItem('isLoggedIn'));
            if (!loggedInUser) {
                alert("2Bitte melden Sie sich an, um einen Tutor auszuwählen.");
                return;
            }
            const userId = localStorage.getItem("userId");
            const userRole = localStorage.getItem("userRole");

            let response;
            if (userRole === "STUDENT") {
                response = await ApiService.get(`/api/students/${userId}`);
            } else {
                response = await ApiService.get(`/api/tutors/${userId}`);
            }


            const user = response.data;
            const tutorsIds = user.tutorsIds || [];
            if (tutorsIds.includes(tutor.id)) {
                alert("Dieser Tutor wurde bereits als dein Tutor .");
                return;
            }
            else{
                tutorsIds.push(tutor.id)
                const tutorResponse = ApiService.get(`/api/tutors/${tutor.id}`);
                const tutorData = tutorResponse.data;
                const schoolTutorsIds = tutorData.schoolTutorsIds || [];
                schoolTutorsIds.push(userId);
                tutorData.schoolTutorsIds = schoolTutorsIds;
                await ApiService.put(`/api/tutors/${tutor.id}`, tutorData);

                if (userRole === "STUDENT") {
                    await ApiService.put(`/api/students/${userId}`, user);
                } else {
                    await ApiService.put(`/api/tutors/${userId}`, user);
                }
                alert("Du hast den Tutor "+ tutor.lastName +" "+ tutor.firstName +" erfolgreich ausgewählen und  kannst schon Studen buchen")

            }


        } catch (error) {
            console.error("Fehler:", error);
            alert("Es gab ein Problem beim Wählen des Tutors.");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTutor(null);
    };
    const handleMarkCell = (day, hour, minute) => {

    };

    const calculateAge = (birthdate) => {
        if (!birthdate) { // Prüfen, ob birthdate null oder leer ist
            return null;
        }

        const currentDate = DateTime.now();
        const birthDate = DateTime.fromISO(birthdate);

        let age = currentDate.year - birthDate.year;

        // Überprüfen, ob der Geburtstag in diesem Jahr bereits vergangen ist
        if (
            currentDate.month < birthDate.month ||
            (currentDate.month === birthDate.month && currentDate.day < birthDate.day)
        ) {
            age--;
        }

        return age;
    };


    const filteredTutors = tutors.filter((tutor) => {
        const matchesSubject =
            selectedSubject === "" ||
            (selectedFachId && tutor.fachIds?.includes(selectedFachId));

        const matchesSalutation =
            selectedSalutation === "" || tutor.salutation?.toLowerCase().includes(selectedSalutation.toLowerCase());
        const matchesTitle =
            selectedTitle === "" || tutor.title?.toLowerCase().includes(selectedTitle.toLowerCase());
        const matchesPostalCode =
            selectedPostalCode === "" || tutor.postalCode?.toString().includes(selectedPostalCode);
        const matchesCity =
            selectedCity === "" || tutor.city?.toLowerCase().includes(selectedCity.toLowerCase());
        const matchesCountry =
            selectedCountry === "" || tutor.country?.toLowerCase().includes(selectedCountry.toLowerCase());
        const matchesAge =
            selectedAge === "" || calculateAge(tutor.dateOfBirth)?.toString().includes(selectedAge);

        return (
            matchesSubject &&
            matchesSalutation &&
            matchesTitle &&
            matchesPostalCode &&
            matchesCity &&
            matchesCountry &&
            matchesAge
        );
    });

    const saveChanges = () => {

    };
    const getFachId = async (fachName) => {
        try {
            const response = ApiService.get(`/api/fach/search?fach=${encodeURIComponent(fachName)}`);
            if (!response.ok) {
                throw new Error("Fehler beim Abrufen des Fachs");
            }
            const data = await response.json();
            if (data && data.id) {
                return data.id;
            } else {
                throw new Error("Fach nicht gefunden");
            }
        } catch (error) {
            console.error("Fehler in getFachId:", error);
            return null;
        }
    };
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

    // Funktion, um alle Änderungen abzubrechen, d.h. den Zustand zurückzusetzen
    const cancelChanges = () => {
        setLoggedInUser(originalUser);
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
                <h3>Mein Stundenplan</h3>
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
                                             {termin ? `${termin.tutor} (${termin.fach})` : ""}
                                         </td>
                                     );
                                 })}
                             </tr>
                         );
                     })}
                     </tbody>
                 </table>
                <button className="action-button" onClick={saveChanges}>
                    Terminwünsche speichern
                </button>
            </div>
        );
    };

    const handleStundeBuchen = (tutor) => {
        alert(
            "Stunde buchen mit:\n" +
            "Vorname: " + tutor.firstName + "\n" +
            "Nachname: " + tutor.lastName + "\n" +
            "E-Mail: " + tutor.emailAddress + "\n" +
            "Land: " + tutor.country + "\n" +
            "ID: " + tutor.id
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
                        {meineTutoren.length === 0 ? (
                            <p>Keine Lehrer vorhanden. Bitte wählen Sie Lehrer aus.</p>
                        ) : (
                            <ul>
                                {meineTutoren.map((tutor, index) => (
                                    <li key={index} style={{ marginBottom: "10px" }}>
                                        {tutor.firstName} {tutor.lastName}
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleStundeBuchen(tutor)}
                                        >
                                            Stunde buchen
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
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

            case "Lehrer suchen":
                return (
                    <div className="form-group full-width">
                        <label className="form-label">Fächer</label>
                        <div className="subjects-container">
                            <select
                                className="form-input"
                                value={selectedSubject}
                                onChange={async (e) => {
                                    const selectedFach = e.target.value;
                                    setSelectedSubject(selectedFach);

                                    // Aufrufen der Funktion getFachId mit dem ausgewählten Fachnamen
                                    const fachId = await getFachId(selectedFach);

                                    if (fachId) {
                                        setSelectedFachId(fachId);
                                    }
                                }}
                            >
                                <option value="">Bitte wählen</option>
                                {availableSubjects.map((f, index) => (
                                    <option key={index} value={f.fach}>
                                        {f.translation ? f.translation : f.fach}
                                    </option>
                                ))}
                            </select>

                            <div className="subjects-list">
                                {subjects.map((subject, index) => (
                                    <div key={index} className="subject-tag">
                                        <span>{subject}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Tutor List Table */}
                            <h3>Verfügbare Lehrer</h3>
                            {/* Filterfelder */}
                            <div className="filter-grid">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Anrede"
                                    value={selectedSalutation}
                                    onChange={(e) => setSelectedSalutation(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Titel"
                                    value={selectedTitle}
                                    onChange={(e) => setSelectedTitle(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Land"
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Postleitzahl"
                                    value={selectedPostalCode}
                                    onChange={(e) => setSelectedPostalCode(e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Stadt"
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                />
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Alter"
                                    value={selectedAge}
                                    onChange={(e) => setSelectedAge(e.target.value)}
                                />
                            </div>

                            {/* Tutorentabelle */}
                            <table className="tutor-table">
                                <thead>
                                <tr>
                                    <th>Anrede</th>
                                    <th>Titel</th>
                                    <th>Nachname</th>
                                    <th>Vorname</th>
                                    <th>Land</th>
                                    <th>Postleitzahl</th>
                                    <th>Stadt</th>
                                    <th>Alter</th>
                                    <th>Aktionen</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filteredTutors.length > 0 ? (
                                    filteredTutors.map((tutor, index) => (
                                        <tr key={index}>
                                            <td>{tutor.salutation}</td>
                                            <td>{tutor.title}</td>
                                            <td>{tutor.lastName}</td>
                                            <td>{tutor.firstName}</td>
                                            <td>{tutor.country}</td>
                                            <td>{tutor.postalCode}</td>
                                            <td>{tutor.city}</td>
                                            <td>{calculateAge(tutor.dateOfBirth)}</td>
                                            <td>
                                                <button className="action-button" onClick={() => showDetails(tutor)}>
                                                    Details
                                                </button>
                                                <button className="action-button" onClick={() => chooseTutor(tutor)}>
                                                    Auswählen
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">Keine passenden Tutoren gefunden.</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            {showModal && selectedTutor && (
                                <div className="modal-overlay">
                                    <div className="modal-content">
                                        <h2>{selectedTutor.firstName} {selectedTutor.lastName}</h2>
                                        <p><strong>Beschreibung:</strong></p>
                                        <p>{selectedTutor.description}</p>
                                        <button onClick={closeModal}>Schließen</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            default:
                return <p>Bitte wählen Sie eine Option aus der linken Spalte aus.</p>;
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
