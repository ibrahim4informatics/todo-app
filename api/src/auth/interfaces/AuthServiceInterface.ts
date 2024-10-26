import { User } from '@prisma/client';
import { LocalUserLoginDto } from '../dto/LocalUserLoginDto';
import { LocalUserRegisterDto } from '../dto/LocalUserRegisterDto';

export interface AuthServiceInterface {
    registerLocalUser(localUserRegisterDto:LocalUserRegisterDto): Promise<any>
    loginLocalUser(localUserLoginDto:LocalUserLoginDto): Promise<any>
}