import { Injectable } from '@nestjs/common';
import { EventHubConsumerClient } from '@azure/event-hubs';
import { AzureConfigService } from 'src/services/event_hub/azure_config.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class EventHubService {
  private eventHubClient: EventHubConsumerClient;

  constructor(
    private readonly azureConfigService: AzureConfigService,
    private readonly loggingService: LoggingService,
  ) {
    const eventHubConnectionString =
      this.azureConfigService.getEventHubConnectionString();
    this.eventHubClient = new EventHubConsumerClient(
      '$Default',
      eventHubConnectionString,
    );
  }

  async startListening(): Promise<void> {
    const subscription = this.eventHubClient.subscribe({
      processEvents: async (events, context) => {
        for (const event of events) {
          // Process each event here
          console.log('Received event: ', event.body);
        }
      },
      processError: async (err, context) => {
        // Handle errors
        console.error(err);
        this.loggingService.error('An error occurred', err.stack);
      },
    });

    // Wait for the subscription to be closed (not implemented in this example)
    await subscription.close();
  }
}
