import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsNull, Like, Repository } from 'typeorm';
import { md5 } from 'src/utils/encryption';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';
import { RefreshInfoVo } from './vo/refresh.vo';
import { UserListVo } from './vo/user-list.vo';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UserInfoDto } from './dto/user-info.dto';

@Injectable()
export class UserService {
  private logger = new Logger();

  @Inject(RedisService)
  private redisService: RedisService;

  @InjectRepository(User)
  private userRepository: Repository<User>;
  // 注册
  async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (user.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.name = user.name;
    newUser.email = user.email;
    newUser.avatar = user.avatar;
    newUser.phone = user.phone;
    newUser.student_id = user.student_id;
    newUser.from = user.from;
    newUser.guardian_name = user.guardian_name;
    newUser.guardian_phone = user.guardian_phone;

    try {
      await this.userRepository.save(newUser);
      return 'success';
    } catch (e) {
      this.logger.error(e, UserService);
      return 'fail';
    }
  }
  // 登录
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username,
      },
      // relations: []
    });

    if (!user || user.delete_time) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (user.password !== md5(loginUserDto.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      create_time: user.create_time.getTime(),
      update_time: user.update_time.getTime(),
    };

    return vo;
  }
  // 根据id查找用户
  async findUserById(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        delete_time: IsNull(),
      },
    });

    const vo = new RefreshInfoVo();
    vo.id = user.id;
    vo.username = user.username;
    vo.role = user.role;

    return vo;
  }
  // 删除用户   需要管理员才能调用
  async deleteUser(userId: number) {
    const foundUser = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!foundUser || foundUser.delete_time) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    foundUser.delete_time = new Date();
    try {
      await this.userRepository.save(foundUser);
      return 'success';
    } catch (e) {
      this.logger.error(e, UserService);
      return 'fail';
    }
  }
  // 获取用户列表
  async findUsers(
    pageNo: number,
    pageSize: number,
    name: string,
    student_id: string,
    from: string,
    guardian_name: string,
  ) {
    const skipCount = (pageNo - 1) * pageSize;
    const condition: Record<string, any> = {};

    if (name) {
      condition.name = Like(`%${name}%`);
    }
    if (student_id) {
      condition.student_id = Like(`%${student_id}%`);
    }
    if (from) {
      condition.from = Like(`%${from}%`);
    }
    if (guardian_name) {
      condition.guardian_name = Like(`%${guardian_name}%`);
    }
    condition.delete_time = IsNull();

    const [users, totalCount] = await this.userRepository.findAndCount({
      select: [
        'id',
        'username',
        'name',
        'email',
        'avatar',
        'phone',
        'student_id',
        'from',
        'guardian_name',
        'guardian_phone',
        'is_frozen',
        'role',
      ],
      skip: skipCount,
      take: pageSize,
      where: condition,
    });

    const vo = new UserListVo();
    vo.users = users;
    vo.total = totalCount;
    return vo;
  }
  // 获取用户信息   后续需要根据实际需求改进
  async findUserDetailById(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        delete_time: IsNull(),
      },
    });
    return user;
  }
  // 更新用户密码   后续需要根据实际需求改进
  async updatePassword(updaterPasswordDto: UpdatePasswordDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: updaterPasswordDto.username,
    });
    if (!foundUser || foundUser.delete_time) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    const captcha = await this.redisService.get(`captcha_${foundUser.email}`);
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    if (updaterPasswordDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    foundUser.password = md5(updaterPasswordDto.newPassword);
    try {
      await this.userRepository.save(foundUser);
      return 'success';
    } catch (e) {
      this.logger.error(e, UserService);
      return 'fail';
    }
  }
  // 更改用户邮箱    后续需要根据实际需求改进
  async updateEmail(updateEmailDto: UpdateEmailDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: updateEmailDto.username,
    });
    if (!foundUser || foundUser.delete_time) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    const captcha = await this.redisService.get(`captcha_${foundUser.email}`);
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }
    if (updateEmailDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    foundUser.email = updateEmailDto.newEmail;
    try {
      await this.userRepository.save(foundUser);
      return 'success';
    } catch (e) {
      this.logger.error(e, UserService);
      return 'fail';
    }
  }
  // 更新用户信息   后续需要根据实际需求改进
  async updateUser(userInfoDto: UserInfoDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: userInfoDto.username,
    });
    if (!foundUser || foundUser.delete_time) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    foundUser.name = userInfoDto.name;
    foundUser.avatar = userInfoDto.avatar;
    foundUser.phone = userInfoDto.phone;
    foundUser.student_id = userInfoDto.student_id;
    foundUser.from = userInfoDto.from;
    foundUser.guardian_name = userInfoDto.guardian_name;
    foundUser.guardian_phone = userInfoDto.guardian_phone;

    try {
      await this.userRepository.save(foundUser);
      return 'success';
    } catch (e) {
      this.logger.error(e, UserService);
      return 'fail';
    }
  }
  // 冻结/解冻用户
  async frozenUser(userId: number, forzenFlag: boolean) {
    const foundUser = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!foundUser || foundUser.delete_time) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (forzenFlag) {
      if (foundUser.is_frozen) {
        throw new HttpException(
          '用户已冻结，请勿重复冻结',
          HttpStatus.BAD_REQUEST,
        );
      }
      foundUser.is_frozen = true;
    } else {
      if (!foundUser.is_frozen) {
        throw new HttpException(
          '用户已解冻，请勿重复解冻',
          HttpStatus.BAD_REQUEST,
        );
      }
      foundUser.is_frozen = false;
    }
    try {
      await this.userRepository.save(foundUser);
      return 'success';
    } catch (e) {
      this.logger.error(e, UserService);
      return 'fail';
    }
  }
  // 更改角色权限
  async updateRoles(userId: number, newRole: string) {
    if (newRole !== '0' && newRole !== '1' && newRole !== '2') {
      throw new HttpException('角色权限错误', HttpStatus.BAD_REQUEST);
    }
    const foundUser = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!foundUser || foundUser.delete_time) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (foundUser.role === newRole) {
      throw new HttpException(
        '角色权限已更改，请勿重复更改',
        HttpStatus.BAD_REQUEST,
      );
    }
    foundUser.role = newRole;
    try {
      await this.userRepository.save(foundUser);
      return 'success';
    } catch (e) {
      this.logger.error(e, UserService);
      return 'fail';
    }
  }
}
