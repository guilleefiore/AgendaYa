import '@testing-library/jest-dom';
import { filterDaysByDuration, estimateRenderTimeForCalendar } from './logic';

describe('Julian - US_03_M04 - Carga de disponibilidad según duración', () => {
  it('debería mostrar solo días con al menos 60 minutos libres', () => {
    const availability = [
      { date: '2026-06-25', freeIntervals: [{ start: '09:00', end: '10:00' }] },
      { date: '2026-06-26', freeIntervals: [{ start: '09:00', end: '09:30' }] },
      { date: '2026-06-27', freeIntervals: [{ start: '10:00', end: '11:30' }] },
    ];

    const result = filterDaysByDuration(availability, 60);

    expect(result).toEqual(['2026-06-25', '2026-06-27']);
  });

  it('debería estimar el render del calendario por debajo de 2000ms', () => {
    const estimatedMilliseconds = estimateRenderTimeForCalendar(500, 1);

    expect(estimatedMilliseconds).toBeLessThan(2000);
  });
});
