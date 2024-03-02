import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'process',
})
export class Process {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  promoter: User;

  @ManyToOne(() => User)
  cc_to: User;

  @ManyToOne(() => User)
  approver: User;

  @Column({
    name: 'type',
    comment: '流程类型',
    length: 10,
  })
  type: string;

  @Column({
    name: 'status',
    comment: '流程状态',
    default: '0',
    length: 10,
  })
  status: string;

  @Column({
    name: 'status_description',
    comment: '状态描述',
    length: 200,
  })
  status_description: string;

  @Column({
    name: 'title',
    length: 100,
    comment: '流程标题',
  })
  title: string;

  @Column({
    name: 'content',
    comment: '流程内容',
    length: 500,
  })
  content: string;

  @Column({
    name: 'cost',
    length: 100,
    comment: '流程资源',
  })
  cost: string;

  @CreateDateColumn()
  create_time: Date;

  @UpdateDateColumn()
  update_time: Date;

  @Column({
    name: 'delete_time',
    nullable: true,
  })
  delete_time: Date;
}
