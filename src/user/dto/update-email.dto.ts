import { IsEmail, IsNotEmpty } from "class-validator";

export class UpdateEmailDto {
  @IsNotEmpty({
    message: '用户名不能为空'
  })
  username: string;

  @IsNotEmpty({
    message: '新的邮箱地址不能为空'
  })
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  newEmail: string;

  @IsNotEmpty({
    message: '验证码不能为空'
  })
  captcha: string;
}