// In your service or controller file
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureConfigService {
  constructor(private readonly configService: ConfigService) {}

  getEventHubConnectionString(): string {
    return this.configService.get<string>('AZURE_EVENT_HUB_CONNECTION_STRING');
  }

  getServiceBusConnectionString(): string {
    return this.configService.get<string>(
      'AZURE_SERVICE_BUS_CONNECTION_STRING',
    );
  }
}
