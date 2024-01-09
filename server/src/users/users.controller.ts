import { Body, Controller, Delete, Get, Patch, Post, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from 'src/users/CreateUser.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { use } from 'passport';
import { UpdateUserDto } from './UpdateUser.dto';


@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'All users retrieved.', type: [CreateUserDto]})
    @Get()
    async getUsers() {
        return await this.userService.findAll()
    }
    
    @ApiOperation({ summary: 'Create user' })
    @ApiResponse({ status: 200, description: 'User created successfully.'})
    @ApiResponse({ status: 500, description: 'Bad request.'})
    @ApiResponse({ status: 400, description: 'This user already exists.'})
    @Post('register')
    @UsePipes(new ValidationPipe())
    async createUser(@Body() body: {user: CreateUserDto}) {
        console.log("Step1")
        return await this.userService.createUsers(body.user)
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'User updated successfully.'})
    @ApiResponse({ status: 400, description: 'Bad request.'})
    @Put('updateUser')
    async updateUser(@Body() body: {username: string, userDetails: UpdateUserDto}) {
        return await this.userService.updateUser(body.username, body.userDetails)
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Update password' })
    @ApiResponse({ status: 200, description: 'Password updated successfully.'})
    @ApiResponse({ status: 400, description: 'Bad request.'})
    @Put('updatePassword')
    async updatePassword(@Body() body: {username: string, oldPassword: string, newPassword: string}) {
        console.log("Called")
        return await this.userService.updatePassword(body.username, body.newPassword, body.oldPassword)
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Delete user' })
    @ApiResponse({ status: 200, description: 'User deleted successfully.'})
    @ApiResponse({ status: 400, description: 'Bad request.'})
    @Delete('delete')
    async deleteUser(username: string) {
        return await this.userService.deleteUser(username)
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Add Kiosk to a user'})
    @ApiResponse({ status: 200, description: 'Kiosk added successfully.'})
    @ApiResponse({ status: 400, description: 'Bad request.'})
    @Patch('addKiosk')
    async addKiosk(@Body() body: {username: string, kioskId: number}) {
        return await this.userService.addKioskToUser(body.username, body.kioskId)
    }
}

