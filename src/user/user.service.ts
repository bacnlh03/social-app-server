import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async findAll(query: FilterUserDto): Promise<User[]> {
    const index = Number(query.index) || 1
    const limit = Number(query.limit) || 10
    const skip = (index - 1) * limit

    return await this.userRepository.find({
      where: [
        { username: Like('%' + query.search + '%') }
      ],
      take: limit,
      skip: skip,
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
    return await this.userRepository.findOneBy({ id })
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

  async updateAvatar(id: number, avatar: string): Promise<UpdateResult> {
    return await this.userRepository.update(id, { avatar })
  }
}
