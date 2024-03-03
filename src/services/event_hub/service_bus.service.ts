import { Injectable } from '@nestjs/common';
import { ServiceBusClient } from '@azure/service-bus';
import { AzureConfigService } from 'src/services/event_hub/azure_config.service';

@Injectable()
export class ServiceBusService {
  private serviceBusClient: ServiceBusClient;

  constructor(private readonly azureConfigService: AzureConfigService) {
    const serviceBusConnectionString =
      this.azureConfigService.getServiceBusConnectionString();
    this.serviceBusClient = new ServiceBusClient(serviceBusConnectionString);
  }

  async sendMessageToQueue(queueName: string, message: any): Promise<void> {
    const sender = this.serviceBusClient.createSender(queueName);
    try {
      // Send message to the specified queue
      await sender.sendMessages({ body: message });
    } finally {
      // Close the sender
      await sender.close();
    }
  }
}
