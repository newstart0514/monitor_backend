import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateRecordDto {
  @IsNotEmpty({
    message: '记录id不能为空'
  })
  @IsNumber()
  id: number;

  @IsNotEmpty({
    message: '记录起点不能为空',
  })
  from: string;

  @IsNotEmpty({
    message: '记录终点不能为空',
  })
  to: string;

  @IsNotEmpty({
    message: '起点城市不能为空',
  })
  from_city: string;

  @IsNotEmpty({
    message: '终点城市不能为空',
  })
  to_city: string;

  @IsNotEmpty({
    message: '出行类型不能为空',
  })
  type: string;

  @IsNotEmpty({
    message: '交通工具类型不能为空',
  })
  car_type: string;

  @IsNotEmpty({
    message: '描述不能为空',
  })
  description: string;

  @IsNotEmpty({
    message: '预计开始时间不能为空',
  })
  start_time: Date;

  @IsNotEmpty({
    message: '预计结束时间不能为空',
  })
  end_time: Date;
}
