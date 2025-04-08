import React, { useState, useEffect } from "react";

function SchuelerSeite() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [avatar, setAvatar] = useState(null);
    const [contracts, setContracts] = useState([]);
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);


    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const openContractModal = () => {
        setIsContractModalOpen(true);
    };

    const closeContractModal = () => {
        setIsContractModalOpen(false);
    };

    const handleNewContract = () => {
        // Hier könnte Logik für das Erstellen eines neuen Vertrags hinzukommen
        console.log("Neuen Vertrag abschließen");
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-between w-full p-4">
                <div className="flex items-center space-x-4">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img
                                src={avatar || "path_to_default_avatar_image"}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </label>
                    <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                </div>
            </div>

            <div className="flex flex-col items-center mt-10 space-y-4">
                <ul className="space-y-4 list-none p-0 w-full">
                    <button className="bg-blue-500 text-white px-6 py-3 rounded w-64 h-12 border-none focus:outline-none">
                        Postfach
                    </button>

                    <button className="bg-blue-500 text-white px-6 py-3 rounded w-64 h-12 border-none focus:outline-none">
                        Studienübersicht
                    </button>

                    <button className="bg-blue-500 text-white px-6 py-3 rounded w-64 h-12 border-none focus:outline-none">
                        Kalender
                    </button>

                    <button className="bg-blue-500 text-white px-6 py-3 rounded w-64 h-12 border-none focus:outline-none">
                        Meine Lehrer
                    </button>

                    <button className="bg-blue-500 text-white px-6 py-3 rounded w-64 h-12 border-none focus:outline-none">
                        Meine Stunde
                    </button>

                    <button className="bg-blue-500 text-white px-6 py-3 rounded w-64 h-12 border-none focus:outline-none">
                        Support
                    </button>

                    <button
                        className="bg-blue-500 text-white px-6 py-3 rounded w-64 h-12 border-none focus:outline-none"
                        onClick={openContractModal}
                    >
                        Mein Vertrag
                    </button>

                    <button className="bg-blue-500 text-white px-6 py-3 rounded w-64 h-12 border-none focus:outline-none">
                        Meine Zahlung
                    </button>

                    <button className="bg-blue-500 text-white px-6 py-3 rounded w-64 h-12 border-none focus:outline-none">
                        Mein Profil
                    </button>

                    <button className="bg-blue-500 text-white px-6 py-3 rounded w-64 h-12 border-none focus:outline-none">
                        Lehrer suchen
                    </button>
                </ul>
            </div>

            {/* Modal für Verträge */}
            {isContractModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Mein Vertrag</h2>
                        {contracts.length === 0 ? (
                            <p>Sie haben noch keinen Vertrag abgeschlossen.</p>
                        ) : (
                            <ul>
                                {contracts.map((contractId, index) => (
                                    <li key={index} className="mb-2">
                                        Vertrag ID: {contractId}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-4 flex space-x-4">
                            <button
                                onClick={closeContractModal}
                                className="bg-gray-500 text-white px-6 py-3 rounded w-32"
                            >
                                Schließen
                            </button>
                            <button
                                onClick={handleNewContract}
                                className="bg-blue-500 text-white px-6 py-3 rounded w-32"
                            >
                                Neuen Vertrag abschließen
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SchuelerSeite;
