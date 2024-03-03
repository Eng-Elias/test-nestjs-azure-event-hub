import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateMessageDto } from '../../mongodb/dto/create_message.dto';
import { MessageService } from '../../services/message/message.service';
import { ServiceBusService } from '../../services/event_hub/service_bus.service';
import { Queues } from '../../utils/consts';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly serviceBusService: ServiceBusService,
  ) {}

  @Post()
  async createMessage(
    @Res() response,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    try {
      const newMessage = await this.messageService.create(createMessageDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Message has been created successfully',
        newMessage,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Message not created!',
        error: 'Bad Request',
      });
    }
  }

  @Get()
  async getMessages(@Res() response) {
    try {
      const messageData = await this.messageService.findAll();
      return response.status(HttpStatus.OK).json({
        message: 'All messages data found successfully',
        messageData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Post('/send')
  async sendMessage(@Body() message: any): Promise<void> {
    await this.serviceBusService.sendMessageToQueue(Queues.queue1, message);
    await this.serviceBusService.sendMessageToQueue(Queues.queue2, message);
  }
}
