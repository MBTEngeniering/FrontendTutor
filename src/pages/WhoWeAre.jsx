import React from "react";
import '../styles/who-we-are.css';
import { Link } from "react-router-dom";

export default function WhoWeAre() {
  return (
    <div className="who-we-are-container">
            <div className="container who-we-are-content">
                <h1 className="who-we-are-title"></h1>
                
                <div className="who-we-are-section">
                    <h2 className="section-title">Wer wir sind?</h2>
                    <p className="section-text">
                       Wir sind eine Lernplattform, für die für Qualität und Fairness an oberster Stelle steht.
                    </p><p className="section-text">
                        Ein engagiertes Team von erfahrenen Turoren und Pädagogen setzt sich
                        leidenschaftlich für faire Bildungschancen einsetzen.
                    </p>
                    <p className="section-text">
                       Eine faire Lernumgebung für Schüler und Tutoren ist unser Schlüssel zum Erfolg.
                    </p>
                    <p className="section-text">
                       Die Schüler und Studenten werden zuverlässig und fachlich individuell in ihren Lernfortschritten von unseren Tutoren unterstützt, motiviert und begleitet.
                    </p>
                    <p className="section-text">
                       Unseren Tutoren bieten wir durch unsere Vermittlungsleistung und die zur Verfügungstellung unserer technischen Plattform eine faire und transparente Honorarzahlung für ihre engagierte Leistung.
                    </p>
                    <p className="section-text">
                       Alle Schüler haben unterschiedliche Bedürfnisse, wie der Nachhilfeunterricht gestaltet werden sollte.
                       Viele unserer Tutoren sind bereits seit vielen Jahren als Online-Tutoren tätig und kommen aus den verschiedensten Fachbereichen und Altersgruppen, mit unterschiedlichem Background und Lebenserfahrung.
          
                    </p>
                    <p className="section-text">
                       Sollte es widererwartend in der Schüler : Tutor-Kombination nicht funktionieren, werden wir uns umgehend um einen Ersatz kümmern.
                    </p>
                    
                    
                    <p className="section-text">
                       Unser Preis-Leistungs-Verhältnis ist unschlagbar!
                       Gekennzeichnet durch eine faire Preisgestaltung und die Möglichkeit bei unvorhergesehenen Ereignissen den Vertrag problemlos wieder lösen zu können.
                    </p>
                    <p className="section-text">
                       Anregung zur Verbesserung unserer Plattform und dem Lernangebot, können jederzeit gern über folgenden <Link to="/kontakt">Kontakt</Link>-Link gesendet werden.
                    </p>
                     <p className="section-text">
                       Wir freuen uns auf eine erfolgreiche gemeinsame Lernreise!
                    </p>
                     <p className="section-text">
                       Euer fairstudy-Team!
                    </p>                    
                </div>
              </div>

       </div>




  )
}
