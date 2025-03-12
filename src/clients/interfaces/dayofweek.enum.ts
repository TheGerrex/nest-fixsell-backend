export enum DayOfWeek {
  LUNES = 'Lunes',
  MARTES = 'Martes',
  MIERCOLES = 'Miércoles',
  JUEVES = 'Jueves',
  VIERNES = 'Viernes',
  SABADO = 'Sábado',
  DOMINGO = 'Domingo',
}

export function isValidDayOfWeek(day: string): boolean {
  return Object.values(DayOfWeek).includes(day as DayOfWeek);
}
