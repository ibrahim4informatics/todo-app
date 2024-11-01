import { LocalUserLoginDto } from '../dto/LocalUserLoginDto';
import { LocalUserRegisterDto } from '../dto/LocalUserRegisterDto';
import { Response } from 'express';

export interface AuthServiceInterface {
    registerLocalUser(localUserRegisterDto:LocalUserRegisterDto): Promise<any>
    loginLocalUser(localUserLoginDto:LocalUserLoginDto,res:Response): Promise<any>
}