import { generateParseIntPipe } from 'src/utils/encryption';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { ProcessService } from './process.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { RequireLogin, UserInfo } from 'src/utils/custom.decorator';
import { UpdateProcessDto } from './dto/update-process.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('process')
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @Post('add')
  @RequireLogin()
  async add(
    @Body() process: CreateProcessDto,
    @UserInfo('userId') userId: number,
  ) {
    return await this.processService.add(process, userId);
  }

  @Get('delete')
  @RequireLogin()
  async delete(
    @Query('processId') processId: number,
    @UserInfo('userId') userId: number,
  ) {
    return await this.processService.delete(processId, userId);
  }

  @Get('list')
  @RequireLogin()
  async getList(
    @Query('page', new DefaultValuePipe(1), generateParseIntPipe('page'))
    page: number,
    @Query('size', new DefaultValuePipe(10), generateParseIntPipe('size'))
    size: number,
    @Query('promoter_name') promoter_name: string,
    @Query('cc_to_name') cc_to_name: string,
    @Query('approver_name') approver_name: string,
    @Query('type') type: string,
    @Query('title') title: string,
  ) {
    return await this.processService.getList(
      page,
      size,
      promoter_name,
      cc_to_name,
      approver_name,
      type,
      title,
    );
  }

  @Post('update')
  @RequireLogin()
  async update(updateProcess: UpdateProcessDto) {
    return await this.processService.update(updateProcess);
  }

  @Post('updateStatus')
  @RequireLogin()
  async updateStatus(updateStatus: UpdateStatusDto) {
    return await this.processService.updateStatus(updateStatus);
  }
}
