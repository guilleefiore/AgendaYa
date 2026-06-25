import {
  detectLocalTimezone,
  convertSlotToLocalTime
}from "./logic.js"

// ─── US_18_M04: Selección de zona horaria local ───────────────────────────────
describe("US_18_M04 — Selección de zona horaria local en el calendario", () => {

//Test_1_US_18_M04
  test("detectLocalTimezone retorna un string IANA válido", () => {
    const tz = detectLocalTimezone();
    expect(typeof tz).toBe("string");
    expect(tz.length).toBeGreaterThan(0);
    // IANA timezones tienen formato Region/City o son abreviaturas como "UTC"
    expect(tz).toMatch(/^[A-Za-z_]+[\/A-Za-z_]*$/);
  });
 
  //Test_2_US_18_M04
  test("convertSlotToLocalTime convierte UTC a zona horaria Argentina", () => {
    const utc = "2025-06-15T15:00:00Z";
    const tz = "America/Argentina/Mendoza";
    const result = convertSlotToLocalTime(utc, tz);
 
    expect(result.timezone).toBe(tz);
    expect(result.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.time).toMatch(/^\d{2}:\d{2}$/);
    // UTC-3: 15:00 UTC → 12:00 en Mendoza
    expect(result.time).toBe("12:00");
  });

 //Test_3_US_18_M04
  test("convertSlotToLocalTime lanza error si faltan parámetros", () => {
    expect(() => convertSlotToLocalTime("", "UTC")).toThrow();
    expect(() => convertSlotToLocalTime("2025-01-01T00:00:00Z", "")).toThrow();
  });

//Test_4_US_18_M04  
  test("convertSlotToLocalTime convierte correctamente a UTC+5:30 (India)", () => {
    const utc = "2025-06-15T10:00:00Z";
    const tz = "Asia/Kolkata";
    const result = convertSlotToLocalTime(utc, tz);
    expect(result.time).toBe("15:30");
  });

//Test_5_US_18_M04  
  test("lanza error con fecha inválida", () => {
    expect(() => convertSlotToLocalTime("no-es-fecha", "UTC")).toThrow("Invalid date");
  });

});
 