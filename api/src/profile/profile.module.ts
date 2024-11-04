import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";


@Module({
    providers:[],
    controllers:[ProfileController],
    imports:[],
    exports:[]
})
export class ProfileModule {}