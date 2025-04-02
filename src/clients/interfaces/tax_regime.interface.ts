export interface TaxRegimeInterface {
  code: number;
  description: string;
}

export const taxRegimes: TaxRegimeInterface[] = [
  { code: 601, description: 'REGIMEN GENERAL DE LEY PERSONAS MORALES' },
  { code: 602, description: 'RÉGIMEN SIMPLIFICADO DE LEY PERSONAS MORALES' },
  { code: 603, description: 'PERSONAS MORALES CON FINES NO LUCRATIVOS' },
  { code: 604, description: 'RÉGIMEN DE PEQUEÑOS CONTRIBUYENTES' },
  { code: 605, description: 'RÉGIMEN DE SUELDOS Y SALARIOS E INGRESOS ASIMILADOS A SALARIOS' },
  { code: 606, description: 'RÉGIMEN DE ARRENDAMIENTO' },
  { code: 607, description: 'RÉGIMEN DE ENAJENACIÓN O ADQUISICIÓN DE BIENES' },
  { code: 608, description: 'RÉGIMEN DE LOS DEMÁS INGRESOS' },
  { code: 609, description: 'RÉGIMEN DE CONSOLIDACIÓN' },
  { code: 610, description: 'RÉGIMEN RESIDENTES EN EL EXTRANJERO SIN ESTABLECIMIENTO PERMANENTE EN MÉXICO' },
  { code: 611, description: 'RÉGIMEN DE INGRESOS POR DIVIDENDOS (SOCIOS Y ACCIONISTAS)' },
  { code: 612, description: 'RÉGIMEN DE LAS PERSONAS FÍSICAS CON ACTIVIDADES EMPRESARIALES Y PROFESIONALES' },
  { code: 613, description: 'RÉGIMEN INTERMEDIO DE LAS PERSONAS FÍSICAS CON ACTIVIDADES EMPRESARIALES' },
  { code: 614, description: 'RÉGIMEN DE LOS INGRESOS POR INTERESES' },
  { code: 615, description: 'RÉGIMEN DE LOS INGRESOS POR OBTENCIÓN DE PREMIOS' },
  { code: 616, description: 'SIN OBLIGACIONES FISCALES' },
  { code: 617, description: 'PEMEX' },
  { code: 618, description: 'RÉGIMEN SIMPLIFICADO DE LEY PERSONAS FÍSICAS' },
  { code: 619, description: 'INGRESOS POR LA OBTENCIÓN DE PRÉSTAMOS' },
  { code: 620, description: 'SOCIEDADES COOPERATIVAS DE PRODUCCIÓN QUE OPTAN POR DIFERIR SUS INGRESOS' },
  { code: 621, description: 'RÉGIMEN DE INCORPORACIÓN FISCAL' },
  { code: 622, description: 'RÉGIMEN DE ACTIVIDADES AGRÍCOLAS, GANADERAS, SILVÍCOLAS Y PESQUERAS PM' },
  { code: 623, description: 'RÉGIMEN DE OPCIONAL PARA GRUPOS DE SOCIEDADES' },
  { code: 624, description: 'RÉGIMEN DE LOS COORDINADOS' },
  { code: 625, description: 'RÉGIMEN DE LAS ACTIVIDADES EMPRESARIALES CON INGRESOS A TRAVÉS DE PLATAFORMAS TECNOLÓGICAS' },
  { code: 626, description: 'RÉGIMEN SIMPLIFICADO DE CONFIANZA' }
];
