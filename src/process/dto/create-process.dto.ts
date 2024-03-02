import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateProcessDto {
  @IsNotEmpty({
    message: '抄送人不应为空'
  })
  @IsNumber()
  cc_to_id: number;

  @IsNotEmpty({
    message: '审批人不应为空'
  })
  @IsNumber()
  approver_id: number;

  @IsNotEmpty({
    message: '类型不应为空'
  })
  type: string;

  @IsNotEmpty({
    message: '流程标题不能为空'
  })
  title: string;

  @IsNotEmpty({
    message: '流程内容不能为空'
  })
  content: string;

  @IsNotEmpty({
    message: '流程资源不能为空'
  })
  cost: string;
}