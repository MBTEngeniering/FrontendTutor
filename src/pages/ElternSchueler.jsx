import React from "react";

function ElternSchueler() {

    return (
        <div className="page p-10 max-w-lg mx-auto bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Registrieren</h2>
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
                <div className="flex space-x-4 mt-6 justify-between">
                    <button type="submit" className="p-3 bg-green-500 text-white rounded w-1/2">Registrieren</button>
                    <button type="button" className="p-3 bg-red-500 text-white rounded w-1/2">Abbrechen</button>
                </div>
            </form>
        </div>
    );
}

export default ElternSchueler;
