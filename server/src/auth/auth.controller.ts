import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.', type: [String]})
  @ApiResponse({ status: 403, description: 'Wrong password'})
  @Post('login')
  signIn(@Body() body: {username: string, password:string}): Promise<LoginDto> {    
    return this.authService.signIn(body.username, body.password);
  }
}