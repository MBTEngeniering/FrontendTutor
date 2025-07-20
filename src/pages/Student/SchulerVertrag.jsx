import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import ApiService from "../../api/ApiService.js";
import {useNavigate} from "react-router-dom";

const SchuelerVertrag = ({ user }) => {
    const [signDate, setSignDate] = useState("");
    const [signName, setSignName] = useState("");
    const [isActive, setIsActive] = useState(user.accountActive); // Lokaler Status
    const navigate = useNavigate();

    useEffect(() => {
        const today = new Date().toISOString().split("T")[0];
        setSignDate(today);
        setSignName(`${user.lastName} ${user.firstName}`.trim());
    }, [user]);
    const updateUser = async (tutor) => {

        const tutorId = tutor.id;
        try {

            const responseTutor = await ApiService.get(`/api/allusers/${tutorId}`);
            const schowTutor = responseTutor.data;
            schowTutor.accountActive= true;
                await ApiService.put(`/api/allusers/${tutorId}`, schowTutor);
                alert("User erfolgreich upgedate")

        } catch (error) {
            alert("Fehler beim Laden des Benutzers:", error);

        }

    };
    const handleConfirm = async () => {
        try {
            setIsActive(true);
            updateUser(user);
            navigate("/login");
        } catch (error) {
            console.error("Fehler:", error);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF({
            unit: "mm",
            format: "a4",
        });

        const margin = 10;
        const pageHeight = doc.internal.pageSize.height;
        let y = margin;

        const addWrappedText = (text) => {
            const lines = doc.splitTextToSize(text, 180);
            lines.forEach((line) => {
                if (y > pageHeight - 10) {
                    doc.addPage();
                    y = margin;
                }
                doc.text(line, margin, y);
                y += 7;
            });
            y += 3;
        };

        doc.setFontSize(12);

        addWrappedText("Schülervertrag für die Nutzung der Online-Lernplattform");
        addWrappedText("zwischen");
        addWrappedText(`Name der Schule / Plattform: Fair study`);
        addWrappedText(`Name des Schülers: ${user.lastName} ${user.firstName}`);

        addWrappedText("1. Zweck");
        addWrappedText(
            "Die Online-Lernplattform dient der Durchführung von Unterrichtsstunden im Rahmen der Nachhilfe / Lernförderung."
        );

        addWrappedText("2. Buchung und Bezahlung");
        addWrappedText(
            "• Der Schüler bucht Unterrichtsstunden im Voraus.\n• Die Bezahlung erfolgt vor Beginn der ersten Stunde.\n• Es können folgende Pakete gebucht werden:\n  Einzelstunde: 30 €, gültig 1 Monat\n  4er-Paket: 116 €, gültig 2 Monate\n  8er-Paket: 224 €, gültig 3 Monate\n  12er-Paket: 324 €, gültig 4 Monate\n  20er-Paket: 500 €, gültig 5 Monate\n  25er-Paket: 600 €, gültig 6 Monate\n  50er-Paket: 1.100 €, gültig 12 Monate"
        );

        addWrappedText("3. Probestunde");
        addWrappedText(
            "Fair study darf für Werbezwecke die erste Einheit mit einem neuen Schüler als Probestunde anbieten. Dein Stundenpreis wird hierfür auf 9,99 € gesenkt."
        );

        addWrappedText("4. Terminabsagen und Nichtteilnahme");
        addWrappedText(
            "• Vereinbarte Stunden müssen mindestens 10 min vorher abgesagt oder verschoben werden.\n• Bei späterer Absage oder Nichterscheinen gilt die Stunde als stattgefunden und wird voll berechnet.\n• Nicht genutzte Stunden innerhalb der Gültigkeitsdauer verfallen. Eine Rückerstattung ist ausgeschlossen."
        );

        addWrappedText("5. Pflichten des Schülers");
        addWrappedText(
            "• Die Zugangsdaten geheim zu halten.\n• Die Plattform ausschließlich für Lernzwecke zu verwenden.\n• Keine beleidigenden oder unangemessenen Inhalte zu teilen.\n• Andere Nutzer respektvoll zu behandeln.\n• Nur den eigenen Account zu verwenden."
        );

        addWrappedText("6. Datenschutz");
        addWrappedText(
            "Der Schüler erklärt sich damit einverstanden, dass personenbezogene Daten zum Zwecke der Kursabwicklung gespeichert und verarbeitet werden."
        );

        addWrappedText("7. Gültigkeit & Kündigung");
        addWrappedText(
            "Der Vertrag gilt für die Dauer der gebuchten Pakete. Eine ordentliche Kündigung ist während der Laufzeit ausgeschlossen."
        );

        addWrappedText("8. Salvatorische Klausel");
        addWrappedText(
            "Sollten einzelne Bestimmungen dieses Vertrags unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt."
        );

        addWrappedText(`Ort, Datum: ${signDate}`);
        addWrappedText(`Unterschrift (Name): ${signName}`);

        doc.save("Schuelervertrag.pdf");
    };

    return (
        <div>
            <h3>Schülervertrag für die Nutzung der Online-Lernplattform</h3>
            <p>zwischen</p>
            <p>
                <strong>Name der Schule / Plattform:</strong> ___Fair study__________________
            </p>
            <p>
                <strong>Name des Schülers:</strong> {user.lastName} {user.firstName}
            </p>

            <h4>1. Zweck</h4>
            <p>
                Die Online-Lernplattform dient der Durchführung von Unterrichtsstunden im
                Rahmen der Nachhilfe / Lernförderung.
            </p>

            <h4>2. Buchung und Bezahlung</h4>
            <ul>
                <li>Der Schüler bucht Unterrichtsstunden im Voraus.</li>
                <li>Die Bezahlung erfolgt vor Beginn der ersten Stunde.</li>
                <li>Es können folgende Pakete gebucht werden:</li>
                <ul>
                    <li>Einzelstunde: 30 €, gültig 1 Monat</li>
                    <li>4er-Paket: 116 €, gültig 2 Monate</li>
                    <li>8er-Paket: 224 €, gültig 3 Monate</li>
                    <li>12er-Paket: 324 €, gültig 4 Monate</li>
                    <li>20er-Paket: 500€, gültig 5 Monate</li>
                    <li>25er-Paket: 600 €, gültig 6 Monate</li>
                    <li>50er-Paket: 1.100 €, gültig 12 Monate</li>
                </ul>
            </ul>

            <h4>3. Probestunde</h4>
            <p>
                Fair study darf für Werbezwecke die erste Einheit mit einem neuen Schüler als
                Probestunde anbieten. Dein Stundenpreis wird hierfür auf 9,99 € gesenkt.
            </p>

            <h4>4. Terminabsagen und Nichtteilnahme</h4>
            <ul>
                <li>
                    Vereinbarte Stunden müssen mindestens 10 min vorher abgesagt oder verschoben
                    werden.
                </li>
                <li>
                    Bei späterer Absage oder Nichterscheinen gilt die Stunde als stattgefunden
                    und wird voll berechnet.
                </li>
                <li>
                    Nicht genutzte Stunden innerhalb der Gültigkeitsdauer verfallen. Eine
                    Rückerstattung ist ausgeschlossen.
                </li>
            </ul>

            <h4>5. Pflichten des Schülers</h4>
            <ul>
                <li>Die Zugangsdaten geheim zu halten.</li>
                <li>Die Plattform ausschließlich für Lernzwecke zu verwenden.</li>
                <li>Keine beleidigenden oder unangemessenen Inhalte zu teilen.</li>
                <li>Andere Nutzer respektvoll zu behandeln.</li>
                <li>Nur den eigenen Account zu verwenden.</li>
            </ul>

            <h4>6. Datenschutz</h4>
            <p>
                Der Schüler erklärt sich damit einverstanden, dass personenbezogene Daten zum
                Zwecke der Kursabwicklung gespeichert und verarbeitet werden.
            </p>

            <h4>7. Gültigkeit & Kündigung</h4>
            <p>
                Der Vertrag gilt für die Dauer der gebuchten Pakete. Eine ordentliche Kündigung
                ist während der Laufzeit ausgeschlossen.
            </p>

            <h4>8. Salvatorische Klausel</h4>
            <p>
                Sollten einzelne Bestimmungen dieses Vertrags unwirksam sein, bleibt die
                Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>

            <div style={{ marginTop: "20px" }}>
                <label>
                    Ort, Datum:&nbsp;
                    <input type="text" value={signDate} disabled />
                </label>
                <br />
                <br />
                <p>
                    <strong>Name des Schülers:</strong> {user.lastName} {user.firstName}
                </p>
                <p>Hiermit bestätige ich, dass ich den Vertrag gelesen habe.</p>

                {!isActive && (
                    <button
                        className="action-button"
                        onClick={handleConfirm}
                        disabled={signName.trim() === ""}
                    >
                        Bestätigen und Senden
                    </button>
                )}
            </div>

            <button
                className="action-button"
                onClick={downloadPDF}
                style={{ marginTop: "20px" }}
            >
                Vertrag herunterladen
            </button>
        </div>
    );
};

export default SchuelerVertrag;
