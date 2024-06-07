import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...rest } = createUserDto;

      const user = this.userRepository.create({
        ...rest,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.jwtToken({ email: user.email })
      };

    } catch (error) {
      console.log(error);
      this.handleError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true }
    });

    if (!user) throw new UnauthorizedException('Password or email is incorrect');
    
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Password or email is incorrect');
    }

    return {
      ...user,
      token: this.jwtToken({ email: user.email })
    };

  }

  private jwtToken(payload: any) {
    const token =this.jwtService.sign(payload);
    return token;
  }

  //Manejo de error
  private handleError(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    throw new InternalServerErrorException('Error creating task');
  }

}
