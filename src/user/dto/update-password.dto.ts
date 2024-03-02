import { IsNotEmpty, MinLength } from "class-validator";

export class UpdatePasswordDto {
  @IsNotEmpty({
    message: '用户名不能为空'
  })
  username: string;

  @IsNotEmpty({
    message: '新密码不能为空'
  })
  @MinLength(6, {
    message: '密码不能少于 6 位',
  })
  newPassword: string;

  @IsNotEmpty({
    message: '验证码不能为空'
  })
  captcha: string;
}