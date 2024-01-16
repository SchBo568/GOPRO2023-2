import { Injectable } from '@nestjs/common';
import { Review } from 'src/typeorm/entities/Review';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from 'src/dtos/createReview.dto';
import { UsersService } from 'src/users/users.service';
import { CreateRatingDto } from 'src/dtos/createRating.dto';
import { ToolsService } from 'src/tools/tools.service';

@Injectable()
export class ReviewsService {
  constructor(@InjectRepository(Review) private reviewRepo: Repository<Review>, private usersService: UsersService, private toolsService: ToolsService) { }

  async createRating(createRating: CreateRatingDto): Promise<Review | any> {
    const user1 = await this.usersService.findUserByUsername(createRating.reviewedUserId)
    const user2 = await this.usersService.findUserByUsername(createRating.reviewingUserId)
    if (user1 && user2) {
      const review = new Review()
      review.stars = createRating.stars;
      review.comment = createRating.comment;
      review.timestamp = createRating.timestamp;
      review.reviewedUser = user1[0];
      review.reviewingUser = user2[0];
      this.reviewRepo.save(review)

      return {
        "status": "OK",
        "code": 200,
        "message": ["Rating added successfully"]
      }
    } else {
      if (!user1) {
        return {
          "status": "ERROR",
          "code": 404,
          "message": ["The user to be rated does not exist"]
        }
      } else {
        return {
          "status": "ERROR",
          "code": 404,
          "message": ["The user that wants to rate someone does not exists!"]
        }
      }
    }
  }

  async createReview(createReview: CreateReviewDto) {
    const user = await this.usersService.findUserByUsername(createReview.reviewingUserId)
    const tool = await this.toolsService.getTool(createReview.toolId);
    if (user && tool) {
      const review = new Review()
      review.stars = createReview.stars;
      review.comment = createReview.comment;
      review.timestamp = createReview.timestamp;
      review.tool = tool
      review.reviewingUser = user[0]
      this.reviewRepo.save(review)

      return {
        "status": "OK",
        "code": 200,
        "message": ["Review added successfully"]
      }
    } else if (!tool) {
      return {
        "status": "ERROR",
        "code": 404,
        "message": ["The tool does not exist"]
      }
    } else {
      return {
        "status": "ERROR",
        "code": 404,
        "message": ["The user that wants to review does not exists!"]
      }
    }
  }

  async getRatingByUsername(username: string) {
    if ((await this.usersService.findUserByUsername(username)).length == 0) {
      return {
        "status": "ERROR",
        "code": 404,
        "message": ["The user does not exist"]
      }
    }
    else {
      let ratings = this.reviewRepo.find({
        where: { reviewedUser: { PK_username: username } },
        relations: ['reviewingUser'],
      })

      return {
        "status": "OK",
        "code": 200,
        "ratings": ratings
      }
    }


  }

  async getReviewByToolId(toolId): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { tool: { PK_tool_id: toolId } },
      relations: ['reviewingUser'],
    })
  }

  findAll() {
    return this.reviewRepo.find()
  }

  findOne(id: number) {
    return this.reviewRepo.findOne({ where: { PK_review_id: id } })
  }

  update(id: number, newReview: Review) {
    if(this.reviewRepo.findOne({ where: { PK_review_id: id } }) == null){
      return {
        "status": "ERROR",
        "code": 404,
        "message": ["The review does not exist"]
      }
    }
    else {
      this.reviewRepo.update(id, newReview)
      return {
        "status": "OK",
        "code": 200,
        "message": ["Review updated successfully"]
      }
    }
  }

  remove(id: number) {
    if(this.reviewRepo.findOne({ where: { PK_review_id: id } }) == null){
      return {
        "status": "ERROR",
        "code": 404,
        "message": ["The review does not exist"]
      }
    }
    else {
      this.reviewRepo.delete(id)
      return {
        "status": "OK",
        "code": 200,
        "message": ["Review deleted successfully"]
      }
    }
  }
}
