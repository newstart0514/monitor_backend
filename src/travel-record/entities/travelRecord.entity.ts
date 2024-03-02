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
  name: 'travelRecord',
})
export class TravelRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column({
    name: 'status',
    length: 10,
    default: '0',
    comment: '记录状态',
  })
  status: string;

  @Column({
    name: 'from',
    length: 200,
    comment: '记录起点',
  })
  from: string;

  @Column({
    name: 'to',
    length: 200,
    comment: '记录终点',
  })
  to: string;

  @Column({
    name: 'from_city',
    length: 200,
    comment: '起点城市',
  })
  from_city: string;

  @Column({
    name: 'to_city',
    length: 200,
    comment: '终点城市',
  })
  to_city: string;

  @Column({
    name: 'type',
    length: 10,
    comment: '出行类型',
  })
  type: string;

  @Column({
    name: 'car_type',
    length: 10,
    comment: '交通工具类型',
  })
  car_type: string;

  @Column({
    name: 'description',
    length: 200,
    comment: '记录备注',
  })
  description: string;

  @Column({
    name: 'start_time',
    nullable: true,
  })
  start_time: Date;

  @Column({
    name: 'end_time',
    nullable: true,
  })
  end_time: Date;

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
