import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateProcessDto {
  @IsNotEmpty({
    message: 'id不能为空'
  })
  @IsNumber()
  id: number;

  @IsNotEmpty({
    message: '流程标题不能为空'
  })
  title: string;

  @IsNotEmpty({
    message: '流程内容不能为空'
  })
  content: string;

  cost: string;
}