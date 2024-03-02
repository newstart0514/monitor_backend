import { Module } from '@nestjs/common';
import { TravelRecordService } from './travel-record.service';
import { TravelRecordController } from './travel-record.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelRecord } from './entities/travelRecord.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TravelRecord])],
  controllers: [TravelRecordController],
  providers: [TravelRecordService],
})
export class TravelRecordModule {}
