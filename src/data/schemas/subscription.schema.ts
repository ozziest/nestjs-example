import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Subscription extends Document {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  createdAt: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
