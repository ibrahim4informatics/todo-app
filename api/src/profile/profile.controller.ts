import { Controller,Delete,Get,Patch,UseGuards } from "@nestjs/common";
import { GeneralAuthenticator } from "src/auth/guards/GeneralAuthenticator";

@Controller("profile")
@UseGuards(GeneralAuthenticator)
export class ProfileController{
    

    @Get()
    getUserProfile(){}

    @Patch()
    updateUserProfile(){}

    @Delete()
    deleteUserProfile(){}
}