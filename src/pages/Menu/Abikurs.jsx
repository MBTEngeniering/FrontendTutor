import React, { useEffect } from "react";
import { useAuth } from "../../context/UseAuth.jsx";

const Abikurs = () => {

  const {user} = useAuth();

  useEffect(() => {
    console.dir(user)
  }, [user]);

  return (
        <div className="who-we-are-container">
            <div className="container who-we-are-content">
                <h1 className="who-we-are-title"></h1>
                
               <div className="who-we-are-section">
                 <h2 className="section-title">Abikurs</h2>


               <p className="section-text">Steht ihr kurz vor der Abi bzw. Matura-Prüfung und sucht Unterstützung beim Aufarbeiten von Lücken sowie der Wiederholung und der Übung der möglichen Prüfungsthemen?</p>
               <p className="section-text">Unsere Tutoren unterstützen euch, dass ihr euch optimal auf die Prüfungen vorbereiten könnt.</p>
               <p className="section-text"><span class="fair">Unsere aktuellen Abi/Matura Stundenpakete:</span></p>
               <p className="section-text">160 € für 8 Einheiten <span class="section-text-small">(50 Minuten je Einheit)</span> in den <span class="fair">Herbstferien 2025</span>     </p>
               <p className="section-text">160 € für 8 Einheiten<span class="section-text-small">(50 Minuten je Einheit)</span> in den <span class="fair">Weihnachtsferien 2025</span> </p>
               <p className="section-text">160 € für 8 Einheiten <span class="section-text-small">(50 Minuten je Einheit)</span> in den <span class="fair">Osterferien 2026</span>    </p>
                                             
               <p className="section-text-large">Jetzt anmelden und durchstarten!</p>

               <p className="section-text-small">Dieses ist ein spezielles Angebot, dass nur in der Ferienzeit genommen werden kann. 
                <br />Es ist ein fester Paketpreis, der nicht erstattungsfähig ist. 
                 <br />Es besteht kein Anspruch darauf, dass dem/der Schüler/in ein passender Tutor/in angeboten wird. 
                <br />Das Angebot ist vom vorhandenen Kontingent der verfügbaren Tutorenstunden abhängig.
                <br />Mit der Annahme der Buchung durch den Tutor verpflichtet sich der Tutor zur Verfügungstellung der Stunden und der 
                <br />Schüler/in zur Zahlung des gesamten Paketpreises.</p>
               
              </div>
            </div>
        </div>

  );
}

export default Abikurs;
