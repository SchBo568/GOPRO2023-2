import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDateRangeDto } from 'src/dtos/createDateRange.dto';
import { ToolsService } from 'src/tools/tools.service';
import { DateRange } from 'src/typeorm/entities/DateRange';
import { Tool } from 'src/typeorm/entities/Tool';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class DateRangesService {
    constructor(
        @InjectRepository(DateRange) private dateRangeRepo: Repository<DateRange>, 
        private toolService: ToolsService
        ){}

    async createDateRange(createDateRange: CreateDateRangeDto): Promise<any> {
        const tool = await this.toolService.getTool(createDateRange.toolId)
        console.log(tool)
        if(tool) {
            const dateRange = new DateRange();
            dateRange.start = createDateRange.start;
            dateRange.end = createDateRange.end;
            dateRange.tool = tool;
            return this.dateRangeRepo.save(dateRange);
        } else {
            return "No tool found by this id";
        }
    }

    async getDateRangesByToolId(id: number): Promise<DateRange[] | any> {
        const tool = this.toolService.getTool(id)
        if(tool) {
            const toolArray = this.dateRangeRepo.find({where: {tool: {PK_tool_id: (await tool).PK_tool_id}}})
            if(toolArray) {
                return toolArray;
            } else {
                return "No ranges found, everyday is range day";
            }
        } else {
            return "No tool by this Id found!";
        }
    }

    async deleteDateRangeById(id: number): Promise<DeleteResult> {
        return this.dateRangeRepo.delete(id);
    }
}
