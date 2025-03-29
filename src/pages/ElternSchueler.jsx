import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function ElternSchueler() {

    const [selectedSubject, setSelectedSubject] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [countries, setCountries] = useState([]);
    const [formData, setFormData] = useState({
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

    });

    // Fächer aus dem Backend laden
    useEffect(() => {
        axios.get("http://localhost:8080/api/fach")
            .then(response => setAvailableSubjects(response.data))
            .catch(error => console.error("Fehler beim Laden der Fächer:", error));

        // Länder aus der API laden
        axios.get("https://restcountries.com/v3.1/all")
            .then(response => {
                // Länder alphabetisch sortieren
                const sortedCountries = response.data.sort((a, b) => {
                    const nameA = a.name.common.toLowerCase();
                    const nameB = b.name.common.toLowerCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
                setCountries(sortedCountries);
            })
            .catch(error => console.error("Fehler beim Laden der Länder:", error));
    }, []);

    const handleAddSubject = () => {
        if (selectedSubject && !subjects.includes(selectedSubject)) {
            setSubjects([...subjects, selectedSubject]);
            setSelectedSubject("");
        }
    };

    const handleRemoveSubject = (subjectToRemove) => {
        setSubjects(subjects.filter(subject => subject !== subjectToRemove));
    };
    const navigate = useNavigate();

    const handleRegistration = (e) => {
        e.preventDefault();

        const selectedFachIds = availableSubjects
            .filter(fach => subjects.includes(fach.fach))
            .map(fach => fach.id);
        if (formData.password !== formData.repeatPassword) {
            alert("Passwörter stimmen nicht überein!");
            return;
        }

        const studentData = {
            ...formData,
            accountActive: false,
            userRoleIds: [1],
            fachIds: selectedFachIds
        };

        axios.post("http://localhost:8080/api/students", studentData)
            .then(response => {
                alert("Du hast dich erfolgreich registriert!");
                navigate("/login");
            })
            .catch(error => {
                console.error("Fehler bei der Registrierung:", error);
                alert("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
            });
    };

    return (
        <div className="page p-10 max-w-lg mx-auto bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Sich Registrieren</h2>
            <form className="space-y-6">
                <div className="space-y-2">
                    <label className="block font-semibold">Anrede </label>
                    <select className="w-full border p-3 rounded" required value={formData.salutation || ""}
                            onChange={(e) => setFormData({...formData, salutation: e.target.value})}>
                        <option value="">Bitte wählen</option>
                        <option value="Herr">Herr</option>
                        <option value="Frau">Frau</option>
                        <option value="Divers">Divers</option>
                    </select>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Titel </label>
                    <input type="text" className="w-full border p-3 rounded" value={formData.title || ""}
                           onChange={(e) => setFormData({...formData, title: e.target.value})}/>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Name </label>
                    <input type="text" className="w-full border p-3 rounded" required value={formData.lastName || ""}
                           onChange={(e) => setFormData({...formData, lastName: e.target.value})}/>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Vorname </label>
                    <input type="text" className="w-full border p-3 rounded" required value={formData.firstName || ""}
                           onChange={(e) => setFormData({...formData, firstName: e.target.value})}/>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">E-Mail </label>
                    <input type="email" className="w-full border p-3 rounded" required
                           value={formData.emailAddress || ""}
                           onChange={(e) => setFormData({...formData, emailAddress: e.target.value})}/>
                </div>
                <br/><br/>
                <div className="space-y-2">
                    <label className="block font-semibold">Passwort </label>
                    <input type="password" className="w-full border p-3 rounded" required
                           value={formData.password || ""}
                           onChange={(e) => setFormData({...formData, password: e.target.value})}/>
                </div>
                <br/><br/>
                <div className="space-y-2">
                    <label className="block font-semibold">Passwort wiederholen </label>
                    <input type="password" className="w-full border p-3 rounded" required
                           value={formData.repeatPassword || ""}
                           onChange={(e) => setFormData({...formData, repeatPassword: e.target.value})}/>
                </div>
                <br/><br/>
                <div className="space-y-2">
                    <label className="block font-semibold">Straße </label>
                    <input type="text" className="w-full border p-3 rounded" required value={formData.street || ""}
                           onChange={(e) => setFormData({...formData, street: e.target.value})}/>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Hausnummer </label>
                    <input type="text" className="w-full border p-3 rounded" required value={formData.houseNumber || ""}
                           onChange={(e) => setFormData({...formData, houseNumber: e.target.value})}/>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Postleitzahl </label>
                    <input type="text" className="w-full border p-3 rounded" required value={formData.postalCode || ""}
                           onChange={(e) => setFormData({...formData, postalCode: e.target.value})}/>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Stadt </label>
                    <input type="text" className="w-full border p-3 rounded" required value={formData.city || ""}
                           onChange={(e) => setFormData({...formData, city: e.target.value})}/>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Land </label>
                    <input type="text" className="w-full border p-3 rounded" required value={formData.country || ""}
                           onChange={(e) => setFormData({...formData, country: e.target.value})}/>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Telefonnummer </label>
                    <input type="tel" className="w-full border p-3 rounded" required value={formData.phoneNumber || ""}
                           onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}/>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Fächer </label>
                    <select className="w-full border p-3 rounded" value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}>
                        <option value="">Bitte wählen</option>
                        {availableSubjects.map((fach, index) => (
                            <option key={index} value={fach.fach}>{fach.fach}</option>
                        ))}
                    </select>
                    <button type="button" className="mt-3 p-3 bg-blue-500 text-white rounded w-full"
                            onClick={handleAddSubject}>Fach hinzufügen
                    </button>
                    <div className="mt-3 space-x-2">
                        {subjects.map((subject, index) => (
                            <div key={index} className="inline-block">
                                                            <span className="p-2 bg-gray-200 rounded inline-block mr-2">
                                    {subject}
                                </span>
                                <button
                                    type="button"
                                    className="p-2 text-red-500"
                                    onClick={() => handleRemoveSubject(subject)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <br/><br/>
                <div className="flex space-x-4 mt-6 justify-between">
                    <button
                        type="submit"
                        className="p-3 bg-green-500 text-white rounded w-1/2"
                        onClick={handleRegistration}>
                        Registrieren
                    </button>
                    <button
                        type="button"
                        className="p-3 bg-red-500 text-white rounded w-1/2">
                        Abbrechen
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ElternSchueler;
