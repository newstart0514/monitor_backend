import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '用户姓名不能为空',
  })
  name: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能少于 6 位',
  })
  password: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  email: string;

  @IsNotEmpty({
    message: '头像地址不能为空'
  })
  avatar: string;

  @IsNotEmpty({
    message: '手机号码不能为空'
  })
  @MinLength(11, {
    message: '手机号码不正确',
  })
  phone: string;

  @IsNotEmpty({
    message: '学号不能为空'
  })
  student_id: string;

  @IsNotEmpty({
    message: '班级不能为空'
  })
  from: string;

  @IsNotEmpty({
    message: '监护人姓名不能为空'
  })
  guardian_name: string;

  @IsNotEmpty({
    message: '监护人手机号不能为空'
  })
  @MinLength(11, {
    message: '手机号码不正确',
  })
  guardian_phone: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
