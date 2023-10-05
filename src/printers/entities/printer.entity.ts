import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNumber } from 'class-validator';
import { Date, Decimal128, Number, SchemaTypes } from 'mongoose';

@Schema()
export class Printer {
  @Prop({ required: true })
  brand: string;

  @Prop({ unique: true, required: true })
  model: string;

  @Prop({ required: false })
  datasheet_url: string;
  
  @Prop({ required: true })
  img_url: [string];

  @Prop({ required: true })
  description: string;

  @Prop({ type: IsNumber })
  price: Number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  color: boolean;

  @Prop({ required: true })
  rentable: boolean;

  @Prop({ required: true })
  powerConsumption: string;

  @Prop({ required: true })
  dimensions: string;

  @Prop({ required: true })
  printVelocity: string;

  @Prop()
  maxPrintSizeSimple: string;

  @Prop({ required: true })
  maxPrintSize: string;
  
  @Prop({ required: true })
  PrintSize: string;

  @Prop({ required: true })
  maxPaperWeight: string;

  @Prop({ required: true })
  duplexUnit: boolean;

  @Prop({ required: true })
  paperSizes: string;

  @Prop({ required: true })
  applicableOS: string;

  @Prop({ required: true })
  printerFunctions: string;

  @Prop({ required: true })
  barcode: [string];

  @Prop({ type: Date })
  dealEndDate: Date;

  @Prop({ type: Date })
  dealStartDate: Date;

  @Prop({ type: SchemaTypes.Decimal128 })
  dealPrice: Decimal128;
  
  @Prop({ type: SchemaTypes.Decimal128 })
  dealDiscountPercentage: Decimal128;

  @Prop({ required: false })
  isDeal: boolean;

  @Prop({ required: false })
  dealDescription: string;
}

export const PrinterSchema = SchemaFactory.createForClass(Printer);
