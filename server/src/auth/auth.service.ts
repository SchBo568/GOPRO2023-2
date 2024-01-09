import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ExtractJwt } from 'passport-jwt';

import { LoginDto } from './login.dto';
import { User } from 'src/typeorm/entities/User';

@Injectable()
export class AuthService extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService, private jwtService: JwtService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
          });
    }

    async signIn(username: string, pass: string): Promise<any> {
        return this.usersService.login({PK_username: username, password: pass}).then(async (user: User) => {
            const payload = { username: username };
            const userData: LoginDto = {
                PK_username: user.PK_username, 
                firstname: user.firstname,
                email: user.email, 
                lastname: user.lastname, 
                birthdate: user.birthdate,
                phone_number: user.phone_number, 
                access_token: await this.jwtService.signAsync(payload)
            }
            return userData;
        }).catch((error) => {
            throw new UnauthorizedException();
        });
    }
}