
// ─── US_18: Selección de zona horaria local ───────────────────────────────────
 
/**
 * Detecta la zona horaria del dispositivo del usuario.
 * @returns {string} IANA timezone string, e.g. "America/Argentina/Neuquen"
 */
export function detectLocalTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
 
/**
 * Convierte un slot UTC al horario local del usuario.
 * @param {string} utcDateTimeISO - ISO 8601 en UTC
 * @param {string} timezone - IANA timezone
 * @returns {{ date: string, time: string, timezone: string }}
 */
export function convertSlotToLocalTime(utcDateTimeISO, timezone) {
  if (!utcDateTimeISO || !timezone) {
    throw new Error("utcDateTimeISO and timezone are required");
  }
  const date = new Date(utcDateTimeISO);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date: " + utcDateTimeISO);
  }
 
  const formatter = new Intl.DateTimeFormat("es-AR", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
 
  const parts = formatter.formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value ?? "";
 
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
    timezone,
  };
}
 
 