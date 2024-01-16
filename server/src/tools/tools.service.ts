import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from 'src/categories/service/categories.service';
import { CreateToolDto } from 'src/dtos/createToolDto.dto';
import { KiosksService } from 'src/kiosks/kiosks.service';
import { Category } from 'src/typeorm/entities/Category';
import { Kiosk } from 'src/typeorm/entities/Kiosk';
import { Tool } from 'src/typeorm/entities/Tool';
import { UsersService } from 'src/users/users.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ToolsService {

    constructor(@InjectRepository(Tool) private toolRepo: Repository<Tool>, private usersService: UsersService, private kiosksService: KiosksService, private categoriesService: CategoriesService){}

    async createTool(tool: CreateToolDto): Promise<any> {
        const user =  await this.usersService.findUserByUsername(tool.userPKUsername)
        const kiosk:Kiosk = await this.kiosksService.getKiosk(tool.kioskPKLocationId);
        const category: Category = await this.categoriesService.getCategoryById(tool.categoryId);
        if(!user[0])
            throw new Error("User");
        else if(!kiosk)
            throw new Error("Kiosk");
        else if(!category){
            throw new Error("Category");
        } else {
            const newTool:Tool = new Tool();
            newTool.name = tool.name;
            newTool.description = tool.description;
            newTool.status = tool.status;
            newTool.rental_rate = tool.rental_rate;
            newTool.condition = tool.condition;
            newTool.code = tool.code;
            newTool.user = user[0];
            newTool.kiosk = kiosk;
            newTool.category = category;
            return await this.toolRepo.save(newTool);
        }
    }

    async getTool(id: number): Promise<Tool | undefined> {
        return this.toolRepo.findOne({
          where: { PK_tool_id: id },
          relations: ['review', 'kiosk', 'category'],
        });
      }

    getToolsByName(name:string): Promise<Tool[]> {
        return this.toolRepo.find({where: {name: name}})
    }

    async getToolsByKiosk(kioskId: number): Promise<Tool[]> {
        let kiosk = await this.kiosksService.getKiosk(kioskId);        
        if(kiosk)
            return this.toolRepo.find({where: {kiosk: {PK_location_id:kioskId}}})
        else
            throw new Error("Kiosk");
    }

    async getToolsByOwner(username: string): Promise<Tool[]> {
        let user = await this.usersService.findUserByUsername(username);
        if(user[0])
            return this.toolRepo.find({ where: {user: { PK_username: username}}});
        else
            throw new Error("User");
    }

    getTools(): Promise<Tool[]> {
        return this.toolRepo.find();
    }

    editTool(id:number, editTool: Tool): Promise<UpdateResult> {
        console.log(editTool.status)
        return this.toolRepo.update(id, editTool);
    }

    deleteTool(id:number): Promise<DeleteResult> {
        return this.toolRepo.delete(id);
    }
}
