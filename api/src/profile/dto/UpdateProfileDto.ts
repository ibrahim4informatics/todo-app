import { IsOptional, IsString, Matches, MaxLength } from "class-validator"

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    @MaxLength(35)
    @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[-'\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/, {message:"invalid name typed"})
    first_name?:string
    @IsString()
    @IsOptional()
    @MaxLength(35)
    @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[-'\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/, {message:"invalid name typed"})
    last_name?:string
    @IsString()
    @IsOptional()
    @MaxLength(300)
    bio?:string
} 