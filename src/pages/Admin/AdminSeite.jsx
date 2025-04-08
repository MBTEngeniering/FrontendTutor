import React, { useState } from "react";
import axios from "axios";

function AdminSeite() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEndpoint, setCurrentEndpoint] = useState("");

    // Formulardaten-Initialisierung
    const [formData, setFormData] = useState({
        id: "",
        salutation: "",
        title: "",
        lastName: "",
        firstName: "",
        emailAddress: "",
        password: "",
        street: "",
        houseNumber: "",
        postalCode: "",
        phoneNumber: "",
        city: "",
        country: "",
        dateOfBirth: "",
        placeOfBirth: "",
        bankCode: "",
        iban: "",
        description: "",
        picture: "",
        taxId: "",
        hobbies: "",
        zoomLink: "",
    });

    // API-Daten abrufen
    const fetchData = async (endpoint) => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/userstatus/${endpoint}`
            );
            setData(response.data);
            setCurrentEndpoint(endpoint); // Hier speichern wir, ob "students" oder "tutors" geladen wurden
        } catch (error) {
            console.error("Fehler beim Abrufen der Daten:", error);
        }
    };

    // Filter für Suchfunktion
    const filteredData = data.filter(
        (user) =>
            user.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Öffnet das Modal und setzt die formData mit den Daten des ausgewählten Users
    const handleVerwaltenClick = (user) => {
        setSelectedUser(user);
        setFormData({ ...user }); // formData wird mit allen Feldern des Users vorbelegt
        setIsModalOpen(true);
    };

    // Änderungen in den Eingabefeldern in den formData-State übernehmen
    const handleInputChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    // Speichert die Änderungen
    const handleSave = async () => {
        let updateEndpoint = "";
        if (formData.userRoleIds && formData.userRoleIds.some((role) => role === 1)) {
            updateEndpoint = `${apiUrl}/api/students/${formData.id}`;
        } else {
            updateEndpoint = `${apiUrl}/api/tutors/${formData.id}`;
        }

        try {
            await axios.put(updateEndpoint, formData);
            alert("Änderungen gespeichert!");
            closeModal();
            fetchData(currentEndpoint); // Liste neu laden, um die Änderungen zu sehen
        } catch (error) {
            console.error("Fehler beim Speichern:", error);
            alert("Fehler beim Speichern der Änderungen.");
        }
    };

    // Löscht den User aus der Datenbank
    const handleDelete = async () => {
        if (!window.confirm("Möchtest du diesen Benutzer wirklich löschen?")) return;

        let deleteEndpoint = "";
        if (formData.userRoleIds && formData.userRoleIds.some((role) => role === 1)) {
            deleteEndpoint =`${apiUrl}/api/students/${formData.id}`;
        } else  {
            deleteEndpoint = `${apiUrl}/api/tutors/${formData.id}`;
        }

        try {
            await axios.delete(deleteEndpoint);
            alert("Benutzer gelöscht.");
            closeModal();
            // Aktualisiere die Datenliste, indem du den gelöschten User entfernst
            setData((prevData) =>
                prevData.filter((user) => user.id !== formData.id)
            );
        } catch (error) {
            console.error("Fehler beim Löschen:", error);
            alert("Fehler beim Löschen des Benutzers.");
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        // Reset formData auf leere Werte
        setFormData({
            id: "",
            salutation: "",
            title: "",
            lastName: "",
            firstName: "",
            emailAddress: "",
            password: "",
            street: "",
            houseNumber: "",
            postalCode: "",
            phoneNumber: "",
            city: "",
            country: "",
            dateOfBirth: "",
            placeOfBirth: "",
            bankCode: "",
            iban: "",
            description: "",
            picture: "",
            taxId: "",
            hobbies: "",
            zoomLink: "",
        });
    };

    return (
        <div className="page">
            <h1>Admin Bereich</h1>
            <div>
                {/* Buttons, um Daten vom Backend zu laden */}
                <button onClick={() => fetchData("students")}>Show all Students</button>
                <button onClick={() => fetchData("tutors")}>Show all Tutors</button>
                <button onClick={() => fetchData("entreprise")}>Show all Enterprises</button>
                <button onClick={() => fetchData("finance")}>Show all Finance</button>
                <button onClick={() => fetchData("managers")}>Show all Managers</button>
                <button onClick={() => fetchData("admins")}>Show all Admins</button>
            </div>
            <div>
                {/* Suchfeld */}
                <input
                    type="text"
                    placeholder="Suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ margin: "10px 0", padding: "5px", width: "300px" }}
                />
            </div>
            <div>
                <ul>
                    {filteredData.map((user) => (
                        <li
                            key={user.id}
                            style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
                        >
                            <span style={{ flex: 3 }}>{user.title}</span>
                            <span style={{ flex: 3 }}>{user.lastName}</span>
                            <span style={{ flex: 3 }}>{user.firstName}</span>
                            <button style={{ flex: 2 }} onClick={() => handleVerwaltenClick(user)}>
                                Verwalten
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Modal zur Bearbeitung und Löschung */}
            {isModalOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            background: "white",
                            padding: "20px",
                            borderRadius: "10px",
                            width: "600px",
                            maxHeight: "80vh",
                            overflowY: "auto",
                        }}
                    >
                        <h2>Benutzerdaten bearbeiten</h2>
                        <form>
                            {Object.entries(formData).map(([key, value]) => (
                                <div key={key} style={{ marginBottom: "10px" }}>
                                    <label>
                                        <strong>{key}</strong>
                                    </label>
                                    <input
                                        type="text"
                                        value={value || ""}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                                        disabled={key === "id"} // ID nicht editierbar
                                    />
                                </div>
                            ))}
                        </form>
                        <div
                            style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}
                        >
                            <button onClick={handleSave}>Speichern</button>
                            <button onClick={handleDelete} style={{ backgroundColor: "#ff4d4d", color: "white" }}>
                                Benutzer löschen
                            </button>
                            <button onClick={closeModal}>Abbrechen</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminSeite;
