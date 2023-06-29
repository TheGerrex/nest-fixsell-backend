import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


@Schema()
export class Printer {
    @Prop({required: true})
    brand:            string;

    @Prop({unique: true, required: true})
    model:            string;

    @Prop({required: true})
    description:      string;

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Category'})
    category_id:      string;

    @Prop({required: true})
    color:            boolean;

    @Prop({required: true})
    rentable:         boolean;

    @Prop({required: true})
    powerConsumption: string;

    @Prop({required: true})
    dimensions:       string;

    @Prop({required: true})
    printVelocity:    string;

    @Prop({required: true})
    maxPrintSize:     string;

    @Prop({required: true})
    maxPaperWeight:   string;

    @Prop({required: true})
    duplexUnit:       boolean;

    @Prop({required: true})
    paperSizes:       string;

    @Prop({required: true})
    applicableOS:     string;

}

export const PrinterSchema = SchemaFactory.createForClass(Printer)




