export enum PaymentMethod {
  CASH = '01', // Efectivo
  NOMINATIVE_CHECK = '02', // Cheque nominativo
  ELECTRONIC_TRANSFER = '03', // Transferencia electrónica de fondos
  CREDIT_CARD = '04', // Tarjeta de crédito
  ELECTRONIC_WALLET = '05', // Monedero electrónico
  ELECTRONIC_MONEY = '06', // Dinero electrónico
  FOOD_VOUCHERS = '08', // Vales de despensa
  PAYMENT_IN_KIND = '12', // Dación en pago
  PAYMENT_BY_SUBROGATION = '13', // Pago por subrogación
  PAYMENT_BY_CONSIGNMENT = '14', // Pago por consignación
  DEBT_FORGIVENESS = '15', // Condonación
  COMPENSATION = '17', // Compensación
  NOVATION = '23', // Novación
  CONFUSION = '24', // Confusión
  DEBT_REMISSION = '25', // Remisión de deuda
  PRESCRIPTION = '26', // Prescripción o caducidad
  CREDITOR_SATISFACTION = '27', // A satisfacción del acreedor
  DEBIT_CARD = '28', // Tarjeta de débito
  SERVICE_CARD = '29', // Tarjeta de servicios
  ADVANCE_APPLICATION = '30', // Aplicación de anticipos
  TO_BE_DEFINED = '99', // Por definir
}

export interface PaymentMethodInterface {
  paymentMethod: PaymentMethod;
  description: string;
}
