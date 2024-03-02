import { IsNotEmpty, MinLength } from "class-validator";

export class UserInfoDto {
  @IsNotEmpty({
    message: '用户名不能为空'
  })
  username: string;

  @IsNotEmpty({
    message: '用户姓名不能为空'
  })
  name: string;

  @IsNotEmpty({
    message: '头像地址不能为空'
  })
  avatar: string;

  @IsNotEmpty({
    message: '手机号不能为空'
  })
  @MinLength(11, {
    message: '手机号码不正确'
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
    message: '监控人手机号'
  })
  @MinLength(11, {
    message: '手机号码不正确'
  })
  guardian_phone: string;
}