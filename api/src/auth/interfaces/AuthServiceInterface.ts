import { LocalUserLoginDto } from '../dto/LocalUserLoginDto';
import { LocalUserRegisterDto } from '../dto/LocalUserRegisterDto';
import { Response } from 'express';
import { AuthReq } from '../guards/GeneralAuthenticator';

export interface AuthServiceInterface {
  registerLocalUser(localUserRegisterDto: LocalUserRegisterDto): Promise<any>;
  loginLocalUser(
    localUserLoginDto: LocalUserLoginDto,
    res: Response,
  ): Promise<any>;
  loginGoogleUSer(req: AuthReq, res: Response): Promise<void>;
  checkAuth(req: AuthReq): Promise<any>;

  // changePasswordRequest(req: AuthReq, res: Response): Promise<void>;
}
