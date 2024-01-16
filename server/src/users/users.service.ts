import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from 'src/typeorm/entities/User';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {Kiosk} from 'src/typeorm/entities/Kiosk';
import {CreateUserDto} from './CreateUser.dto';
import {UpdateUserDto} from './UpdateUser.dto';
import {sendMail} from 'src/utils/mailService';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>, 
    @InjectRepository(Kiosk) private kioskRepo: Repository<Kiosk>) {}

  async fetchUsers() {
    return await this.userRepository.find();
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserByUsername(username: string): Promise<User[]> {
    return await this.userRepository.find({ where: { PK_username: username}});
  }

  async checkPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async login(loginParams: {PK_username: string, password: string})  {
    const temp = await this.findUserByUsername(loginParams.PK_username)
    if (!temp) {
      return {
        "status": "Bad Request",
        "code": 400,
        "message": ["This user does not exist"]

      };
    } else {
      const user = temp[0];

      const isPasswordCorrect = await this.checkPassword(
          loginParams.password,
          user.password,
      );

      if (isPasswordCorrect) {
        return {
          "status": "OK",
          "code": 200,
          "message": ["Login successful"],
          "user": user
        };
      } else {
        return {
          "status": "Bad Request",
          "code": 400,
          "message": ["Incorrect password"]
        };
      }
    }
  }

  async createUsers(createUserDetails: CreateUserDto) {
    const existingUser = await this.findUserByUsername(createUserDetails.PK_username);
    if (existingUser) {
      return {
        "status": "Bad Request",
        "code": 400,
        "message": ["This user already exists"]
      };
    } else {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(createUserDetails.password, saltRounds)
      const encryptedUser = {...createUserDetails,password: hashedPassword};
      const newUser = this.userRepository.create(encryptedUser);
      this.userRepository.save(newUser);

      sendMail(newUser.email, "Account registered", "Thank you for registering with Good2Loan!")
      return {
        "status": "OK",
        "code": 200,
        "message": ["User created successfully"]
      };
    }
  }

  async addKioskToUser(username: string, kioskId: number) {
    const user = await this.findUserByUsername(username);
    const kiosk = await this.kioskRepo.findOne({where: {PK_location_id: kioskId}});
    if (!user[0]) {
      return {
        "status": "Bad Request",
        "code": 400,
        "message": ["This user does not exist"]
      }
    }
    else if (!kiosk) {
      return {
        "status": "Bad Request",
        "code": 400,
        "message": ["This kiosk does not exist"]
      }
    }
    else{
      const userToUpdate = user[0];
      userToUpdate.kiosk = kiosk;
      this.userRepository.save(userToUpdate);
      return {
        "status": "OK",
        "code": 200,
        "message": ["Kiosk added successfully"]
      }
    }
    
  }

  async updateUser(username: string, updateUserDetails: UpdateUserDto) {
    const user = await this.findUserByUsername(username);
    if (!user[0]) {
      return {
        "status": "Bad Request",
        "code": 400,
        "message": ["This user does not exist"]
      };
    }
    else{
      console.log(updateUserDetails.firstname)
      const userToUpdate = user[0];
      const updatedUser = {...userToUpdate, ...updateUserDetails};
      this.userRepository.save(updatedUser);
      return {
        "status": "OK",
        "code": 200,
        "message": ["User updated successfully"]
      };
    }
  }

  async updatePassword(username: string, newPassword: string, oldPassword: string) {
      const user = await this.findUserByUsername(username);   
      
      if (!user[0]) {
        return {
          "status": "Bad Request",
          "code": 400,
          "message": ["This user does not exist"]
        };
      }
      else {
        const isMatch = await bcrypt.compare(oldPassword, user[0].password);
        if(!isMatch){
          return {
            "status": "Bad Request",
            "code": 400,
            "message": ["Old password does not match"]
          };
        }
        else{
          const userToUpdate = user[0];
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(newPassword, saltRounds)
          userToUpdate.password = hashedPassword;
          await this.userRepository.save(userToUpdate);

          sendMail(userToUpdate.email, "Password updated", "Your password has just been updated. If this was not you, please contact us immediately.")
          return {
            "status": "OK",
            "code": 200,
            "message": ["Password updated successfully"]
          };
        }
      }
      
    }

  async deleteUser(username: string) {
    const user = await this.findUserByUsername(username);
    if (!user[0]) {
      return {
        "status": "Bad Request",
        "code": 400,
        "message": ["This user does not exist"]
      };
    }
    else{
      this.userRepository.delete(user[0].PK_username);
      return {
        "status": "OK",
        "code": 200,
        "message": ["User deleted successfully"]
      };
    }
  }
}