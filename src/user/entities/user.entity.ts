import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'username',
    length: 50,
    comment: '用户名',
  })
  username: string;

  @Column({
    name: 'password',
    length: 50,
    comment: '用户密码',
  })
  password: string;

  @Column({
    name: 'name',
    length: 50,
    comment: '用户姓名',
  })
  name: string;

  @Column({
    name: 'email',
    length: 50,
    comment: '用户邮箱',
  })
  email: string;

  @Column({
    name: 'avatar',
    length: 100,
    comment: '用户头像url',
  })
  avatar: string;

  @Column({
    name: 'phone',
    length: 20,
    comment: '用户手机号',
  })
  phone: string;

  @Column({
    name: 'student_id',
    length: 50,
    comment: '学号',
  })
  student_id: string;

  @Column({
    name: 'from',
    length: 50,
    comment: '班级',
  })
  from: string;

  @Column({
    name: 'guardian_name',
    length: 50,
    comment: '监护人姓名',
  })
  guardian_name: string;

  @Column({
    name: 'guardian_phone',
    length: 50,
    comment: '监护人手机号码',
  })
  guardian_phone: string;

  @Column({
    name: 'is_frozen',
    comment: '账号是否被冻结',
    default: true,
  })
  is_frozen: boolean;

  @Column({
    name: 'role',
    length: 10,
    comment: '账号角色',
    default: '0'
  })
  role: string;

  @CreateDateColumn()
  create_time: Date;

  @UpdateDateColumn()
  update_time: Date;

  @Column({
    name: 'delete_time',
    nullable: true
  })
  delete_time: Date;
}
