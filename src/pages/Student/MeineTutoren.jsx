import React, { useEffect, useState } from "react";
import ApiService from "../../api/ApiService.js";

const MeineTutoren = ({ userId }) => {
    const [meineTutoren, setMeineTutoren] = useState([]);
    const [faecher, setFaecher] = useState([]);
    const [gewaehltesFach, setGewaehltFach] = useState(null);

    const [verfuegbareZeiten, setVerfuegbareZeiten] = useState([]);
    const [showZeitenModal, setShowZeitenModal] = useState(false);

    const [filter, setFilter] = useState({
        jahr: "",
        monat: "",
        tag: "",
        uhrzeit: ""
    });
    const [aktiverTutor, setAktiverTutor] = useState(null);

    useEffect(() => {
        const fetchTutoren = async () => {
            try {
                const responseUser = await ApiService.get(`/api/allusers/${userId}`);
                const showUser = responseUser.data;

                if (!showUser.tutorsIds || showUser.tutorsIds.length === 0) {
                    setMeineTutoren([]);
                    return;
                }

                const tutorPromises = showUser.tutorsIds.map(tutorId =>
                    ApiService.get(`/api/allusers/${tutorId}`)
                );

                const tutorsResponses = await Promise.all(tutorPromises);
                const tutors = tutorsResponses.map(response => response.data);

                setMeineTutoren(tutors);
            } catch (error) {
                console.error("Fehler beim Laden der Lehrer:", error);
                setMeineTutoren([]);
            }
        };

        fetchTutoren();
    }, [userId]);

    const handleStundenBuchen = async (tutorId) => {
        try {
            // 1️⃣ Eigene Stunden abfragen
            const stundenResponse = await ApiService.get(`/api/public/meineStunde/user/${userId}`);
            const meineStunden = stundenResponse.data;

            if (!meineStunden|| meineStunden.length === 0) {
                alert("Du hast keine Stunde noch . wir haben das passende Angebot für dich  Unter meine Stunde kannst du deinen ersten Packet  kaufen ");
                return;
            }
            const meineStunde = meineStunden[0];

            if (meineStunde.anzahlStunde === 0) {
                alert("Keine Stunde verfügbar. Bitte kaufe neue Stunde.");
                return;
            }

            // 2️⃣ Wenn Stunden verfügbar → Rest normal laden
            const tutorResponse = await ApiService.get(`/api/allusers/${tutorId}`);
            const tutor = tutorResponse.data;

            if (!tutor.fachIds || tutor.fachIds.length === 0) {
                alert("Der Tutor hat keine Fächer.");
                return;
            }

            const lang = "de"; // oder dynamisch
            const fachPromises = tutor.fachIds.map(async (fachId) => {
                const response = await ApiService.get(`/api/fach/trans/${lang}`);
                const alleFaecher = response.data;

                const fach = alleFaecher.find(f => f.id === fachId);

                if (!fach) {
                    alert(`Kein Fach gefunden für ID: ${fachId}`);
                }
                return { id: fachId, name: fach ? fach.fach : `Fach ${fachId}` };
            });

            const faecher = await Promise.all(fachPromises);

            setFaecher(faecher);
            setAktiverTutor(tutorId);
            setGewaehltFach(null);
            setVerfuegbareZeiten([]);
            setFilter({ jahr: "", monat: "", tag: "", uhrzeit: "" });
            setShowZeitenModal(true);
        } catch (error) {
            console.error("Fehler beim Laden der Daten:", error);
            if (error.response && error.response.status === 404) {
                alert("Du hast keine Stunde. Bitte kaufe eine Stunde.");
            }
        }
    };


    const ladeVerfuegbareZeiten = async () => {
        if (!gewaehltesFach || !aktiverTutor) {
            alert("Bitte wähle zuerst ein Fach aus.");
            return;
        }
        try {
            const response = await ApiService.get(`/api/public/availability/user/${aktiverTutor}`);
            setVerfuegbareZeiten(response.data);
        } catch (error) {
            console.error("Fehler beim Laden der verfügbaren Zeiten:", error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    };
    const SendeNachricht = async (studentId, tutorId, messageBody,appointmentDate) => {

        try {

            const responseTutor = await ApiService.get(`/api/allusers/${tutorId}`);
            const responseUser = await ApiService.get(`/api/allusers/${studentId}`);
            const schowTutor = responseTutor.data;
            const showUser = responseUser.data;
                const newPost = {
                    sender: studentId,
                    empfaenger: tutorId,
                    nachrichten: [
                        {
                            text:messageBody,
                            timestamp: appointmentDate
                        }
                    ]
                };
                await ApiService.post("/api/public/post/save", newPost);

                await ApiService.put(`/api/allusers/${userId}`, showUser);
                await ApiService.put(`/api/allusers/${tutorId}`, schowTutor);

        } catch (error) {
            alert("Fehler beim Laden des Benutzers:", error);

        }

    };

    const gefilterteZeiten = () => {
        if (!filter.jahr || !filter.monat|| !filter.tag) {
            return null;
        }

        const now = new Date();

        return verfuegbareZeiten.filter(zeit => {
            const matchJahr = zeit.jahr.toString() === filter.jahr;
            const matchMonat = zeit.monat.toString() === filter.monat;
            const matchTag = filter.tag ? zeit.tag.toString() === filter.tag : true;
            const matchUhrzeit = filter.uhrzeit ? zeit.uhrzeit.includes(filter.uhrzeit) : true;

            // Erstelle ein Date-Objekt für diese Zeit
            const [hour, minute] = zeit.uhrzeit.split(":");
            const zeitDate = new Date(
                zeit.jahr,
                zeit.monat - 1, // JS Monate: 0-basiert
                zeit.tag,
                parseInt(hour),
                parseInt(minute)
            );

            const isInFuture = zeitDate > now;

            return matchJahr && matchMonat && matchTag && matchUhrzeit && isInFuture;
        });
    };

    const berechneMinusUndPlus30 = (uhrzeit) => {
        // Uhrzeit-String aufsplitten
        const [hour, minute] = uhrzeit.split(":").map(Number);

        // Heute als Basis nehmen (Datum egal, nur Zeit relevant)
        const now = new Date();
        now.setHours(hour);
        now.setMinutes(minute);
        now.setSeconds(0);
        now.setMilliseconds(0);

        // Kopien machen
        const minus30Date = new Date(now.getTime() - 30 * 60000);
        const plus30Date = new Date(now.getTime() + 30 * 60000);

        // Wieder in HH:mm formatieren
        const toHHMM = (date) => {
            const hh = date.getHours().toString().padStart(2, "0");
            const mm = date.getMinutes().toString().padStart(2, "0");
            return `${hh}:${mm}`;
        };

        return {
            minus30: toHHMM(minus30Date),
            plus30: toHHMM(plus30Date),
        };
    };
    const handleBuchenBestaetigen = async (zeit, studentId, tutorId) => {
        try {
            if (!gewaehltesFach) {
                alert("Kein Fach ausgewählt!");
                return;
            }
            const stundenResponse = await ApiService.get(`/api/public/meineStunde/user/${userId}`);
            const meineStunden = stundenResponse.data;
            let meineStunde = meineStunden[0].anzahlStunde;
            if (meineStunde <= 0) {
                alert("Keine Stunden mehr verfügbar!");
                return;
            }
            const startDate = `${zeit.jahr}-${zeit.monat.toString().padStart(2, '0')}-${zeit.tag.toString().padStart(2, '0')}T${zeit.uhrzeit}:00`;

            const [hour, minute] = zeit.uhrzeit.split(":");
            const endHour = String(Number(hour) + 1).padStart(2, "0");
            const endDate = `${zeit.jahr}-${zeit.monat.toString().padStart(2, '0')}-${zeit.tag.toString().padStart(2, '0')}T${endHour}:${minute}:00`;

            const appointmentDTO = {
                startDate: startDate,
                endDate: endDate,
                tutorId: tutorId,
                studentId: studentId,
                studentIsPresent: false,
                tutorIsPresent: false,
                fachId: gewaehltesFach,
            };

            const response = await ApiService.post(`/api/public/appointments`, appointmentDTO);

            if (response.status !== 200 && response.status !== 201) {
                throw new Error("Fehler beim Buchen des Termins");
            }
            const gebuchtesFach = faecher.find(f => f.id === gewaehltesFach);
            const datumObj = new Date(
                zeit.jahr,
                zeit.monat - 1, // Achtung: Monat 0-basiert!
                zeit.tag,
                parseInt(zeit.uhrzeit.split(":")[0]),
                parseInt(zeit.uhrzeit.split(":")[1])
            );

            const datumStr = datumObj.toISOString();
            const responseUser = await ApiService.get(`/api/allusers/${userId}`);
            const showUser = responseUser.data;
            const messageBody = `${showUser.salutation} ${showUser.firstName} ${showUser.lastName} hat am ${datumStr} Nachhilfe im Fach ${gebuchtesFach ? gebuchtesFach.name : gewaehltesFach}.`;
            SendeNachricht(studentId,tutorId,messageBody,datumStr);

            // Verfügbarkeit per Uhrzeit UND userId löschen (hier als studentId)
            const { minus30, plus30 } = berechneMinusUndPlus30(zeit.uhrzeit);
            const deleteMinus30 = await ApiService.delete(`/api/public/availability/uhrzeit/${minus30}/user/${tutorId}`);
            const deletePlus30 = await ApiService.delete(`/api/public/availability/uhrzeit/${plus30}/user/${tutorId}`);
            const deleteCurrent = await ApiService.delete(`/api/public/availability/uhrzeit/${zeit.uhrzeit}/user/${tutorId}`);
            if (deleteCurrent.status !== 204) {
                console.warn(`Verfügbarkeit ${zeit.uhrzeit} konnte nicht gelöscht werden`);
            }
            if (deleteMinus30.status !== 204) {
                console.warn(`Verfügbarkeit ${minus30} konnte nicht gelöscht werden`);
            }
            if (deletePlus30.status !== 204) {
                console.warn(`Verfügbarkeit ${plus30} konnte nicht gelöscht werden`);
            }
            meineStunde = meineStunde - 1;
            const vorhandeneStunde = meineStunden[0];

            const updatedStunde = {
                ...vorhandeneStunde,
                anzahlStunde: meineStunde,
                datumBuchen: vorhandeneStunde.datumBuchen,
                datumAblauf: vorhandeneStunde.datumAblauf,
                gueltigkeit: true,
            };
            await ApiService.put(`/api/public/meineStunde/${vorhandeneStunde.id}`, updatedStunde);
            alert(`Erfolgreich gebucht: ${startDate} bis ${endDate}`);
            setShowZeitenModal(false);
        } catch (error) {
            console.error(error);
            alert("Fehler beim Buchen. Bitte versuche es erneut.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Meine Lehrer</h2>
            {meineTutoren.length > 0 ? (
                <ul>
                    {meineTutoren.map(tutor => (
                        <li key={tutor.id} style={{ marginBottom: "10px" }}>
                            {tutor.firstName} {tutor.lastName}
                            <button
                                onClick={() => handleStundenBuchen(tutor.id)}
                                style={{ marginLeft: "10px" }}
                            >
                                Stunden buchen
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Keine Lehrer gefunden.</p>
            )}

            {showZeitenModal && (
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "white",
                    border: "1px solid #ccc",
                    padding: "20px",
                    zIndex: 1000,
                    width: "350px"
                }}>
                    <h3>Fach auswählen</h3>
                    <div style={{ marginBottom: "10px" }}>
                        {faecher.length > 0 ? (
                            <>
                                <select
                                    value={gewaehltesFach || ""}
                                    onChange={(e) => setGewaehltFach(Number(e.target.value))}
                                    style={{ width: "100%", marginBottom: "10px" }}
                                >
                                    <option value="">-- Bitte Fach wählen --</option>
                                    {faecher.map(fach => (
                                        <option key={fach.id} value={fach.id}>{fach.name}</option>
                                    ))}
                                </select>
                                <button onClick={ladeVerfuegbareZeiten} disabled={!gewaehltesFach}>
                                    Verfügbare Zeiten laden
                                </button>
                            </>
                        ) : (
                            <p>Keine Fächer verfügbar.</p>
                        )}
                    </div>

                    {verfuegbareZeiten.length > 0 && (
                        <>
                            <h4>Filtere deine Zeit</h4>
                            <div style={{ marginBottom: "10px" }}>
                                <input
                                    type="text"
                                    placeholder="Jahr"
                                    name="jahr"
                                    value={filter.jahr}
                                    onChange={handleFilterChange}
                                    style={{ marginRight: "5px", width: "70px" }}
                                />
                                <input
                                    type="text"
                                    placeholder="Monat"
                                    name="monat"
                                    value={filter.monat}
                                    onChange={handleFilterChange}
                                    style={{ marginRight: "5px", width: "70px" }}
                                />
                                <input
                                    type="text"
                                    placeholder="Tag"
                                    name="tag"
                                    value={filter.tag}
                                    onChange={handleFilterChange}
                                    style={{ marginRight: "5px", width: "70px" }}
                                />
                                <input
                                    type="text"
                                    placeholder="Uhrzeit"
                                    name="uhrzeit"
                                    value={filter.uhrzeit}
                                    onChange={handleFilterChange}
                                    style={{ width: "70px" }}
                                />
                            </div>

                            {(!filter.jahr || !filter.monat) ? (
                                <p>Bitte Monat und Jahr eingeben.</p>
                            ) : (
                                <>
                                    {gefilterteZeiten() && gefilterteZeiten().length > 0 ? (
                                        <ul style={{ listStyle: "none", padding: 0 }}>
                                            {gefilterteZeiten().map((zeit, index) => (
                                                <li key={index} style={{ marginBottom: "5px" }}>
                                                    {zeit.jahr}-{zeit.monat}-{zeit.tag} {zeit.uhrzeit}
                                                    <button
                                                        onClick={() => handleBuchenBestaetigen(zeit, userId, aktiverTutor)}
                                                        style={{ marginLeft: "5px" }}
                                                    >
                                                        Buchen
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Zeitraum nicht verfügbar.</p>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    <button onClick={() => setShowZeitenModal(false)} style={{ marginTop: "10px" }}>
                        Schließen
                    </button>
                </div>
            )}
        </div>
    );
};

export default MeineTutoren;
