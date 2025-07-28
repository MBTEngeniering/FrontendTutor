import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService.js";

const MeinGehalt = ({ TutorId }) => {
    // const [gesamtVerdienst, setGesamtVerdienst] = useState(0);
    // const [verdienListe, setVerdienListe] = useState([]);
    //
    // // Funktion zur Gehaltsabrechnung
    // const GehaltAbrechnung = async () => {
    //     try {
    //         // 1. Alle Termine des Tutors holen
    //         const response = await ApiService.get(`/api/public/appointments/tutor/${TutorId}`);
    //         const appointments = response.data || [];
    //
    //
    //         const ungewerteTermine = appointments.filter((a) => a.isBewertet === false);
    //
    //
    //         for (const termin of ungewerteTermine) {
    //             await ApiService.post(
    //                 `/api/public/verdientabelle/create?tutorId=${TutorId}&appointmentId=${termin.id}`
    //             );
    //
    //
    //             const updatedTermin = { ...termin, isBewertet: true };
    //             await ApiService.put(`/api/public/appointments/${termin.id}`, updatedTermin);
    //         }
    //     } catch (error) {
    //         console.error("Fehler bei GehaltAbrechnung:", error);
    //     }
    // };
    //
    // // Funktion zum Laden des Gesamtverdienstes
    // const fetchGesamtVerdienst = async () => {
    //     try {
    //         const response = await ApiService.get(`/api/public/verdien/tutor/${TutorId}`);
    //         const verdienst = response.data.gesamtVerdient;
    //         setGesamtVerdienst(verdienst || 0);
    //     } catch (error) {
    //         console.error("Fehler beim Laden des Gesamtverdienstes:", error);
    //         setGesamtVerdienst(0);
    //     }
    // };
    //
    // // Funktion zum Laden der Verdienstliste
    // const fetchVerdienListe = async () => {
    //     try {
    //         const response = await ApiService.get(`/api/public/verdientabelle/tutor/${TutorId}`);
    //         setVerdienListe(response.data || []);
    //     } catch (error) {
    //         console.error("Fehler beim Laden der Verdienstliste:", error);
    //         setVerdienListe([]);
    //     }
    // };
    //
    // // useEffect: GehaltAbrechnung ausführen und Daten laden, wenn TutorId sich ändert
    // useEffect(() => {
    //     if (!TutorId) return;
    //
    //     const loadData = async () => {
    //         await GehaltAbrechnung();      // Verdienstabrechnung durchführen
    //         await fetchGesamtVerdienst();  // Gesamtverdienst aktualisieren
    //         await fetchVerdienListe();     // Verdienstliste aktualisieren
    //     };
    //
    //     loadData();
    // }, [TutorId]);
    //
    // return (
    //     <div style={{ display: "flex", gap: "20px" }}>
    //         {/* Linke Spalte */}
    //         <div style={{ flex: 1, border: "1px solid #ccc", padding: "10px" }}>
    //             <h3>Gesamtverdienst</h3>
    //             <p>
    //                 <strong>{gesamtVerdienst} €</strong>
    //             </p>
    //         </div>
    //
    //         {/* Rechte Spalte */}
    //         <div style={{ flex: 2, border: "1px solid #ccc", padding: "10px" }}>
    //             <h3>Verdienste im Detail</h3>
    //             {verdienListe.length === 0 ? (
    //                 <p>Keine Verdienst-noch.</p>
    //             ) : (
    //                 <table style={{ width: "100%", borderCollapse: "collapse" }}>
    //                     <thead>
    //                     <tr>
    //                         <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
    //                             Appointment ID
    //                         </th>
    //                         <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
    //                             Student ID
    //                         </th>
    //                         <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
    //                             Hourly ID
    //                         </th>
    //                         <th style={{ borderBottom: "1px solid #ddd", padding: "8px" }}>
    //                             Status
    //                         </th>
    //                     </tr>
    //                     </thead>
    //                     <tbody>
    //                     {verdienListe.map((verdien) => (
    //                         <tr key={verdien.appointementId}>
    //                             <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>
    //                                 {verdien.appointementId}
    //                             </td>
    //                             <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>
    //                                 {verdien.studentId}
    //                             </td>
    //                             <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>
    //                                 {verdien.hourlyId}
    //                             </td>
    //                             <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>
    //                                 {verdien.status}
    //                             </td>
    //                         </tr>
    //                     ))}
    //                     </tbody>
    //                 </table>
    //             )}
    //         </div>
    //     </div>
    // );
};

export default MeinGehalt;
