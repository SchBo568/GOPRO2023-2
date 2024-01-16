import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from 'src/typeorm/entities/Review';
import { CreateReviewDto } from 'src/dtos/createReview.dto';
import { CreateRatingDto } from 'src/dtos/createRating.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateReviewDto } from 'src/dtos/updateReviewDto';


@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @UseGuards()
  @Post('tool')
  createReview(@Body() createReview: CreateReviewDto) {
    return this.reviewsService.createReview(createReview);
  }

  @UseGuards()
  @Post('user')
  createRating(@Body() createRating: CreateRatingDto) {
    return this.reviewsService.createRating(createRating);
  }

  @Get('tool/:toolId')
  getReviewByToolId(@Param('toolId') toolId: string) {
    return this.reviewsService.getReviewByToolId(toolId);
  }

  @Get('user/:username')
  getRatingByUsername(@Param('username') username: string) {
    return this.reviewsService.getRatingByUsername(username);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  /*@Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {

    return this.reviewsService.update(+id, updateReviewDto);
  }*/

  @UseGuards()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
