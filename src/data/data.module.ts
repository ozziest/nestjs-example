import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionsService } from './subscription.service';
import {
  Subscription,
  SubscriptionSchema,
} from './schemas/subscription.schema';
import { LoggerModule } from './../logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
    LoggerModule
  ],
  controllers: [],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class DataModule {}
