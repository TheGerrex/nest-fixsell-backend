export type CfdiAllowedValues =
  | 'Adquisición de mercancias'
  | 'Aportaciones voluntarios al SAR'
  | 'Comunicaciones satelitales'
  | 'Comunicaciones telefónicas'
  | 'Construcciones'
  | 'Dados, troqueles, moldes, matrices y herramental'
  | 'Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones'
  | 'Devoluciones, descuentos o bonificaciones'
  | 'Donativos'
  | 'Equipo de computo y accesorios'
  | 'Equipo de transporte'
  | 'Gastos de transportación escolar obligatoria'
  | 'Gastos en general'
  | 'Gastos funerales'
  | 'Gastos médicos por incapacidad o discapacidad'
  | 'Honorarios médicos, dentales y gastos hospitalarios'
  | 'Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)'
  | 'Mobiliario y equipo de oficina por inversiones'
  | 'Otra maquinaria y equipo'
  | 'Pagos'
  | 'Pagos por servicios educativos (colegiaturas)'
  | 'Por definir'
  | 'Primas por seguros de gastos médicos'
  | 'Sin efectos fiscales';

export interface CfdiInterface {
  cfdiUse: CfdiAllowedValues;
}
