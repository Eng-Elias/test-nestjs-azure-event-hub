import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MessageDocument } from '../../mongodb/schemas/message.schema';
import { CreateMessageDto } from '../../mongodb/dto/create_message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message')
    private messageModel: Model<MessageDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<MessageDocument> {
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
  }

  async findAll(): Promise<MessageDocument[]> {
    return this.messageModel.find().exec();
  }
}
