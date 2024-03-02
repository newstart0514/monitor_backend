import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import { RefreshTokenVo } from './vo/refresh.vo';
import { generateParseIntPipe } from 'src/utils/encryption';
import { UserInfoVo } from './vo/user-info.vo';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UserInfoDto } from './dto/user-info.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Post('login')
  async userLogin(@Body() LoginUser: LoginUserDto) {
    const vo = await this.userService.login(LoginUser);
    vo.accessToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
        username: vo.userInfo.username,
        roles: vo.userInfo.role,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );
    vo.refreshToken = this.jwtService.sign(
      {
        userId: vo.userInfo.id,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expres_time') || '7d',
      },
    );
    return vo;
  }

  @Get('captcha')
  async getCaptcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);
    await this.emailService.sendMail({
      to: address,
      subject: '用户身份验证操作',
      html: `<p>你的验证码是${code}，5分钟内有效，请你尽快验证!</p>`,
    });
    return 'success';
  }

  @Get('refresh')
  // @RequireLogin()
  async refresh(@Query('refresh_token') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId);
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.role,
        },
        {
          expiresIn:
            this.configService.get('jwt_access_token_expires_time') || '30m',
        },
      );
      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get('jwt_refresh_token_expres_time') || '7d',
        },
      );

      const vo = new RefreshTokenVo();
      vo.access_token = access_token;
      vo.refresh_token = refresh_token;
      return vo;
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  @Get('delete')
  async deleteUser(@Query('id') id: number) {
    return this.userService.deleteUser(id);
  }

  @Get('list')
  async getUserList(
    @Query('page', new DefaultValuePipe(1), generateParseIntPipe('page'))
    page: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(10),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('name') name: string,
    @Query('student_id') student_id: string,
    @Query('from') from: string,
    @Query('guardian_name') guardian_name: string,
  ) {
    const vo = await this.userService.findUsers(
      page,
      pageSize,
      name,
      student_id,
      from,
      guardian_name,
    );
    return vo;
  }

  @Get('info')
  async getUserInfo(@Query('userId') userId: number) {
    // ToDo: 这里需要注意，需要对用户以及管理员进行不同的处理，管理员处理按照这个思路即可，用户思路只需获取token的id查询，防止被脱库
    const user = await this.userService.findUserDetailById(userId);

    const vo = new UserInfoVo();
    vo.id = user.id;
    vo.username = user.username;
    vo.avatar = user.avatar;
    vo.email = user.email;
    vo.from = user.from;
    vo.guardian_name = user.guardian_name;
    vo.guardian_phone = user.guardian_phone;
    vo.is_frozen = user.is_frozen;
    vo.student_id = user.student_id;
    vo.phone = user.phone;
    vo.role = user.role;

    return vo;
  }

  @Post('updatePassword')
  async updatePassword(@Body() updatePassword: UpdatePasswordDto) {
    return this.userService.updatePassword(updatePassword);
  }

  @Post('updateEmail')
  async updateEmail(@Body() updateEmail: UpdateEmailDto) {
    return this.userService.updateEmail(updateEmail);
  }

  @Post('update')
  async update(@Body() userInfo: UserInfoDto) {
    return this.userService.updateUser(userInfo);
  }

  @Get('frozen')
  async frozen(@Query('userId') userId: number) {
    return this.userService.frozenUser(userId, true);
  }

  @Get('unfrozen')
  async unfrozen(@Query('userId') userId: number) {
    return this.userService.frozenUser(userId, false);
  }

  @Get('updateRole')
  async updateRole(
    @Query('userId') userId: number,
    @Query('newRole') newRole: string,
  ) {
    return this.userService.updateRoles(userId, newRole);
  }
}
