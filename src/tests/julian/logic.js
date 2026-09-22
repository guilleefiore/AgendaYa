export function actualizarSeleccionEvento(eventId) {
  return {
    selectedEventId: eventId,
    continueButtonEnabled: true,
  };
}

export function esEventoSeleccionado(selectedEventId, eventId) {
  return selectedEventId === eventId;
}

export function filterDaysByDuration(availability, durationMinutes) {
  const toMinutes = (hhmm) => {
    const [hours, minutes] = hhmm.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return availability
    .filter((day) => {
      if (!Array.isArray(day.freeIntervals)) return false;

      return day.freeIntervals.some((interval) => {
        const start = toMinutes(interval.start);
        const end = toMinutes(interval.end);
        return end - start >= durationMinutes;
      });
    })
    .map((day) => day.date);
}

export function estimateRenderTimeForCalendar(numDays, complexityFactor = 1) {
  const perDayMilliseconds = 2 * complexityFactor;
  return Math.max(0, Math.floor(numDays * perDayMilliseconds));
}
