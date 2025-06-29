import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import "../../styles/UserPage.css";
import { DateTime } from 'luxon';
import ApiService from "../../api/ApiService.js";
import { useAuth } from "../../context/UseAuth.jsx";
import StudentCalender from "./StudentCalender.jsx";
import MeineTutoren  from "./MeineTutoren.jsx";
import SendeMessage from "../../components/SendeMessage.jsx";
import MyPost from "../../components/MyPost.jsx";

function SchuelerSeite() {
    const [activeContent, setActiveContent] = useState("Kalender");
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    //const [selectedDate, setSelectedDate] = useState(new Date());
   // const [markedDates, setMarkedDates] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [availableSubjects, setAvailableSubjects] = useState([]);
   // const [subjects, setSubjects] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [selectedTutor, setSelectedTutor] = useState(null); // Zustand für den ausgewählten Tutor
    const [showModal, setShowModal] = useState(false);
    const [selectedSalutation, setSelectedSalutation] = useState("");
    const [selectedTitle, setSelectedTitle] = useState("");
    const [selectedPostalCode, setSelectedPostalCode] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedAge, setSelectedAge] = useState("");
   // const [selectedFachId, setSelectedFachId] = useState(null);
    const [meineTutoren, setMeineTutoren] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [originalUser, setOriginalUser] = useState(null);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const {user} = useAuth();
     const [post, setPost] = useState(null);
    const [selectedId, setSelectedId] = React.useState(null);



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
                const allUsers = response.data;

                // 👉 Filter: nur Tutoren mit aktivem Account
                const tutors = allUsers.filter(user =>
                    user.accountActive === true &&
                    user.userRoleIds &&
                    user.userRoleIds.includes(2)
                );

                setTutors(tutors);
            })
            .catch(error => console.error("Fehler beim Laden der Tutoren:", error));
        const fetchLoggedInUser = async () => {
            const loggedInUser = await getLoggedInUser();
            if (loggedInUser) {
                setLoggedInUser(loggedInUser); // Zustand aktualisieren
                setOriginalUser(loggedInUser)// Originalwerte speichern, damit "Abbrechen" funktioniert
            }
        };

        fetchLoggedInUser();
    }, [user]);

    const getLoggedInUser = async () => {
        if (!user) {
            return null;
        }

        // const userId = localStorage.getItem("userId");
        // const userRole = localStorage.getItem("userRole");
        const userId = user.id;
       // const userRole = user.userRole;

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
        Id:  ${tutor.id}
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


    const chooseTutor = async (tutor) => {

        const tutorId = tutor.id;
        const userId = user.id;
        try {

            const responseTutor = await ApiService.get(`/api/allusers/${tutorId}`);
            const responseUser = await ApiService.get(`/api/allusers/${userId}`);
            const schowTutor = responseTutor.data;
            const showUser = responseUser.data;
            if (showUser.tutorsIds && showUser.tutorsIds.includes(tutorId)) {
                alert(`Der Tutor ${schowTutor.firstName} ${schowTutor.lastName} ist  bereits  dein TuTor.`);
            } else {

                showUser.tutorsIds = [...(showUser.tutorsIds || []), tutorId];

                schowTutor.schoolTutorsIds = [...(schowTutor.schoolTutorsIds || []), userId];
                const newPost = {
                    sender: "4f0226e1-1fe8-495a-84e7-26c46769de2d",
                    empfaenger: tutorId,
                    nachrichten: [
                        {
                            text: `${showUser.salutation} ${showUser.firstName} ${showUser.lastName} hat sich mit dem Tutor ${schowTutor.firstName} ${schowTutor.lastName} verbunden.`,
                            timestamp: new Date().toISOString()
                        }
                    ]
                };
                 await ApiService.post("/api/public/post/save", newPost);

                await ApiService.put(`/api/allusers/${userId}`, showUser);
                await ApiService.put(`/api/allusers/${tutorId}`, schowTutor);
                alert(`du bist mit dem  Tutor ${schowTutor.firstName} ${schowTutor.lastName}  in verbindung und kannst die erste Stunde buchen`);
            }

        } catch (error) {
          alert("Fehler beim Laden des Benutzers:", error);

        }

    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTutor(null);
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
            (selectedSubjectId && tutor.fachIds?.includes(selectedSubjectId));

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
                return <MyPost userId={user.id} />;
            case "Studienübersicht":
                return (
                    <div>
                        <h3>Meine Studienübersicht</h3>
                        <p>Hier sehen Sie Ihren Lernfortschritt in allen Fächern.</p>
                    </div>
                );
            case "Kalender":
                return (
                    <div>
                        <h3>Mein Stundenplan</h3>
                        <StudentCalender tutorId={user?.id}/>
                    </div>
                );
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
                    <div style={{ padding: "20px" }}>
                         <MeineTutoren userId={user.id} />
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
                    <div style={{ padding: "20px" }}>
                        <h3 style={{ borderBottom: "2px solid #ddd", paddingBottom: "10px" }}>Lehrer suchen</h3>
                        <label className="form-label">Fächer</label>
                        <div className="subjects-container">
                            <select
                                className="form-input"
                                value={selectedSubject}
                                onChange={async (e) => {
                                    const selectedFach = e.target.value;
                                    setSelectedSubject(selectedFach);
                                    const matchedSubject = availableSubjects.find(
                                        (subject) => subject.fach === selectedFach
                                    );
                                    const selectedId = matchedSubject ? matchedSubject.id : null;
                                    setSelectedSubjectId(selectedId);
                                }}
                            >
                                <option value="">Bitte wählen</option>
                                {availableSubjects.map((f, index) => (
                                    <option key={index} value={f.fach}>
                                        {f.translation ? f.translation : f.fach}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <h3>Verfügbare Lehrer</h3>

                        {/* Filterfelder wieder eingefügt */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px", marginBottom: "20px" }}>
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

                        {/* Tutorentabelle mit sichtbaren Rahmen */}
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                marginTop: "10px",
                                border: "2px solid black",
                            }}
                        >
                            <thead>
                            <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
                                <th style={{ padding: "10px", border: "2px solid black" }}>Anrede</th>
                                <th style={{ padding: "10px", border: "2px solid black" }}>Titel</th>
                                <th style={{ padding: "10px", border: "2px solid black" }}>Nachname</th>
                                <th style={{ padding: "10px", border: "2px solid black" }}>Vorname</th>
                                <th style={{ padding: "10px", border: "2px solid black" }}>Land</th>
                                <th style={{ padding: "10px", border: "2px solid black" }}>Postleitzahl</th>
                                <th style={{ padding: "10px", border: "2px solid black" }}>Stadt</th>
                                <th style={{ padding: "10px", border: "2px solid black" }}>Alter</th>
                                <th style={{ padding: "10px", border: "2px solid black" }}>Aktionen</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredTutors.length > 0 ? (
                                filteredTutors.map((tutor, index) => (
                                    <tr key={index} style={{ borderBottom: "2px solid black" }}>
                                        <td style={{ padding: "10px", border: "2px solid black" }}>{tutor.salutation}</td>
                                        <td style={{ padding: "10px", border: "2px solid black" }}>{tutor.title}</td>
                                        <td style={{ padding: "10px", border: "2px solid black" }}>{tutor.lastName}</td>
                                        <td style={{ padding: "10px", border: "2px solid black" }}>{tutor.firstName}</td>
                                        <td style={{ padding: "10px", border: "2px solid black" }}>{tutor.country}</td>
                                        <td style={{ padding: "10px", border: "2px solid black" }}>{tutor.postalCode}</td>
                                        <td style={{ padding: "10px", border: "2px solid black" }}>{tutor.city}</td>
                                        <td style={{ padding: "10px", border: "2px solid black" }}>{calculateAge(tutor.dateOfBirth)}</td>
                                        <td style={{ padding: "10px", border: "2px solid black" }}>
                                            <button
                                                className="action-button"
                                                onClick={() => showDetails(tutor)}
                                            >
                                                Details
                                            </button>
                                            <button
                                                className="action-button"
                                                onClick={() => chooseTutor(tutor)}
                                            >
                                                Auswählen
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" style={{ padding: "10px", border: "2px solid black", textAlign: "center" }}>
                                        Keine passenden Tutoren gefunden.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
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
