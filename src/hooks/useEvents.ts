import { useEffect, useState } from "react";
import { loadShiftMindData, saveEvents } from "../services/storage";
import { CalendarEvent, EventType } from "../types";

export function useEvents(loaded: boolean) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [eventsLoaded, setEventsLoaded] = useState(false);

  useEffect(() => {
    loadShiftMindData()
      .then((data) => { if (data.events) setEvents(data.events); })
      .finally(() => setEventsLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded && eventsLoaded) saveEvents(events);
  }, [events, loaded, eventsLoaded]);

  /**
   * Gibt Events für einen bestimmten Tag zurück.
   * Bei recurring events: month muss ebenfalls übereinstimmen (0-indexed).
   */
  function getEventsForDay(day: number, month: number): CalendarEvent[] {
    return events.filter((e) => {
      if (e.recurring) return e.day === day && e.month === month;
      return e.day === day;
    });
  }

  /** Events-Map für schnellen Zugriff im Kalender: day→count */
  function getEventCountMap(month: number): Record<number, number> {
    const map: Record<number, number> = {};
    events.forEach((e) => {
      if (e.recurring ? e.month === month : true) {
        map[e.day] = (map[e.day] ?? 0) + 1;
      }
    });
    return map;
  }

  function addEvent(data: Omit<CalendarEvent, "id">) {
    const event: CalendarEvent = { ...data, id: `ev${Date.now()}` };
    setEvents((prev) => [...prev, event]);
  }

  function deleteEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function updateEvent(id: string, data: Partial<Omit<CalendarEvent, "id">>) {
    setEvents((prev) => prev.map((e) => e.id === id ? { ...e, ...data } : e));
  }

  function resetEvents() { setEvents([]); }

  return { events, getEventsForDay, getEventCountMap, addEvent, deleteEvent, updateEvent, resetEvents };
}
