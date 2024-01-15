import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateDateRangeDto } from 'src/dtos/createDateRange.dto';
import { DateRange } from 'src/typeorm/entities/DateRange';
import { DateRangesService } from '../service/date-ranges.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('date-ranges')
export class DateRangesController {
    constructor(private dateRangesService: DateRangesService) {}

    @UseGuards()
    @Post()
    async createDateRange(@Body() createDateRange: CreateDateRangeDto): Promise<any> {
        return this.dateRangesService.createDateRange(createDateRange);
    }

    @Get(':toolId')
    async getDateRangesByToolId(@Param('toolId') toolId: number): Promise<DateRange[] | string> {
        return this.dateRangesService.getDateRangesByToolId(toolId);
    }

    @UseGuards()
    @Delete(':id')
    async deleteDateRangeById(@Param('id') id: number): Promise<any> {
        return this.dateRangesService.deleteDateRangeById(id);
    }
}
