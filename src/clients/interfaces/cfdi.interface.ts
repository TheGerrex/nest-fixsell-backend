export interface CfdiInterface {
  code: string;
  description: string;
  appliesTo: string[];
}

export const cfdiValues: CfdiInterface[] = [
  { code: "G01", description: "Adquisición de mercancías", appliesTo: ["física", "moral"] },
  { code: "G02", description: "Devoluciones, descuentos o bonificaciones", appliesTo: ["física", "moral"] },
  { code: "G03", description: "Gastos en general", appliesTo: ["física", "moral"] },
  { code: "I01", description: "Construcciones", appliesTo: ["física", "moral"] },
  { code: "I02", description: "Mobilario y equipo de oficina por inversiones", appliesTo: ["física", "moral"] },
  { code: "I03", description: "Equipo de transporte", appliesTo: ["física", "moral"] },
  { code: "I04", description: "Equipo de cómputo y accesorios", appliesTo: ["física", "moral"] },
  { code: "I05", description: "Dados, troqueles, moldes, matrices y herramental", appliesTo: ["física", "moral"] },
  { code: "I06", description: "Comunicaciones telefónicas", appliesTo: ["física", "moral"] },
  { code: "I07", description: "Comunicaciones satelitales", appliesTo: ["física", "moral"] },
  { code: "I08", description: "Otra maquinaria y equipo", appliesTo: ["física", "moral"] },
  { code: "D01", description: "Honorarios médicos, dentales y gastos hospitalarios", appliesTo: ["física"] },
  { code: "D02", description: "Gastos médicos por incapacidad o discapacidad", appliesTo: ["física"] },
  { code: "D03", description: "Gastos funerales", appliesTo: ["física"] },
  { code: "D04", description: "Donativos", appliesTo: ["física"] },
  { code: "D05", description: "Intereses reales efectivamente pagados por créditos hipotecarios", appliesTo: ["física"] },
  { code: "D06", description: "Aportaciones voluntarias al SAR", appliesTo: ["física"] },
  { code: "D07", description: "Primas por seguros de gastos médicos", appliesTo: ["física"] },
  { code: "D08", description: "Gastos de transportación escolar obligatoria", appliesTo: ["física"] },
  { code: "D09", description: "Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones", appliesTo: ["física"] },
  { code: "D10", description: "Pagos por servicios educativos (colegiaturas)", appliesTo: ["física"] },
  { code: "P01", description: "Por definir", appliesTo: ["moral"] }
];
