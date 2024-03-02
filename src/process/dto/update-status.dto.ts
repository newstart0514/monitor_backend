import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateStatusDto {
  @IsNotEmpty({
    message: 'id不能为空'
  })
  @IsNumber()
  id: number;

  @IsNotEmpty({
    message: '状态不能为空'
  })
  status: string;

  status_description: string;
}