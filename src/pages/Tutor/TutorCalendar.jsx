import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import de from "date-fns/locale/de";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth } from "../../context/UseAuth.jsx";
import ApiService from "../../api/ApiService.js";

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
    const { user } = useAuth();
    const [allAvailabilitySlots, setAllAvailabilitySlots] = useState([]);

    // NEU: Termine & Fächer
    const [termine, setTermine] = useState([]);
    const [fächer, setFächer] = useState({});

    // Setze currentDate auf frühestes Termin-Datum, wenn Termine geladen werden
    useEffect(() => {
        if (termine.length > 0) {
            const earliestTermin = termine.reduce((earliest, curr) =>
                new Date(curr.startDate) < new Date(earliest.startDate) ? curr : earliest
            );
            setCurrentDate(new Date(earliestTermin.startDate));
        }
    }, [termine]);

    useEffect(() => {
        const fetchAvailability = async () => {
            if (!user) return;
            try {
                await ApiService.get(`/api/allusers/${user.id}`);
            } catch (error) {
                console.error("Fehler beim Abrufen der Verfügbarkeit:", error);
            }

            await handleWandleSlot();
        };

        const fetchTermineUndFaecher = async () => {
            if (!user) return;
            try {
                const termineResponse = await ApiService.get(
                    `/api/public/appointments/tutor/${user.id}`
                );
                setTermine(termineResponse.data);

                const faecherResponse = await ApiService.get(`/api/fach/trans/de`);
                const alleFaecher = faecherResponse.data;
                const fachMap = {};
                alleFaecher.forEach((fach) => {
                    fachMap[fach.id] = fach.fach || fach.bezeichnung || "Unbekannt";
                });
                setFächer(fachMap);
            } catch (error) {
                console.error("Fehler beim Laden der Termine oder Fächer:", error);
            }
        };

        fetchAvailabilityAndShowIds();
        fetchAvailability();
        fetchTermineUndFaecher();
    }, [user]);

    const isSameSlot = (a, b) =>
        a.start.getTime() === b.start.getTime() && a.end.getTime() === b.end.getTime();

    const isSlotInArray = (slot, array) =>
        array.some((s) => isSameSlot(s, slot));

    const handleSelectSlot = ({ start, end }) => {
        const now = new Date();
        if (start < now) {
            // Auswahl von Slots in der Vergangenheit nicht erlauben
            return;
        }
        const slots = [];
        let slotStart = new Date(start);
        while (slotStart < end) {
            const slotEnd = new Date(slotStart.getTime() + 30 * 60000);
            slots.push({ start: slotStart, end: slotEnd, title: " " });
            slotStart = slotEnd;
        }

        setSelectedSlots((prevSelected) => {
            let updatedSelected = [...prevSelected];

            slots.forEach((slot) => {
                const saved = isSlotInArray(slot, savedSlots);
                const markedForDelete = isSlotInArray(slot, toBeDeletedSlots);
                const alreadySelected = isSlotInArray(slot, prevSelected);

                if (alreadySelected) {
                    updatedSelected = updatedSelected.filter((s) => !isSameSlot(s, slot));
                    if (saved && !markedForDelete) {
                        setToBeDeletedSlots((prevDel) => [...prevDel, slot]);
                    } else if (saved && markedForDelete) {
                        setToBeDeletedSlots((prevDel) =>
                            prevDel.filter((s) => !isSameSlot(s, slot))
                        );
                        updatedSelected.push(slot);
                    }
                } else {
                    if (saved && markedForDelete) {
                        setToBeDeletedSlots((prevDel) =>
                            prevDel.filter((s) => !isSameSlot(s, slot))
                        );
                    }
                    updatedSelected.push(slot);
                }
            });

            return updatedSelected;
        });
    };

    const handleSelectEvent = (event) => {
        if (event.title && event.title.startsWith("Fach:")) {
            // Termin: nicht anklickbar
            return;
        }
        handleSelectSlot({ start: event.start, end: event.end });
    };

    const wandleDatumZuSlot = (tag, monat, jahr, uhrzeit) => {
        const [stunden, minuten] = uhrzeit.split(":").map(Number);
        const start = new Date(
            `${jahr}-${monat}-${tag}T${stunden.toString().padStart(2, "0")}:${minuten
                .toString()
                .padStart(2, "0")}:00`
        );
        const end = new Date(start.getTime() + 30 * 60 * 1000);
        return { start, end };
    };

    const handleWandleSlot = async () => {
        try {
            const response =await ApiService.get(`/api/public/availability/user/${user.id}`);
            const daten = response.data;

            const neueSlots = daten.map((eintrag) =>
                wandleDatumZuSlot(eintrag.tag, eintrag.monat, eintrag.jahr, eintrag.uhrzeit)
            );

            const neueGespeicherte = neueSlots.filter(
                (slot) => !isSlotInArray(slot, savedSlots)
            );

            setSavedSlots((prev) => [...prev, ...neueGespeicherte]);
            setSelectedSlots((prev) => [...prev, ...neueGespeicherte]);
        } catch (error) {
            console.error("Fehler beim Abrufen der Availability:", error);
            alert("Fehler beim Laden der Availability-Daten.");
        }
    };

    const handleSave = async () => {
        const newSaved = selectedSlots.filter(
            (slot) => !isSlotInArray(slot, savedSlots)
        );

        const availabilityDtos = newSaved.map((slot) => {
            const tag = slot.start.getDate().toString().padStart(2, "0");
            const monat = (slot.start.getMonth() + 1).toString().padStart(2, "0");
            const jahr = slot.start.getFullYear().toString();
            const stunden = slot.start.getHours().toString().padStart(2, "0");
            const minuten = slot.start.getMinutes().toString().padStart(2, "0");
            return {
                userId: user.id,
                tag: tag,
                monat: monat,
                jahr: jahr,
                uhrzeit: `${stunden}:${minuten}`,
            };
        });

        try {
            for (const dto of availabilityDtos) {
                await ApiService.post("/api/public/availability/save", dto);
            }

            setSavedSlots((prev) =>
                prev.filter((slot) => !isSlotInArray(slot, toBeDeletedSlots)).concat(newSaved)
            );
            setSelectedSlots((prev) =>
                prev.filter((slot) => !isSlotInArray(slot, toBeDeletedSlots))
            );
            setToBeDeletedSlots([]);

            const uniqueToBeDeletedSlots = toBeDeletedSlots.filter(
                (slot, index, self) =>
                    index === self.findIndex((s) => isSameSlot(s, slot))
            );
            const availabilitytodelete = uniqueToBeDeletedSlots.map((slot) => {
                const tag = slot.start.getDate().toString().padStart(2, "0");
                const monat = (slot.start.getMonth() + 1).toString().padStart(2, "0");
                const jahr = slot.start.getFullYear().toString();
                const stunden = slot.start.getHours().toString().padStart(2, "0");
                const minuten = slot.start.getMinutes().toString().padStart(2, "0");
                return {
                    userId: user.id,
                    tag: tag,
                    monat: monat,
                    jahr: jahr,
                    uhrzeit: `${stunden}:${minuten}`,
                };
            });

            const matchingIds = [];
            availabilitytodelete.forEach((deleteSlot) => {
                const match = allAvailabilitySlots.find(
                    (slot) =>
                        slot.tag === deleteSlot.tag &&
                        slot.monat === deleteSlot.monat &&
                        slot.jahr === deleteSlot.jahr &&
                        slot.uhrzeit === deleteSlot.uhrzeit
                );
                if (match) {
                    matchingIds.push(match.id);
                }
            });

            if (matchingIds.length !== 0) {
                for (const id of matchingIds) {
                    await fetch(`http://localhost:8080/api/public/availability/${id}`, {
                        method: "DELETE",
                    });
                }


                alert("Alle passenden -Einträge wurden gelöscht.");

                setAllAvailabilitySlots((prevSlots) =>
                    prevSlots.filter((slot) => !matchingIds.includes(slot.id))
                );
            }
        } catch (error) {
            console.error("Fehler beim Speichern der Verfügbarkeit:", error);
            alert("Fehler beim Speichern der Verfügbarkeit.");
        }
    };

    const fetchAvailabilityAndShowIds = async () => {
        try {
            const response = await ApiService.get(`/api/public/availability/user/${user.id}`);
            setAllAvailabilitySlots(response.data);

        } catch (error) {
            console.error("Fehler beim Abrufen der Availability:", error);
        }
    };

    const getSlotStyle = (event) => {
        if (event.title && event.title.startsWith("Fach:")) {
            return { style: { backgroundColor: "#ff9800", color: "#fff" } };
        }

        const isSaved = isSlotInArray(event, savedSlots);
        const isSelected = isSlotInArray(event, selectedSlots);
        const isMarkedForDelete = isSlotInArray(event, toBeDeletedSlots);

        let backgroundColor = "green";

        if (isSaved && isSelected) backgroundColor = "blue";
        if (isSaved && isMarkedForDelete) backgroundColor = "red";
        if (!isSelected && isMarkedForDelete) backgroundColor = "red";
        if (!isSaved && !isSelected) backgroundColor = "white";

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
        selectedSlots.filter((slot) => !isSlotInArray(slot, savedSlots)).length === 0 &&
        toBeDeletedSlots.length === 0;

    // Termine für Kalender vorbereiten
    const termineEvents = termine.map((termin) => ({
        start: new Date(termin.startDate),
        end: new Date(termin.endDate),
        title: `Fach: ${fächer[termin.fachId] || "?"}, Student: ${termin.studentId}`,
    }));

    return (
        <div style={{ height: "90vh", padding: "10px" }}>
            <Calendar
                localizer={localizer}
                events={[...selectedSlots, ...toBeDeletedSlots, ...termineEvents]}
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
                min={new Date(0, 0, 0, 0, 0)}
                max={new Date(0, 0, 0, 23, 59)}
                views={[Views.WEEK, Views.DAY, Views.AGENDA]}
                messages={{
                    week: "Woche",
                    day: "Tag",
                    agenda: "Agenda",
                    today: "Heute",
                    previous: "Zurück",
                    next: "Weiter",
                }}
                formats={{
                    timeGutterFormat: (date, culture, localizer) =>
                        localizer.format(date, "HH:mm", culture),
                    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                        `${localizer.format(start, "HH:mm", culture)} – ${localizer.format(
                            end,
                            "HH:mm",
                            culture
                        )}`,
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
        </div>
    );
};

export default TutorCalendar;
