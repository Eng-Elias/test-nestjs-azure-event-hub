import { Injectable } from '@nestjs/common';
import { ServiceBusClient } from '@azure/service-bus';
import { AzureConfigService } from '../azure_config.service';
import { MessageService } from '../../../services/message/message.service';

@Injectable()
export class Queue2ListenerService {
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
    const receiver = this.serviceBusClient.createReceiver('queue2');
    receiver.subscribe({
      processMessage: async (message) => {
        console.log('Received message from queue2:', message.body);
        // Process and store the message in MongoDB
        this.processAndStoreMessage(message);
      },
      processError: async (err) => {
        console.error('Error occurred while listening to queue2:', err);
      },
    });
  }

  async processAndStoreMessage(message: any): Promise<void> {
    // Process the message as needed

    this.messageService.create({ content: message.content });
  }
}
