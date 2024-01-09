import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from 'src/dtos/createCategory.dto';
import { Category } from 'src/typeorm/entities/Category';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
    constructor(@InjectRepository(Category) private categoryRepo: Repository<Category>){}

    async createCategory(category: CreateCategoryDto) {
        this.categoryRepo.save(category);
        return {
            "status": "OK",
            "code": 200,
            "message": ["Category added successfully"]
        }
    }

    async getCategories(): Promise<Category[]> {
        return this.categoryRepo.find();
    }

    async getCategoryById(id: number): Promise<Category | any> {
        const category = await this.categoryRepo.findOne({where: {PK_category_id: id}})
        if(category){
            return category;
        } else {
            throw new Error("Category");
        }

    }

    async deleteCategoryById(id: number): Promise<DeleteResult> {
        return this.categoryRepo.delete(id);
    }
}
