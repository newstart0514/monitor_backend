import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Like } from 'typeorm';
import { CreateProcessDto } from './dto/create-process.dto';
import { Process } from './entities/process.entity';
import { User } from 'src/user/entities/user.entity';
import { UpdateProcessDto } from './dto/update-process.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class ProcessService {
  private logger = new Logger();

  @InjectEntityManager()
  private entityManager: EntityManager;
  // 发起流程
  async add(processDto: CreateProcessDto, userId: number) {
    const promoter = await this.entityManager.findOneBy(User, {
      id: userId,
    });
    const cc_to = await this.entityManager.findOneBy(User, {
      id: processDto.cc_to_id,
    });
    const approver = await this.entityManager.findOneBy(User, {
      id: processDto.approver_id,
    });

    const process = new Process();
    process.promoter = promoter;
    process.cc_to = cc_to;
    process.approver = approver;
    process.status_description = '流程正常发起';
    process.type = processDto.type;
    process.title = processDto.title;
    process.content = processDto.content;
    process.cost = processDto.cost;

    try {
      await this.entityManager.save(Process, process);
      return 'success';
    } catch (e) {
      this.logger.error(e, ProcessService);
      return 'fail';
    }
  }
  // 删除流程
  async delete(processId: number, userId: number) {
    const process = await this.entityManager.findOne(Process, {
      where: {
        id: processId,
      },
      relations: {
        promoter: true,
        cc_to: true,
        approver: true,
      },
    });

    if (
      process.promoter.id !== userId &&
      process.approver.id !== userId &&
      process.cc_to.id !== userId
    ) {
      throw new BadRequestException('流程用户错误');
    }
    if (!process || process.delete_time) {
      throw new BadRequestException('流程不存在!');
    }

    process.delete_time = new Date();
    try {
      await this.entityManager.save(Process, process);
      return 'success';
    } catch (e) {
      this.logger.error(e, ProcessService);
      return 'fail';
    }
  }
  // 流程列表
  async getList(
    page: number,
    size: number,
    promoter_name: string,
    cc_to_name: string,
    approver_name: string,
    type: string,
    title: string,
  ) {
    const skipCount = (page - 1) * size;
    const condition: Record<string, any> = {};
    if (promoter_name) {
      condition.promoter = {
        name: Like(`%${promoter_name}%`),
      };
    }
    if (cc_to_name) {
      condition.cc_to = {
        name: Like(`%${cc_to_name}%`),
      };
    }
    if (approver_name) {
      condition.approver = {
        name: Like(`%${approver_name}%`),
      };
    }
    if (type) condition.type = type;
    if (title) condition.title = title;

    const userInfo = {
      id: true,
      name: true,
      username: true,
      email: true,
      student_id: true,
      from: true,
      guardian_name: true
    }

    const [processList, totalCount] = await this.entityManager.findAndCount(
      Process,
      {
        where: condition,
        select: {
          id: true,
          promoter: userInfo,
          cc_to: userInfo,
          approver: userInfo,
          type: true,
          status: true,
          status_description: true,
          title: true,
          content: true,
          cost: true,
          create_time: true,
          update_time: true,
          delete_time: true
        },
        relations: {
          promoter: true,
          cc_to: true,
          approver: true,
        },
        skip: skipCount,
        take: size,
      },
    );

    return {
      processList,
      totalCount,
    };
  }
  // 修改流程
  async update(updateProcess: UpdateProcessDto) {
    const process = await this.entityManager.findOneBy(Process, {
      id: updateProcess.id,
    });
    if (!process || process.delete_time) {
      throw new BadRequestException('流程不存在!');
    }

    process.title = updateProcess.title;
    process.content = updateProcess.content;
    process.cost = updateProcess.cost;

    try {
      await this.entityManager.save(Process, process);
      return 'success';
    } catch (e) {
      this.logger.error(e, ProcessService);
      return 'fail';
    }
  }
  // 审批状态修改
  async updateStatus(updateStatus: UpdateStatusDto) {
    const process = await this.entityManager.findOneBy(Process, {
      id: updateStatus.id
    });
    if (!process || process.delete_time) {
      throw new BadRequestException('流程不存在!');
    }

    process.status = updateStatus.status;
    process.status_description = updateStatus.status_description;

    try {
      await this.entityManager.save(Process, process);
      return 'success';
    } catch (e) {
      this.logger.error(e, ProcessService);
      return 'fail';
    }
  }
}
