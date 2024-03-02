import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { TravelRecordService } from './travel-record.service';
import { RequireLogin, UserInfo } from 'src/utils/custom.decorator';
import { CreateRecordDto } from './dto/create-record.dto';
import { generateParseIntPipe } from 'src/utils/encryption';
import { UpdateRecordDto } from './dto/update_record.dto';

@Controller('travel-record')
export class TravelRecordController {
  constructor(private readonly travelRecordService: TravelRecordService) {}

  @Post('add')
  @RequireLogin()
  async add(
    @UserInfo('userId') userId: number,
    @Body() travelRecord: CreateRecordDto,
  ) {
    return this.travelRecordService.add(userId, travelRecord);
  }

  @Get('delete')
  @RequireLogin()
  async delete(
    @UserInfo('userId') userId: number,
    @Query('recordId') recordId: number,
  ) {
    return this.travelRecordService.delete(userId, recordId);
  }

  @Get('list')
  @RequireLogin()
  async getList(
    @Query('page', new DefaultValuePipe(1), generateParseIntPipe('page'))
    page: number,
    @Query('size', new DefaultValuePipe(10), generateParseIntPipe('size'))
    size: number,
    @Query('status') status: string,
    @Query('from_city') from_city: string,
    @Query('to_city') to_city: string,
    @Query('type') type: string,
    @Query('car_type') car_type: string,
  ) {
    return this.travelRecordService.getRecordList(
      page,
      size,
      status,
      from_city,
      to_city,
      type,
      car_type,
    );
  }

  @Post('update')
  @RequireLogin()
  async update(@Body() updateRecord: UpdateRecordDto) {
    return await this.travelRecordService.updateRecord(updateRecord);
  }
}
