import { Matches, IsString, IsNotEmpty, IsEmail, IsStrongPassword, Min, Max, IsOptional } from 'class-validator';
import {Equals} from '../../custom-validators/Equals';
import { LocalUserLoginDto } from './LocalUserLoginDto';



export class LocalUserRegisterDto extends LocalUserLoginDto {

  // credentials email + password comes from LocalUserLoginDto and adding confirm password field
  @IsString({message:"confirm must be text"})
  @IsString({message:"confirm must be text"})
  @IsNotEmpty({message:"confirm is required"})
  @Equals('password', {message:"password does not match"})
  confirm:string

  @IsString({message:"first_name must be string"})
  @IsNotEmpty({message:"first_name is required"})
  @Min(3, {message:"first_name must contain at least 3 characters"})
  @Max(35, {message:"first_name exceeded the maximal value"})
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[-'\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/, {message:"invalid name typed"})
  first_name:string

  @IsString({message:"last_name must be string"})
  @IsNotEmpty({message:"last_name is required"})
  @Min(3, {message:"last_name must contain at least 3 characters"})
  @Max(35, {message:"last_name exceeded the maximal value"})
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[-'\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/, {message:"invalid name typed"})
  last_name:string

  @IsString({message:"bio must be string"})
  @IsOptional()
  @Max(300, {message:"bio length exceeded the max"})
  bio:string



}