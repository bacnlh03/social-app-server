import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: [
        'id',
        'username',
        'email',
        'isActive',
        'createAt',
        'updateAt'
      ]
    })
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneBy({id})
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await bcrypt.hash(createUserDto.password, 10)
    return await this.userRepository.save({
      ...createUserDto,
      password: hashPassword
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return this.userRepository.update(id, updateUserDto)
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id)
  }
}
