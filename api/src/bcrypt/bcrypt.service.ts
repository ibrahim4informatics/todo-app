import {Injectable} from '@nestjs/common';
import { BcryptServiceInterface } from './interfaces/BcryptServiceInterface';
import {hash,compare,genSalt} from 'bcrypt'
@Injectable()
export class BcryptService implements BcryptServiceInterface{
  async hash(value: string): Promise<string> {
    const salt:string = await genSalt(12);
    return await hash(value,salt);
  }
  compare(value: string, hash: string): Promise<boolean> {
    return compare(value, hash);
  }
}