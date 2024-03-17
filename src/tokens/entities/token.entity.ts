import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Token extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  card_number: number;

  @Prop({ required: true })
  cvv: number;

  @Prop({ required: true })
  expiration_month: string;

  @Prop({ required: true })
  expiration_year: string;

  @Prop({})
  token: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
