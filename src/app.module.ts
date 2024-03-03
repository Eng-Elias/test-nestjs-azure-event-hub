import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './mongodb/schemas/message.schema';
import { ConfigModule } from '@nestjs/config';
import { MessageController } from './controllers/message/message.controller';
import { MessageService } from './services/message/message.service';
import { EventHubService } from './services/event_hub/event_hub.service';
import { ServiceBusService } from './services/event_hub/service_bus.service';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global_exception.filter';
import { LoggingService } from './services/logging/logging.service';
import { AzureConfigService } from './services/event_hub/azure_config.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
  ],
  controllers: [AppController, MessageController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    AppService,
    MessageService,
    AzureConfigService,
    EventHubService,
    ServiceBusService,
    LoggingService,
  ],
})
export class AppModule {
  constructor(
    private readonly eventHubService: EventHubService,
    private readonly serviceBusService: ServiceBusService,
    private readonly loggingService: LoggingService,
  ) {
    // Start listening to the Event Hub when the module is initialized
    this.eventHubService.startListening().catch((err) => {
      console.error('Error starting Event Hub listener:', err);
      this.loggingService.error(
        'Error starting Event Hub listener:',
        err.stack,
      );
    });

    const message = {
      /* Construct your message object here */
    };
    const queueName = 'your-queue-name';
    this.serviceBusService
      .sendMessageToQueue(queueName, message)
      .catch((err) => {
        console.error('Error sending message to Service Bus queue:', err);
        this.loggingService.error(
          'Error sending message to Service Bus queue:',
          err.stack,
        );
      });
  }
}
