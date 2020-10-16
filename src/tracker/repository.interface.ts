import { Subscription } from "./subscription.interface";

export interface Repository {
  url: string,
  subscriptions: Subscription[]
}