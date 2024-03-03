import { Injectable } from '@nestjs/common';
import { ServiceBusClient } from '@azure/service-bus';
import { AzureConfigService } from '../azure_config.service';
import { MessageService } from 'src/services/message/message.service';
import { Queues } from '../../../utils/consts';

@Injectable()
export class Queue1ListenerService {
  private serviceBusClient: ServiceBusClient;

  constructor(
    private readonly azureConfigService: AzureConfigService,
    private readonly messageService: MessageService,
  ) {
    const serviceBusConnectionString =
      this.azureConfigService.getServiceBusConnectionString();
    this.serviceBusClient = new ServiceBusClient(serviceBusConnectionString);
  }

  async listenToQueue(): Promise<void> {
    const receiver = this.serviceBusClient.createReceiver(Queues.queue1);
    receiver.subscribe({
      processMessage: async (message) => {
        console.log('Received message from queue1:', message.body);
        // Process and store the message in MongoDB
        this.processAndStoreMessage(message);
      },
      processError: async (err) => {
        console.error('Error occurred while listening to queue1:', err);
      },
    });
  }

  async processAndStoreMessage(message: any): Promise<void> {
    // Process the message as needed

    this.messageService.create({ content: message.content });
  }
}
