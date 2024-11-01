import {createParamDecorator,ExecutionContext} from '@nestjs/common';
import { Request } from 'express';

export const Cookies = createParamDecorator((key:string, context:ExecutionContext):string | null =>{
  const request = context.switchToHttp().getRequest<Request>();

  const value = request.cookies[key];
  return value ? value : null;
})