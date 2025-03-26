import React, { useState } from "react";

function Lehrer() {
    const [selectedSubject, setSelectedSubject] = useState("");
    const [subjects, setSubjects] = useState([]);

    const handleAddSubject = () => {
        if (selectedSubject && !subjects.includes(selectedSubject)) {
            setSubjects([...subjects, selectedSubject]);
            setSelectedSubject("");
        }
    };

    const handleRemoveSubject = (subjectToRemove) => {
        setSubjects(subjects.filter(subject => subject !== subjectToRemove));
    };

    return (
        <div className="page p-10 max-w-lg mx-auto bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Lehrer werden</h2>
            <form className="space-y-6">
                <div className="space-y-2">
                    <label className="block font-semibold">Anrede </label>
                    <select className="w-full border p-3 rounded" required>
                        <option value="">Bitte wählen</option>
                        <option value="Herr">Herr</option>
                        <option value="Frau">Frau</option>
                        <option value="Divers">Divers</option>
                    </select>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Titel </label>
                    <input type="text" className="w-full border p-3 rounded"/><br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Name </label>
                    <input type="text" className="w-full border p-3 rounded" required/>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Vorname </label>
                    <input type="text" className="w-full border p-3 rounded" required/>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">E-Mail </label>
                    <input type="email" className="w-full border p-3 rounded" required/>
                </div>
                <br/><br/>
                <div className="space-y-2">
                    <label className="block font-semibold">Passwort </label>
                    <input type="password" className="w-full border p-3 rounded" required/>
                </div>
                <br/><br/>
                <div className="space-y-2">
                    <label className="block font-semibold">Passwort wiederholen </label>
                    <input type="password" className="w-full border p-3 rounded" required/>
                </div>
                <br/><br/>
                <div className="space-y-2">
                    <label className="block font-semibold">Straße </label>
                    <input type="text" className="w-full border p-3 rounded" required/>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Hausnummer </label>
                    <input type="text" className="w-full border p-3 rounded" required/>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Postleitzahl </label>
                    <input type="text" className="w-full border p-3 rounded" required/>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Stadt </label>
                    <input type="text" className="w-full border p-3 rounded" required/>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Land </label>
                    <input type="text" className="w-full border p-3 rounded" required/>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Telefonnummer </label>
                    <input type="tel" className="w-full border p-3 rounded" required/>
                    <br/><br/>
                </div>
                <div className="space-y-2">
                    <label className="block font-semibold">Fächer </label>
                    <select
                        className="w-full border p-3 rounded"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                    >
                        <option value="">Bitte wählen</option>
                        <option value="Mathematik">Mathematik</option>
                        <option value="Physik">Physik</option>
                        <option value="Französisch">Französisch</option>
                        <option value="Englisch">Englisch</option>
                        <option value="Biologie">Biologie</option>
                    </select>
                    <br/><br/>
                    <button
                        type="button"
                        className="mt-3 p-3 bg-blue-500 text-white rounded w-full"
                        onClick={handleAddSubject}
                    >
                        Fach hinzufügen
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
                <div className="flex space-x-4 mt-6 justify-between">
                    <button type="submit" className="p-3 bg-green-500 text-white rounded w-1/2">Registrieren</button>
                    <button type="button" className="p-3 bg-red-500 text-white rounded w-1/2">Abbrechen</button>
                </div>
            </form>
        </div>
    );
}

export default Lehrer;
