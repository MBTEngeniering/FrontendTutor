import React, { useEffect, useState } from "react";
import ApiService from "../../api/ApiService.js";

const MeineTutoren = ({ userId }) => {
    const [meineTutoren, setMeineTutoren] = useState([]);

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

    return (
        <div style={{ padding: "20px" }}>
            <h2>Meine Lehrer</h2>
            {meineTutoren.length > 0 ? (
                <ul>
                    {meineTutoren.map(tutor => (
                        <li key={tutor.id}>
                            {tutor.firstName} {tutor.lastName}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Keine Lehrer gefunden.</p>
            )}
        </div>
    );
};

export default MeineTutoren;
