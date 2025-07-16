import React, { useEffect, useState } from 'react';
import ApiService from "../api/ApiService.js";

const MeinGehalt = ({ TutorId }) => {
    const [gesamtVerdienst, setGesamtVerdienst] = useState(0);
    const [verdienListe, setVerdienListe] = useState([]);

    useEffect(() => {
        if (!TutorId) return;

        const fetchGesamtVerdienst = async () => {
            try {
                const response = await ApiService.get(`/api/public/verdien/tutor/${TutorId}`);
                const verdienst = response.data.gesamtVerdient;
                setGesamtVerdienst(verdienst || 0);
            } catch (error) {
                console.error('Fehler beim Laden des Gesamtverdienstes:', error);
                setGesamtVerdienst(0);
            }
        };

        const fetchVerdienListe = async () => {
            try {
                const response = await ApiService.get(`/api/public/verdientabelle/tutor/${TutorId}`);
                setVerdienListe(response.data || []);
            } catch (error) {
                console.error('Fehler beim Laden der Verdienstliste:', error);
                setVerdienListe([]);
            }
        };

        fetchGesamtVerdienst();
        fetchVerdienListe();
    }, [TutorId]);

    return (
        <div style={{ display: 'flex', gap: '20px' }}>
            {/* Linke Spalte */}
            <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
                <h3>Gesamtverdienst</h3>
                <p>Tutor ID: {TutorId}</p>
                <p><strong>{gesamtVerdienst} €</strong></p>
            </div>

            {/* Rechte Spalte */}
            <div style={{ flex: 2, border: '1px solid #ccc', padding: '10px' }}>
                <h3>Verdienste im Detail</h3>
                {verdienListe.length === 0 ? (
                    <p>Keine Verdienst-noch.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr>
                            <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Appointment ID</th>
                            <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Student ID</th>
                            <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Hourly ID</th>
                            <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Status</th>

                        </tr>
                        </thead>
                        <tbody>
                        {verdienListe.map((verdien) => (
                            <tr key={verdien.appointmentId}>
                                <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{verdien.appointmentId}</td>
                                <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{verdien.studentId}</td>
                                <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{verdien.hourlyId}</td>
                                <td style={{ borderBottom: '1px solid #eee', padding: '8px' }}>{verdien.status}</td>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MeinGehalt;
