import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { TravelRecord } from './entities/travelRecord.entity';
import { Between, EntityManager, Repository } from 'typeorm';
import { CreateRecordDto } from './dto/create-record.dto';
import { User } from 'src/user/entities/user.entity';
import { UpdateRecordDto } from './dto/update_record.dto';

@Injectable()
export class TravelRecordService {
  private logger = new Logger();

  @InjectRepository(TravelRecord)
  private repository: Repository<TravelRecord>;

  @InjectEntityManager()
  private entityManger: EntityManager;

  // 添加出行记录
  async add(userId: number, createRecord: CreateRecordDto) {
    const user = await this.entityManger.findOneBy(User, {
      id: userId,
    });
    // note:需要解决
    const res = await this.entityManger.findBy(TravelRecord, {
      user: user,
      start_time: Between(createRecord.start_time, createRecord.end_time),
      end_time: Between(createRecord.start_time, createRecord.end_time),
    });
    console.log(res);
    if (res.length !== 0) {
      throw new BadRequestException('该时间段有其他出行记录，无法添加');
    }

    const record = new TravelRecord();
    record.user = user;
    record.from = createRecord.from;
    record.to = createRecord.to;
    record.from_city = createRecord.from_city;
    record.to_city = createRecord.to_city;
    record.type = createRecord.type;
    record.car_type = createRecord.car_type;
    record.description = createRecord.description;
    record.start_time = createRecord.start_time;
    record.end_time = createRecord.end_time;

    try {
      await this.entityManger.save(TravelRecord, record);
      return 'success';
    } catch (e) {
      this.logger.error(e, TravelRecordService);
      return 'fail';
    }
  }
  // 删除出行记录
  async delete(userId: number, recordId: number) {
    const record = await this.entityManger.findOne(TravelRecord, {
      where: {
        id: recordId,
      },
      relations: {
        user: true,
      },
    });
    if (!record || record.user.id !== userId) {
      throw new HttpException('出行记录不存在', HttpStatus.BAD_REQUEST);
    }

    record.delete_time = new Date();
    try {
      await this.entityManger.save(TravelRecord, record);
      return 'success';
    } catch (e) {
      this.logger.error(e, TravelRecordService);
      return 'fail';
    }
  }
  // 获取出行记录列表
  async getRecordList(
    page: number,
    size: number,
    status: string,
    from_city: string,
    to_city: string,
    type: string,
    car_type: string,
  ) {
    const skipCount = (page - 1) * size;
    const condition: Record<string, any> = {};

    if (status) {
      condition.status = status;
    }
    if (from_city) {
      condition.from_city = from_city;
    }
    if (to_city) {
      condition.to_city = to_city;
    }
    if (type) {
      condition.type = type;
    }
    if (car_type) {
      condition.car_type = car_type;
    }

    const userType = {
      id: true,
      name: true,
      username: true,
      email: true,
      student_id: true,
      from: true,
      guardian_name: true
    }

    const [records, totalCount] = await this.entityManger.findAndCount(
      TravelRecord,
      {
        where: condition,
        select: {
          id: true,
          user: userType,
          from: true,
          to: true,
          from_city: true,
          to_city: true,
          type: true,
          car_type: true,
          description: true,
          create_time: true,
          update_time: true,
          delete_time: true,
          start_time: true,
          end_time: true,
        },
        relations: {
          user: true,
        },
        skip: skipCount,
        take: size,
      },
    );

    return {
      travelRecord: records,
      totalCount,
    };
  }
  // 修改出行记录
  async updateRecord(updateRecord: UpdateRecordDto) {
    const record = await this.entityManger.findOneBy(TravelRecord, {
      id: updateRecord.id,
    });

    record.from = updateRecord.from;
    record.from_city = updateRecord.from_city;
    record.to = updateRecord.to;
    record.to_city = updateRecord.to_city;
    record.type = updateRecord.type;
    record.car_type = updateRecord.car_type;
    record.description = updateRecord.description;
    record.start_time = updateRecord.start_time;
    record.end_time = updateRecord.end_time;

    try {
      await this.entityManger.save(TravelRecord, record);
      return 'success';
    } catch (e) {
      this.logger.error(e, TravelRecordService);
      return 'fail';
    }
  }
}
