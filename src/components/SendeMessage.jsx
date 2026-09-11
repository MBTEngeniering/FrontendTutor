import React from "react";
import ApiService  from "../api/ApiService.js";

const SendeMessage = ({ senderId, destinationId, messageBody }) => {
    const sendMessage = async () => {
        try {
            // 1. Lade Sender und Empfänger
            const [senderRes, empfaengerRes] = await Promise.all([
                ApiService.get(`/api/allusers/${senderId}`),
                ApiService.get(`/api/allusers/${destinationId}`),
            ]);

            const sender = senderRes.data;
            const empfaenger = empfaengerRes.data;

            const senderMessages = sender.message || [];
            const empfaengerMessages = empfaenger.message || [];

            // 2. Finde gemeinsamen Post (falls vorhanden)
            const gemeinsamePostId = senderMessages.find(id =>
                empfaengerMessages.includes(id)
            );

            if (!gemeinsamePostId) {
                // 3. Keine gemeinsame Nachricht → Neuen Post erstellen
                const newPostRes = await ApiService.post("/api/public/post/save", {
                    senderId,
                    empfaengerId: destinationId,
                    messageBody,
                });

                const newPost = newPostRes.data;

                // Post-ID in beiden Usern aktualisieren
                const updatedSender = {
                    ...sender,
                    message: [...senderMessages, newPost.id],
                };

                const updatedEmpfaenger = {
                    ...empfaenger,
                    message: [...empfaengerMessages, newPost.id],
                };

                // Benutzer aktualisieren
                await Promise.all([
                    ApiService.put(`/api/allusers/${senderId}`, updatedSender),
                    ApiService.put(`/api/allusers/${destinationId}`, updatedEmpfaenger),
                ]);

                console.log("Neue Nachricht gesendet und Benutzer aktualisiert.");
            } else {
                // 4. Nachricht existiert schon → Post updaten
                await ApiService.put(`/api/public/post/update/${gemeinsamePostId}`, {
                    senderId,
                    empfaengerId: destinationId,
                    messageBody,
                });

                console.log("Bestehende Nachricht wurde aktualisiert.");
            }
        } catch (error) {
            console.error("Fehler beim Senden der Nachricht:", error);
        }
    };

    return (
        <button onClick={sendMessage}>
            Nachricht senden
        </button>
    );
};

export default SendeMessage;
