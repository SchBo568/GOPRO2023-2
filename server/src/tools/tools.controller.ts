import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { Tool } from 'src/typeorm/entities/Tool';

import { CreateToolDto } from 'src/dtos/createToolDto.dto';
import { User } from 'src/typeorm/entities/User';
import { Kiosk } from 'src/typeorm/entities/Kiosk';
import { KiosksService } from 'src/kiosks/kiosks.service';
import { DeleteResult, UpdateResult } from 'typeorm';

import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '../auth/auth.guard';
import { log } from 'console';

@Controller('tools')
export class ToolsController {

    constructor(private toolsService: ToolsService) {}

    async sendResponse(data: Tool[] | null, resource: string){

        if(await data != undefined){
            return {
                status: 'success',
                code: 200,
                data: data
            }
        }
        else{
            return {
                status: 'error',
                code: 404,
                message: resource +" not found"
            }
        }
    }
    
    @UseGuards(AuthGuard)
    @Post()
    async createTool(@Body() createTool: CreateToolDto): Promise<any> {
        try{
            return this.toolsService.createTool(createTool);
        }
        catch(e){
            return this.sendResponse(null, e.message);
        }
    }

    @Get(':id')
    async getTool(@Param('id') idTool: number): Promise<Tool | any> {
        let tool = await this.toolsService.getTool(idTool);
        if(tool){
            return tool;
        }
        else{
            return this.sendResponse(null, "Tool");
        }
    }   

    @Get()
    async getTools(): Promise<any> {
        return this.sendResponse(await this.toolsService.getTools(), "Tools");
    }

    @UseGuards(AuthGuard)
    @Get('/owner/:username')
    async getToolByUsername(@Param('username') username: string): Promise<any> {
        try{
            let data = await this.toolsService.getToolsByOwner(username);
            return this.sendResponse(data, "Tool")
        }
        catch(e){
            return this.sendResponse(null, e.message)
        }
    }

    @Get('/kiosk/:kioskId')
    async getToolsByKiosk(@Param('kioskId') kioskId: number): Promise<any> {
        try{
            let data = await this.toolsService.getToolsByKiosk(kioskId);
            return this.sendResponse(data, "Tool")
        }
        catch(e){         
            return this.sendResponse(null, e.message)
        }
    }

    @Put(':id')
    async updateTool(@Param('id') id: number, @Body() updateTool: CreateToolDto)/*: Promise<UpdateResult> */{
        /*const user =  await this.usersService.findUserByUsername(updateTool.userPKUsername)
        const kiosk:Kiosk = await this.kiosksService.getKiosk(updateTool.kioskPKLocationId).kiosk;
        const newTool:Tool = new Tool();
        newTool.name = updateTool.name;
        newTool.description = updateTool.description;
        newTool.availability = updateTool.availability;
        newTool.rental_rate = updateTool.rental_rate;
        newTool.condition = updateTool.condition;
        newTool.user = user[0];
        newTool.kiosk = kiosk;
        return this.toolsService.editTool(id, newTool);    */
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteTool(@Param('id') id: number): Promise<DeleteResult> {
        return this.toolsService.deleteTool(id);
    }
}


