import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionsService } from './subscription.service';
import { Subscription, SubscriptionSchema } from './schemas/subscription.schema';
import { TimeService } from './time.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Subscription.name, schema: SubscriptionSchema }])],
  controllers: [],
  providers: [SubscriptionsService, TimeService],
  exports: [SubscriptionsService, TimeService]
})
export class CatsModule {}