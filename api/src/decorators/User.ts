import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthReq } from "src/auth/guards/GeneralAuthenticator";


export const User = createParamDecorator((key:'pid' | 'uid',cotext:ExecutionContext):string=>{
    const request = cotext.switchToHttp().getRequest<AuthReq>();
    return request.user[key];
})