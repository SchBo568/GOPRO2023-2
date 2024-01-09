import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateDateRangeDto } from 'src/dtos/createDateRange.dto';
import { DateRange } from 'src/typeorm/entities/DateRange';
import { DateRangesService } from '../service/date-ranges.service';

@Controller('date-ranges')
export class DateRangesController {
    constructor(private dateRangesService: DateRangesService) {}

    @Post()
    async createDateRange(@Body() createDateRange: CreateDateRangeDto): Promise<any> {
        return this.dateRangesService.createDateRange(createDateRange);
    }

    @Get(':toolId')
    async getDateRangesByToolId(@Param('toolId') toolId: number): Promise<DateRange[] | string> {
        return this.dateRangesService.getDateRangesByToolId(toolId);
    }

    @Delete(':id')
    async deleteDateRangeById(@Param('id') id: number): Promise<any> {
        return this.dateRangesService.deleteDateRangeById(id);
    }
}
