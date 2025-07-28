import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import ApiService from "../../api/ApiService.js";
import {useNavigate} from "react-router-dom";

const TutorVertrag = ({ user }) => {
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

        addWrappedText("TutorVertrag für die Nutzung der Online-Lernplattform");
        addWrappedText("zwischen");
        addWrappedText(`Name der Schule / Plattform: Fair study`);
        addWrappedText(`Name des Tutors: ${user.lastName} ${user.firstName}`);

        addWrappedText("1. Zweck");
        addWrappedText(
            "Die fairstudy fungiert als Vermittlungsplattform für Tutoren, die Online-Nachhilfe über unsere Plattform anbieten möchten. " +
            "Wir schließen im Auftrag unserer Tutoren mit interessierten Kunden entsprechende Verträge ab. Wir kümmern uns um den Betrieb der" +
            " Plattform und die Zurverfügungstellung von Ressourcen. Der folgende \"Freier Mitarbeitervertrag\" dient dazu, dass der Tutor fairstudy" +
            " mit der Vermittlung von Kunden beauftragt und die entgeltliche Nutzung der Plattform von fairstudy geregelt wird. Vereinbart wird wie folgt:"
        );

        addWrappedText("2. Vertragsgegenstand");
        addWrappedText(
            "- Das Vertragsverhältnis beginnt mit erfolgreicher Registrierung des Tutors und der Freigabe durch fairstudy.\n-" +
            "Die Registrierung ist kostenlos möglich.\n- Das Mindestalter des Tutors beträgt 18 Jahre.\n- Der Tutor beauftragt fairstudy mit" +
            " der Vertragsvermittlung potenzieller Kunden und der Bereitstellung einer hierfür erforderlichen Plattform. Ein Arbeitsverhältnis wird " +
            "nicht begründet.\n- fairstudy organisiert im Auftrag und im Namen des Tutors die vertragliche Lehrvereinbarung mit dem Kunden sowie die" +
            " Zahlungsabwicklung und die Entgegennahme von Kundenzahlungen.\n- fairstudy ist jedoch selbst Vertragspartei der zwischen Kunden und Tutor " +
            "abgeschlossenen Lehrverträge.\n- Für die steuerlichen und sozialversicherungsrechtlichen Belange sowie für die Gewerbeanmeldung trägt der Tutor " +
            "in eigener Verantwortung selbst Sorge.\n- Der Tutor ist frei darin, auch für andere Auftraggeber tätig zu sein. Ziffer VI. ist jedoch zu beachten.\n-" +
            "Der Tutor wird erst nach Hinterlegung aller notwendigen Angaben im System auf der Plattform freigeschaltet. Der Tutor hat sämtliche Informationen" +
            " vollständig und wahrheitsgemäß anzugeben und nachträglich bei Änderungen unverzüglich zu aktualisieren.\n- Es besteht kein Anspruch auf Registrierung " +
            "auf der Plattform. fairstudy behält sich das Recht vor, die Registrierung eines Tutors ohne Angabe von Gründen abzulehnen oder bereits registrierte Tutoren " +
            "ohne Angabe von Gründen von der Nutzung der Plattform auszuschließen. Der Tutor hat in diesen Fällen weder Anspruch auf Veröffentlichung des " +
            "Profils noch auf Schadensersatz."
        );

        addWrappedText("3. Erbringung der Leistung");
        addWrappedText(
            "- Der Tutor ist frei darin, die Auftragsanfragen der Kunden anzunehmen oder abzulehnen. Für die Gesellschaft begründet dieser Vertrag " +
            "keine Verpflichtung, Kunden in bestimmter Anzahl und Häufigkeit zu vermitteln.\n- Der Tutor unterliegt gegenüber der Gesellschaft keinem Weisungs-" +
            " und Direktionsrecht. Er ist in der Gestaltung seiner Arbeitsausübung frei und nicht in die Arbeitsorganisation der Gesellschaft eingebunden.\n- " +
            "Ein Auftrag gilt als angenommen, wenn der Tutor über die fairstudy Plattform die Durchführung von Nachhilfe/Training für einen bestimmten Kunden" +
            " oder die Übernahme einer bestimmten Onlinestunde angenommen hat. Der Tutor übernimmt den Auftrag für die gesamte zeitliche Dauer eines durch den " +
            "Kunden gebuchten Kurses (50 Minuten je Einheit). Über die Buchung optionaler Zusatzstunden durch Kunden entscheidet der Tutor nach eigenem Ermessen." +
            " Die Buchung erfolgt ausschließlich über das auf der Plattform integrierte Kalendersystem.\n- Der Tutor führt die im Rahmen dieses Vertrages akquirierten " +
            "Aufträge mit der Sorgfalt eines ordentlichen Nachhilfelehrers/Trainers in eigener unternehmerischer Verantwortung aus.\n- Der Tutor" +
            " hat selbständig dafür Sorge zu tragen, dass er über das notwendige Equipment, Datenvolumen und eine ausreichende Internetverbindung zur" +
            " Abhaltung einer Unterrichtseinheit verfügt.\n- Beide Vertragsparteien verpflichten sich zur gegenseitigen Kenntnisgabe, sofern sich bei der" +
            " Vertragsdurchführung Abwicklungsschwierigkeiten oder vorhersehbare Zeitverzögerungen ergeben sollten. Der Tutor ist nicht verpflichtet, die" +
            " Arbeitsleistung höchstpersönlich zu erbringen. Die Hinzuziehung eigener Mitarbeiter oder die Vergabe von Unteraufträgen muss der Gesellschaft" +
            " jedoch zuvor mitgeteilt werden. Der Tutor bleibt in diesem Fall gegenüber der Gesellschaft für die ordnungsgemäße Erfüllung der vertraglichen " +
            "Leistung verantwortlich.\n- Der Tutor ist in der Wahl von Ort und Zeit seiner Tätigkeit für die Gesellschaft frei, hat jedoch die im Rahmen der mit" +
            " den Kunden geschlossenen vertraglichen Vereinbarungen einzuhalten.\n- Der Tutor ist in der inhaltlichen Gestaltung seines Unterrichts frei, hält sich " +
            "jedoch an die mit dem Kunden vereinbarten Leistungsanforderungen.\n- Um eine ordnungsgemäße Disposition und Abwicklung des Unterrichts zu gewährleisten, " +
            "ist der Tutor verpflichtet, seine Termine im Kalendersystem der Gesellschaft zeitnah und ordnungsgemäß zu verwalten, vereinbarte Termine rechtzeitig " +
            "einzugeben oder bei Verhinderung freizugeben.\n- Gegenüber Angestellten der Gesellschaft hat der Tutor keine Weisungsbefugnis und ist nicht befugt," +
            " Erklärungen für oder gegen die Gesellschaft abzugeben oder entgegenzunehmen.\n- Der Tutor ist nicht befugt, Entgelte von Kunden zu erheben oder " +
            "entgegenzunehmen. Die Zahlungsabwicklung erfolgt ausschließlich über das Bezahlsystem von fairstudy."
        );

        addWrappedText("4. Vergütung");
        addWrappedText(
            "- Der Tutor erhält eine Vergütung von 15 € pro Einheit. Nach jeweils 50 Stunden Unterricht erhöht sich die Vergütung um 1 €, " +
            "bis maximal 20 € pro Stunde erreicht sind.\n- Für Probestunden werden 5 € bezahlt.\n- Mit den vorgenannten Vergütungen sind alle weiteren" +
            " Aufwendungen des Tutors abgegolten.\n- Ausgezahlt werden nur Stunden, die vom Kunden als „stattgefunden“ bestätigt wurden. Bestehen Reklamationen," +
            " erfolgt eine Auszahlung erst nach Klärung.\n- Der Tutor ist verpflichtet, am Ende jeder Unterrichtsstunde ein Feedback abzugeben. Nur dann gilt die" +
            " Stunde als gültig.\n- Das System erstellt automatisch eine Rechnung im Namen des Tutors. Diese wird zum 1. des Folgemonats erstellt und kann" +
            " im Login-Bereich heruntergeladen werden.\n- Der Tutor gibt fairstudy gegenüber eine Erklärung der eigenen Unternehmereigenschaft " +
            "ab (z.B. Kleinunternehmerregelung, Vorsteuerabzugsberechtigung). Dazu ist die Hinterlegung der persönlichen Steuer-ID zwingend erforderlich.\n- " +
            "Die Vergütung wird auf die vom Tutor genannte Bankverbindung überwiesen.\n- Fällige Steuern und Sozialabgaben erklärt und führt der Tutor selbst ab. " +
            "Der Tutor verpflichtet sich, fairstudy diesbezüglich schad- und klaglos zu halten.\n- Tutoren mit Wohnsitz außerhalb Deutschlands (innerhalb der EU) " +
            "müssen die speziellen Regelungen zum Reverse-Charge-Verfahren beachten. Eine Rücksprache mit einem Steuerberater wird empfohlen."
        );

        addWrappedText("5. Nutzung der Software");
        addWrappedText(
            "- Stellt fairstudy dem Tutor Software zur Verfügung, ist diese ausschließlich für die Vertragserfüllung zu nutzen. Eine private " +
            "oder andere gewerbliche Nutzung ist ausgeschlossen.\n- Der Tutor ist mit der Anwendung einer Berichtssoftware zur Missbrauchsabwehr " +
            "einverstanden.\n- Fairstudy stellt die Plattform an 7 Tagen die Woche, 24 Stunden zur Verfügung, garantiert aber keine ständige Verfügbarkeit." +
            " Wartungsarbeiten können mit Vorankündigung durchgeführt werden."
        );

        addWrappedText("6. Datenschutz und Datensicherheit");
        addWrappedText(
            "Die Gesellschaft und der Tutor beachten die einschlägigen datenschutzrechtlichen Vorschriften. Der Tutor nutzt personenbezogene Daten " +
            "von Schülern/Studenten ausschließlich zur Erfüllung seiner Tätigkeit. Der Tutor unterschreibt eine gesonderte Verpflichtungserklärung zum" +
            " Datengeheimnis und eine Auftragsverarbeitungsvereinbarung gemäß DSGVO. Bindet der Tutor Mitarbeiter oder Unterauftragnehmer ein, stellt " +
            "er sicher, dass diese dieselben Verpflichtungen übernehmen."
        );

        addWrappedText("7. Wettbewerb, Verschwiegenheit, Kundenschutz");
        addWrappedText(
            "- Der Tutor ist nicht exklusiv gebunden, benötigt jedoch bei Tätigkeit für direkte Wettbewerber die schriftliche Zustimmung " +
            "von fairstudy.\n- Der Tutor verpflichtet sich zur Verschwiegenheit über alle Geschäfts- und Betriebsgeheimnisse, auch nach Vertragsende.\n-" +
            " Kundendaten dürfen weder genutzt noch an Dritte weitergegeben werden.\n- Während der Vertragsdauer darf der Tutor keine Schüler direkt akquirieren" +
            " oder abwerben.\n- Verstöße werden mit einer Vertragsstrafe geahndet. Weitergehender Schadenersatz bleibt vorbehalten."
        );

        addWrappedText("8. Aufbewahrung und Rückgabe von Unterlagen");
        addWrappedText(
            "- Unterlagen sind sorgfältig und geschützt aufzubewahren.\n- Nach Vertragsende mit einem Schüler/Studenten sind Unterlagen " +
            "zurückzugeben oder zu vernichten. Ein Zurückbehaltungsrecht ist ausgeschlossen."
        );

        addWrappedText("9. Vertragsdauer und Kündigung");
        addWrappedText(
            "- Der Tutor nimmt die Tätigkeit mit Vertragsunterzeichnung auf.\n- Das Vertragsverhältnis kann mit einer Frist " +
            "von zwei Wochen gekündigt werden. Das Recht zur außerordentlichen Kündigung bleibt unberührt.\n- Kündigungen bedürfen der Textform." +
            " Ein Online-Kündigungsfeld im Profil kann vorgesehen werden.\n- Es entsteht kein Arbeitsverhältnis. Der Tutor bleibt unternehmerisch " +
            "selbstständig.\n- Der Tutor wird auf die Rentenversicherungspflicht hingewiesen (§ 2 S. 1 Nr. 1 SGB VI). Die Beiträge trägt der Tutor selbst."
        );

        addWrappedText("10. Nebenabreden und salvatorische Klausel");
        addWrappedText(
            "- Änderungen oder Nebenabreden bedürfen der Schriftform.\n- Sollten einzelne Bestimmungen unwirksam sein," +
            " bleibt die Gültigkeit der übrigen unberührt. Eine unwirksame Regelung wird durch eine wirtschaftlich möglichst gleichwertige ersetzt.\n- " +
            "Die jeweils gültige Fassung der AGB von fairstudy ist fester Vertragsbestandteil."
        );

        addWrappedText("11. Erfüllungsort und Gerichtsstand");
        addWrappedText(
            "- Es gilt deutsches Recht.\n- Ist der Tutor Kaufmann oder eine juristische Person des öffentlichen Rechts, ist München Gerichtsstand."
        );

        addWrappedText("12. Vertragsaushändigung");
        addWrappedText(
            "Nach Vertragsunterzeichnung erhalten beide Vertragsparteien eine Ausfertigung des Vertrages per E-Mail."
        );


        addWrappedText(`Ort, Datum: ${signDate}`);
        addWrappedText(`Unterschrift (Name): ${signName}`);

        doc.save("Schuelervertrag.pdf");
    };

    return (
        <div>
            <h3>Tutorvertrag für die Nutzung der Online-Lernplattform</h3>
            <p>zwischen</p>
            <p>
                <strong>Name der Schule / Plattform:</strong> ___Fair study__________________
            </p>
            <p>
                <strong>Name des Tutors:</strong> {user.lastName} {user.firstName}
            </p>

            <h4>1. Zweck</h4>
            <p>
                Die fairstudy fungiert als Vermittlungsplattform für Tutoren, die Online-Nachhilfe über unsere Plattform
                anbieten möchten.
                Wir schließen im Auftrag unserer Tutoren mit interessierten Kundenentsprechende Verträge ab. Wir kümmern
                uns um den
                Betrieb der Plattform und die zur Verfügungstellung von Resourcen. Der folgende "Freier
                Mitarbeitervertrag" dient dazu,
                dass der Tutor fairstudy mit der Vermittlung von Kunden zu beauftragen und die entgeltliche Nutzung der
                Plattform von f
                airstudy zu regeln. Vereinbart wird wie folgt:
            </p>
            <h4>2. Vertragsgegenstand</h4>
            <p>
                - Das Vertragsverhältnis beginnt mit erfolgreicher Registrierung des Tutors und der Freigabe durch
                fairstudy
                - Die Registrierung ist kostenlos möglich.
                - Das Mindestalter des Tutors beträgt 18 Jahre.
                - Der Tutor beauftragt fairstudy mit der Vertragsvermittlung potenzieller Kunden und der Bereitstellung
                einer hierfür erforderlichen Plattform.
                Ein Arbeitsverhältnis wird nicht begründet.
                - fairstudy organisiert im Auftrag und im Namen des Tutors die vertragliche Lehrvereinbarung mit dem
                Kunden sowie die Zahlungsabwicklung und die Entgegennahme von Kundenzahlungen
                - fairstudy ist jedoch selbst Vertragspartei der zwischen Kunden und Tutor abgeschlossenen Lehrverträge
                - Für die steuerlichen und sozialversicherungsrechtlichen Belange sowie für die Gewerbeanmeldung trägt
                der Tutor in eigener Verantwortung selbst Sorge.
                - Der Tutor ist frei darin, auch für andere Auftraggeber tätig zu sein. Ziffer VI. ist jedoch zu
                beachten.
                - Der Tutor wird erst nach Hinterlegung aller notwenigen Angaben im System auf der Plattform
                freigeschaltet. Der Tutor hat sämtliche Informationen vollständig
                und wahrheitsgemäß anzugeben und nachträglich bei allfälliger Änderung unverzüglich zu aktualisieren.
                - Es besteht kein Anspruch auf Registrierung auf der Plattform. fairstudy behält sich das Recht vor, die
                Registrierung eines Tutors ohne Angabe von Gründen abzulehnen
                oder bereits registrierte Tutoren ohne Angabe von Gründen von der Nutzung der Plattform auszuschließen
                Der Tutor hat in diesen Fällen weder keinen Anspruch
                auf Veröffentlichung des Profils noch auf Schadensersatz.

            </p>
            <h4>3. Erbringung der Leistung</h4>
            <p>
                - Der Tutor ist frei darin, die Auftragsanfragen der Kunden anzunehmen oder abzulehnen. Für die
                Gesellschaft begründet dieser Vertrag keine Verpflichtung, Kunden in bestimmter Anzahl und Häufigkeit zu
                vermitteln.
                - Der Tutor unterliegt gegenüber der Gesellschaft keinem Weisungs- und Direktionsrecht. Er ist in der
                Gestaltung seiner Arbeitsausübung frei. Er ist weiter nicht in die Arbeitsorganisation der Gesellschaft
                eingebunden.
                - Ein Auftrag gilt als angenommen, wenn der Tutor über die fairstudy Plattform die Durchführung von
                Nachhilfe/Training für eine(n) bestimmten Kunden oder die Übernahme einer bestimmten Onlinestunde
                angenommen hat. Der Tutor übernimmt den Auftrag für die gesamte zeitliche Dauer eines durch den Kunden
                gebuchten Kurses (50 Minuten je Einheit). Über die Buchung optionaler Zusatzstunden durch Kunden
                entscheidet der Tutor nach eigenem Ermessen. Die Buchung der Stunde erfolgt ausschließlich über das auf
                der Plattform integrierte Kalendersystem.
                - Der Tutor führt die im Rahmen dieses Vertrages akquirierten Aufträge mit der Sorgfalt eines
                ordentlichen Nachhilfelehrers/Trainers in eigener unternehmerischer Verantwortung aus.
                - Der Tutor hat selbständig dafür Sorge zu tragen, dass er über das notwendige Equipment, Datenvolumen
                und ausreichende Internetverbindung zur Abhaltung einer Unterrichtseinheit verfügt.
                - Beide Vertragsparteien verpflichten sich zur gegenseitigen Kenntnisgabe, sofern sich bei der
                Vertragsdurchführung Abwicklungsschwierigkeiten oder aber vorhersehbare Zeitverzögerungen ergeben
                sollten. Der Tutor ist nicht verpflichtet, die Arbeitsleistung höchstpersönlich zu erbringen. Die
                Hinzuziehung eigener Mitarbeiter oder die Vergabe von Unteraufträgen muss der Gesellschaft jedoch zuvor
                mitgeteilt werden. Der Tutor bleibt in diesem Fall gegenüber der Gesellschaft für die ordnungsgemäße
                Erfüllung der vertraglichen Leistung verantwortlich. Falls der Tutor sich der Hilfe von Erfüllungs- und
                Verrichtungsgehilfen bedient, ist er verpflichtet, deren fachliche Qualifikation zur Erfüllung des
                Vertrags sicherzustellen und seinen Erfüllungs- und Verrichtungsgehilfen gleichlautende Verpflichtungen
                aufgrund dieses Vertrags aufzuerlegen.
                - Der Tutor ist in der Wahl von Ort und Zeit seiner Tätigkeit für die Gesellschaft frei, hat jedoch die
                im Rahmen der mit den Kunden geschlossenen vertraglichen Vereinbarungen einzuhalten.
                - Der Tutor ist in der inhaltlichen Gestaltung seines Unterrichts frei. Er wird sich bei seinem
                Unterricht jedoch an die durch die mit dem Kunden vereinbarten Leistungsanforderungen halten.
                - Um eine ordnungsgemäße Disposition und Abwicklung der Durchführung von Nachhilfeunterricht / Training
                zu gewährleisten und zur Abwehr von wirtschaftlichem Schaden für die Gesellschaft ist der Tutor im
                Rahmen des Auftrages verpflichtet, seine Termine im Kalendersystem der Gesellschaft zeitnah und
                ordnungsgemäß zu verwalten, vereinbarte Termine rechtzeitig dort einzugeben, bei Verhinderung
                freizugeben etc.
                - Gegenüber den Angestellten der Gesellschaft hat der Tutor keine Weisungsbefugnis. Der Tutor ist auch
                nicht befugt, Erklärungen für und gegen die Gesellschaft abzugeben oder entgegenzunehmen.
                - Weiterhin ist der Tutor nicht befugt, Entgelte von Kunden zu erheben oder entgegenzunehmen. Die
                Zahlungsabwicklung aller über die von fairstudy vermittelten Unterrichtseinheiten erfolgt ausschließlich
                über das Bezahlsystem von fairstudy.

            </p>
            <h4>4. Vergütung</h4>
            <p>
                - Der Tutor enthält eine Vergüntung von 15 Euros pro Einheit.
                je 50 Stunde Untericht wird die vergüntung um 1 euron erhölt bis maximum 20 Euros die Stunde
                - Für Probe Stunde werden Tutor 5 Euros bezahlt
                - Mit den vorgenannten Vergütungen sind alle weiteren Aufwendungen des Tutors abgegolten.
                - Zur Auszahlung kommen alle Stunden, die vom Kunden als „stattgefunden“ bestätigt wurden. Bestehen
                Reklamationen zu einzelnen Stunden, erfolgt eine Auszahlung erst nach Klärung des Sachverhaltes und
                Einigung zwischen Kunden und Tutor. .
                - Der Tutor ist verpflichtet, Am ende jeden Unterricht ein feedback anzugeben. Die Stunde werden nur als gültig
                wenn ein feedback abgegeben ist
                - Das System erstellt automatisch eine Rechnung im Namen des Turors. Diese wird immer zum 1. des
                Folgemonats erstellt und kann im Login Bereich runtergeladen und überprüft werden.
                - Der Tutor gibt fairstudy gegenüber eine Erklärung der eigenen Unternehmereigenschaft ab (u.a.
                Kleinunternehmer nicht vorsteuerabzugsberechtigt, vorsteuerabzugsberechtigt und andere Formen). Hierzu
                ist die Hinterlegung der persönlichen SteuerID zwingend erforderlich.
                - Die Vergütung wird auf die vom Tutor genannte Bankverbindung überwiesen.
                - Fällige Steuer und Sozialversicherungsabgabe ist durch den Tutor zu erklären und abzuführen. Der Tutor
                verpflichtet sich diesbezüglich fairstudy vollständig Schad- und klaglos zu halten.
                - Tutoren mit steuerlichem Wohnsitz außerhalb Deutschlands, jedoch innerhalb der EU müssen die
                speziellen Regelungen zum Reverse-Charge-Verfahren beachten. Wir empfehlen hierfür die Hinzuziehung
                eines Steuerberaters/in im jeweiligen Mitgliedsstaat. Ebenfalls Tutoren aus Drittländern wird empfohlen
                Rücksprache mit einem lokalen Steuerberater/in zu halten.

            </p>


            <h4>5. Nutzung der Software</h4>
            <p>
                - Falls der Tutor zur Erfüllung seiner Leistung Zugang zu Software von der Gesellschaft zur Verfügung
                gestellt bekommt oder in Anspruch nimmt, ist er verpflichtet, solche Zugänge ausschließlich zur
                Erfüllung seiner hier beschriebenen Aufträge zu verwenden. Die Verwendung für private oder andere
                gewerbliche oder nichtgewerbliche Zwecke ist ausgeschlossen.
                - Auftragnehmer ist bezüglich der o.g. Software einverstanden, dass entsprechender Verwendungs-nachweis
                -ausschließlich zur Abwehr von Missbrauch und / oder Schäden für die Gesellschaft - in Form einer
                Berichtssoftware zur Anwendung kommt, aus der sich die Verwendung und der Verwender der o.g. Software
                nachvollziehen lässt.
                - Fairstudy stellt die Plattform ohne zeitliche Zugangsbeschränkung an 7 Tagen die Woche, 24 Stunden am
                Tag zur Verfügung. Aufgrund von unvorhergesehen Vorkommnissen garantiert fairstudy keine fehlerfreie
                Verfügbarkeit. fairstady übernimmt keine Gewähr, dass es nicht eventuell zu unvorhergesehenen Ausfällen
                der Plattform kommen kann. Ebenfalls behält sich fairstudy vor, die Plattform für Wartungsarbeiten vom
                Netz zu nehmen. Eine entsprechende Vorankündigung dieser Arbeiten wird rechtzeitig mitgeteilt.


            </p>


            <h4>6. Datenschutz und Datensicherheit</h4>
            <p>
                Die Gesellschaft und der Auftragnehmer beachten die einschlägigen datenschutzrechtlichen Vorschriften.
                Der Auftragnehmer wird personenbezogene Daten von Schülern und Studenten, die er bei der Erbringung
                seiner
                Leistungen verarbeitet oder zu denen er in diesem Rahmen Zugang hat, ausschließlich zum Zwecke seiner
                Tätigkeit für die Gesellschaft
                als Coach bzw. Trainer für Nachhilfe oder Training für Schüler und Studenten nutzen. Der Auftragnehmer
                wird hierzu vor Aufnahme seiner
                Tätigkeit eine gesonderte Verpflichtungserklärung auf das Datengeheimnis unterschreiben. Die
                Gesellschaft und der Auftragnehmer schließen
                zudem eine gesonderte Auftragsverarbeitungsvereinbarung gemäß Art. 28 Datenschutzgrundverordnung ab, die
                insbesondere das Weisungsrecht der
                Gesellschaft in Bezug auf den Umgang mit den personenbezogenen Daten und die technischen und
                organisatorischen Sicherheitsanforderungen an
                die Datenverarbeitung durch den Auftragnehmer festlegt. Bei der Einbindung weiterer Mitarbeiter oder von
                Unterauftragnehmern mit Zugriff auf
                die personenbezogenen Daten hat der Auftragnehmer dafür zu sorgen, dass diese ebenfalls eine
                Verpflichtungserklärung auf das Datengeheimnis
                unterschreiben und ihnen die Pflichten aus der Auftragsverarbeitungsvereinbarung entsprechend auferlegt
                werden.
            </p>

            <h4>7. Wettbewerb, Verschwiegenheitspflicht, Kundenschutz</h4>
            <p>
                - Der Tutor unterliegt keiner Ausschließlichkeitsbindung. Will der Tutor allerdings für einen
                unmittelbaren Wettbewerber des Auftraggebers tätig werden, bedarf dies der vorherigen schriftlichen
                Zustimmung des Auftraggebers.
                - Der Tutor verpflichtet sich, über alle ihm im Laufe seiner Tätigkeit für die Gesellschaft bekannt
                gewordenen und bekanntwerdenden Geschäfts- und Betriebsgeheimnisse der Gesellschaft Stillschweigen zu
                bewahren. Hierzu gehören v.a. auch schutzwürdige persönliche Verhältnisse von Vertragspartnern sowie
                Mitarbeitern und Strukturen der Gesellschaft. Diese Verpflichtung besteht auch nach Beendigung des
                Vertragsverhältnisses uneingeschränkt fort.
                - Der Tutor verpflichtet sich, keine Namen von Schülern / Studenten, Listen oder sonstige kundenbezogene
                Daten für eigene geschäftliche Zwecke zu verwenden oder diese an Dritte weiterzugeben.
                - Gleichzeitig ist dem Tutor für die Dauer des Auftragsverhältnisses verboten, unmittelbar selbst bzw.
                durch Mitarbeiter oder mittelbar über Dritte in geschäftlichen Kontakt zu den Schülern / Studenten, die
                bei der Gesellschaft in einem Vertragsverhältnis stehen oder gestanden haben, zu treten oder diese
                abzuwerben.
                - Für jeden Fall einer Zuwiderhandlung gegen eine der vorgenannten Bestimmungen zahlt der Auftragnehmer
                an die Gesellschaft eine Vertragsstrafe in Höhe einer Monatsvergütung basierend auf der durchschnittlich
                in den letzten 3 Monaten an Auftragnehmer gezahlten Auftragssumme. Dem Auftragnehmer bleibt der Nachweis
                gestattet, dass kein oder ein wesentlich geringerer Schaden entstanden ist. Ein weitergehender Schaden
                kann von der Gesellschaft geltend gemacht werden. In diesem Fall ist die Vertragsstrafe gemäß der §§ 341
                Abs. 2, 340 Abs. 2 BGB auf den weitergehenden Schadensersatz jedoch anzurechnen.
                - Das Verbreiten von Inhalten, die gegen persönlichkeitsrechtliche, urheberrechtliche oder
                strafrechtliche Bestimmungen verstoßen, die beleidigenden, verleumderischen, verfassungsfeindlichen,
                rassistischen, sexistischen, gewaltverherrlichenden, oder pornografischen Inhalt haben, ist dem Tutor
                untersagt. Für jeden Fall einer Zuwiderhandlung gegen die vorgenannte Bestimmung zahlt der Auftragnehmer
                an die Gesellschaft eine Vertragsstrafe in Höhe von drei Monatsvergütungen basierend auf der
                durchschnittlich in den letzten 3 Monaten an Auftragnehmer gezahlten Auftragssumme. Ein weitergehender
                Schaden kann von der Gesellschaft geltend gemacht werden. Die Gesellschaft wird strafrechtliche
                Maßnahmen bei entsprechenden Vergehen beantragen. Der Tutor verpflichtet sich fairstudy vollständig
                schad- und klaglos zu halten, wenn von Nutzern, anderen Lehrern oder Dritten wegen eingestellten und
                damit veröffentlichten Inhalten zivil- oder strafrechtlich, gerichtlich oder außergerichtlichen (z.B.
                Abmahnungen) in Anspruch genommen werden. Die Freistellung umfasst auch Straftaten, Schadenersatz und
                sämtliche Kosten der Rechtsverteidigung.


            </p>


            <h4>8. 	Aufbewahrung und Rückgabe von Unterlagen</h4>
            <p>
                -	Unterlagen, die der Tutor im Rahmen seiner freien Mitarbeit erhalten hat, sind von ihm sorgfältig und gegen die Einsichtnahme Dritter geschützt aufzubewahren.
                -	Nach Beendigung des Vertrages mit einem Schüler Studenten hat der Tutor die zurückzugeben / zu vernichten. Die Geltendmachung eines Zurückbehaltungsrechts ist ausgeschlossen.

            </p>

            <h4>9. Vertragsdauer und Kündigung</h4>
            <p>
                -	Der Tutor nimmt die Tätigkeit mit Unterzeichnung dieses Vertrages auf.
                -	Das Vertragsverhältnis kann von beiden Seiten mit einer Kündigungsfrist von zwei Wochen gekündigt werden.
                -	Das Recht zur außerordentlichen Kündigung bleibt hiervon unberührt.
                -	Jede Kündigung bedarf zu ihrer Wirksamkeit der Textform Hierfür vielleicht im Profil ein online Kündigungsfeld einrichten?
                -	Beide Vertragsparteien sind sich darüber einig, dass es mit Abschluss dieses Vertrages zu keinem Arbeitsverhältnis kommt. Eine Umgehung arbeitsrechtlicher
                oder arbeitsgesetzlicher Schutzvorschriften ist nicht beabsichtigt. Dem freien Mitarbeiter soll vielmehr die volle unternehmerische Entscheidungsfreiheit belassen werden. Eine über
                den Umfang dieser Vereinbarung hinausgehende persönliche, wirtschaftliche oder soziale Abhängigkeit wird nicht begründet.
                -	Der Tutor wird darauf hingewiesen, dass er der Rentenversicherungspflicht nach § 2 S. 1 Nr. 1 SGB VI unterliegt, sofern
                er nicht selbst versicherungspflichtige Arbeitnehmer beschäftigt. Die Beiträge sind vom Tutor selbst zu tragen gemäß § 169 Nr. 1 SGB VI.            </p>

            <h4>10. Nebenabreden und salvatorische Klausel</h4>
            <p>
                -	Nebenabreden und Änderungen des Vertrages bedürfen zu ihrer Wirksamkeit der Schriftform. Dieses Formerfordernis kann weder mündlich noch stillschweigend aufgehoben oder außer Kraft gesetzt werden.
                -	Sollten einzelne Bestimmungen des Vertrages einschließlich Allgemeinen und besonderen Geschäftsbedingungen ganz oder teilweise unwirksam sein oder werden, so wird hier durch die Gültigkeit der übrigen Bestimmungen nicht berührt. Die ganz oder teilweise unwirksame Regelung soll durch eine Regelung ersetzt werden, deren wirtschaftlicher Erfolg dem der unwirksamen möglichst nahekommt.
                -	Es gilt als vereinbart, dass die jeweilige gültige Fassung der AGB’s der Unternehmung fairstudy fester Bestandteil dieses Rahmenvertrages ist. Sollten sich aus diesem Vertrag Widersprüche zu den AGB’s ergeben, gehen die Regelungen der AGB’s vor.

            </p>

            <h4>11. Erfüllungsort und Gerichtsstand</h4>
            <p>
                -	Für sämtliche Rechtsbeziehungen zwischen der Gesellschaft und dem Tutor gilt deutsches Sachrecht.
                -	Ist der Tutor Kaufmann, eine juristische Person des öffentlichen Rechts oder ein öffentlich-rechtliches Sondervermögen, so ist ausschließlicher Gerichtsstand – soweit gesetzlich zulässig – für alle Streitigkeiten, die sich aus diesem Vertrag ergeben, München.

            </p>

            <h4>12.	Vertragsaushändigung</h4>
            <p>
                Jede der Vertragsparteien erhält automatisch nach der Vertragsunterzeichnung eine schriftliche Ausfertigung dieses Vertrages per E-Mail.
            </p>



            <div style={{marginTop: "20px"}}>
                <label>
                    Ort, Datum:&nbsp;
                    <input type="text" value={signDate} disabled/>
                </label>
                <br/>
                <br/>
                <p>
                    <strong>Name des Tutors:</strong> {user.lastName} {user.firstName}
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
                style={{marginTop: "20px"}}
            >
                Vertrag herunterladen
            </button>
        </div>
    );
};

export default TutorVertrag;
