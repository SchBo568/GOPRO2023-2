import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateKioskDto } from '../dtos/createKiosk.dto';
import { KiosksService } from './kiosks.service';
import { Kiosk } from 'src/typeorm/entities/Kiosk';

@Controller('kiosks')
export class KiosksController {

    constructor(private kiosksService: KiosksService) {}

    @Post('addKiosk')
    async createKiosk(@Body() pKiosk: CreateKioskDto) {
        return this.kiosksService.createKiosk(pKiosk);
    }

    @Get()
    async getKiosks() {
        return this.kiosksService.getKiosks();
    }

    @Get('getKioskByDistance')
    async getKiosksByDistance(){
        return this.kiosksService.getKiosksByDistance(2, "Petange");
    }
}
