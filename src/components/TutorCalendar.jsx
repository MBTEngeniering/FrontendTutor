import React, { useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import de from "date-fns/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { de };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const TutorCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState(Views.WEEK);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [savedSlots, setSavedSlots] = useState([]);
    const [toBeDeletedSlots, setToBeDeletedSlots] = useState([]);

    const isSameSlot = (a, b) =>
        a.start.getTime() === b.start.getTime() &&
        a.end.getTime() === b.end.getTime();

    const isSlotInArray = (slot, array) =>
        array.some((s) => isSameSlot(s, slot));

    const wandleSlotZuDatum = (slot) =>
        format(slot.start, "dd/MM/yyyy HH:mm", { locale: de });

    const handleSelectSlot = ({ start, end }) => {
        const slots = [];
        let slotStart = new Date(start);
        while (slotStart < end) {
            const slotEnd = new Date(slotStart.getTime() + 30 * 60000);
            slots.push({ start: slotStart, end: slotEnd, title: " " });
            slotStart = slotEnd;
        }

        setSelectedSlots((prev) => {
            const newSelection = [...prev];

            slots.forEach((slot) => {
                if (isSlotInArray(slot, prev)) {
                    // Abwählen
                    const updated = newSelection.filter((s) => !isSameSlot(s, slot));

                    // Prüfen, ob der Slot gespeichert war
                    if (isSlotInArray(slot, savedSlots)) {
                        // Slot zur Löschung vormerken
                        setToBeDeletedSlots((prevDel) => {
                            if (!isSlotInArray(slot, prevDel)) {
                                return [...prevDel, slot];
                            }
                            return prevDel;
                        });
                    }

                    return updated;
                } else {
                    newSelection.push(slot);
                }
            });

            return newSelection;
        });
    };

    const handleSelectEvent = (event) => {
        handleSelectSlot({ start: event.start, end: event.end });
    };

    const wandleDatumZuSlot = (tag, monat, jahr, uhrzeit) => {
        const [stunden, minuten] = uhrzeit.split(":").map(Number);
        const start = new Date(`${jahr}-${monat}-${tag}T${stunden.toString().padStart(2, '0')}:${minuten.toString().padStart(2, '0')}:00`);
        const end = new Date(start.getTime() + 30 * 60 * 1000);
        return { start, end };
    };
    const handleWandleSlot = () => {
        // Beispiel-Slots erstellen
        const beispielSlots = [
            wandleDatumZuSlot("06", "06", "2025", "10:00"),
            wandleDatumZuSlot("06", "06", "2025", "10:30"),
            wandleDatumZuSlot("06", "06", "2025", "11:00"),
        ];

        // Neue Slots, die noch nicht gespeichert sind
        const neueGespeicherte = beispielSlots.filter(
            (slot) => !isSlotInArray(slot, savedSlots)
        );

        setSavedSlots((prev) => [...prev, ...neueGespeicherte]);
        setSelectedSlots((prev) => [...prev, ...neueGespeicherte]);
    };

    const handleSave = () => {
        // Slots, die aktuell ausgewählt und noch nicht gespeichert sind → speichern
        const newSaved = selectedSlots.filter(
            (slot) => !isSlotInArray(slot, savedSlots)
        );
        setSavedSlots((prev) => [...prev, ...newSaved]);

        // Rote Slots (vormals gespeichert und abgewählt) → endgültig löschen
        setSavedSlots((prev) =>
            prev.filter((slot) => !isSlotInArray(slot, toBeDeletedSlots))
        );
        setSelectedSlots((prev) =>
            prev.filter((slot) => !isSlotInArray(slot, toBeDeletedSlots))
        );
        setToBeDeletedSlots([]);

        // Zeige alle gespeicherten (blauen) Slots im Alert
        const gespeicherte = [...savedSlots, ...newSaved].filter(
            (slot) => !isSlotInArray(slot, toBeDeletedSlots)
        );
        if (gespeicherte.length > 0) {
            const message = gespeicherte
                .map((slot) => wandleSlotZuDatum(slot))
                .join("\n");
            alert("Gespeicherte Termine:\n" + message);
        }
    };

    const getSlotStyle = (event) => {
        const isSaved = isSlotInArray(event, savedSlots);
        const isSelected = isSlotInArray(event, selectedSlots);
        const isMarkedForDelete = isSlotInArray(event, toBeDeletedSlots);

        let backgroundColor = "green"; // default: ausgewählt, nicht gespeichert

        if (isSaved && isSelected) backgroundColor = "blue";
        if (isSaved && isMarkedForDelete) backgroundColor = "red";
        if (!isSelected && isMarkedForDelete) backgroundColor = "white";

        return {
            style: {
                backgroundColor,
                border: "none",
                borderRadius: "4px",
                opacity: 0.8,
                color: "transparent",
                textShadow: "0 0 0 transparent",
            },
        };
    };

    const isSaveDisabled =
        selectedSlots.filter((slot) => !isSlotInArray(slot, savedSlots)).length ===
        0 && toBeDeletedSlots.length === 0;

    return (
        <div style={{height: "90vh", padding: "10px"}}>
            <Calendar
                localizer={localizer}
                events={[...selectedSlots, ...toBeDeletedSlots]}
                date={currentDate}
                view={currentView}
                onNavigate={setCurrentDate}
                onView={setCurrentView}
                startAccessor="start"
                endAccessor="end"
                step={30}
                timeslots={1}
                selectable={true}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                min={new Date(0, 0, 0, 6, 0)}
                max={new Date(0, 0, 0, 22, 0)}
                views={[Views.WEEK, Views.DAY, Views.AGENDA]}
                messages={{
                    week: "Woche",
                    day: "Tag",
                    agenda: "Agenda",
                    today: "Heute",
                    previous: "Zurück",
                    next: "Weiter",
                }}
                eventPropGetter={getSlotStyle}
            />
            <button
                onClick={handleSave}
                disabled={isSaveDisabled}
                style={{
                    marginTop: "15px",
                    padding: "10px 20px",
                    backgroundColor: isSaveDisabled ? "#ccc" : "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: isSaveDisabled ? "not-allowed" : "pointer",
                }}
            >
                Speichern
            </button>
            <button
                onClick={handleWandleSlot}
                style={{
                    marginTop: "10px",
                    marginLeft: "10px",
                    padding: "10px 20px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                WandleSlot
            </button>

        </div>
    );
};

export default TutorCalendar;
