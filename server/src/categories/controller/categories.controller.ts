import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from '../service/categories.service';
import { CreateCategoryDto } from 'src/dtos/createCategory.dto';
import { Category } from 'src/typeorm/entities/Category';

@Controller('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {}

    @Post('addCategory')
    async createCategory(@Body() category: CreateCategoryDto) {
        return this.categoriesService.createCategory(category);
    }

    @Get()
    async getCategories() {
        return this.categoriesService.getCategories();
    }

    @Get(':id')
    async getCategory(@Param('id') categoryId: number): Promise<Category> {
        return this.categoriesService.getCategoryById(categoryId);
    }

    @Delete(':id')
    async deleteCategory(@Param('id') categoryId: number): Promise<any> {
        return this.categoriesService.deleteCategoryById(categoryId);
    }
}
