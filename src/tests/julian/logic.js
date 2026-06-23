export function actualizarSeleccionEvento(eventId) {
  return {
    selectedEventId: eventId,
    continueButtonEnabled: true,
  };
}

export function esEventoSeleccionado(selectedEventId, eventId) {
  return selectedEventId === eventId;
}
