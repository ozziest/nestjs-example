import { Injectable, Logger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.DEFAULT })
export class SchedulerLogger extends Logger {}
