import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) { }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashPassword = await this.hashPassword(registerUserDto.password)

    return await this.userRepository.save({
      ...registerUserDto,
      refreshToken: "default",
      password: hashPassword
    })
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email }
    })

    if (!user) {
      throw new HttpException('Email is not existed', HttpStatus.UNAUTHORIZED)
    }

    const checkPassword = bcrypt.compareSync(loginUserDto.password, user.password)

    if (!checkPassword) {
      throw new HttpException('Password is not valid', HttpStatus.UNAUTHORIZED)
    }

    const payload = {
      id: user.id,
      email: user.email
    }
    return this.generateToken(payload)
  }

  async refreshToken(refreshToken: string) {
    try {
      const verify = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get<string>('SECRET')
        }
      )
      console.log(verify)

      const checkExistedToken = await this.userRepository.findOneBy({
        email: verify.email,
        refreshToken
      })

      if (!checkExistedToken) {
        throw new HttpException('Refresh token is invalid', HttpStatus.BAD_REQUEST)
      }

      return this.generateToken({
        id: verify.id,
        email: verify.email
      })
    } catch (error) {
      console.log(error)
      throw new HttpException('Refresh token is invalid', HttpStatus.BAD_REQUEST)
    }
  }

  private async generateToken(payload: { id: number, email: string }) {
    const accessToken = this.jwtService.sign(payload)
    const refreshToken = await this.jwtService.signAsync(
      payload,
      {
        secret: this.configService.get<string>('SECRET'),
        expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN')
      }
    )

    await this.userRepository.update(
      { email: payload.email },
      { refreshToken: refreshToken }
    )

    return { accessToken, refreshToken }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = 10
    const salt = await bcrypt.genSalt(saltRound)
    const hash = await bcrypt.hash(password, salt)

    return hash
  }
}
