import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";



@Schema({
    timestamps: true,
})
export class User {
    @Prop()
    name: string;

    @Prop({ unique: [true, 'Email must be unique']})
    email: string;

    @Prop()
    password: string;

    @Prop()
    role: string;

    
}

export const UserSchema = SchemaFactory.createForClass(User);