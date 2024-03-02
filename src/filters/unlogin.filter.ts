// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpStatus,
// } from '@nestjs/common';
// import { Response } from 'express';

import { HttpStatus, UnauthorizedException } from "@nestjs/common";

// export class UnLoginException {
//   message: string;

//   constructor(message?) {
//     this.message = message;
//   }
// }

// @Catch(UnLoginException)
// export class UnloginFilter implements ExceptionFilter {
//   catch(exception: UnLoginException, host: ArgumentsHost) {
//     const response = host.switchToHttp().getResponse<Response>();
//     response
//       .json({
//         code: HttpStatus.UNAUTHORIZED,
//         message: 'fail',
//         data: exception.message || '用户未登录',
//       })
//       .end();
//   }
// }

// note:使用未认证的错误来自定义错误，以免无法捕捉到错误
export class UnLoginException extends UnauthorizedException {
  constructor(message?) {
    super({
      code: HttpStatus.UNAUTHORIZED,
      message: 'fail',
      data: message || '用户未登录',
    });
  }
}