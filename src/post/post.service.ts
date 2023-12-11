import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Post) private postRepository: Repository<Post>
  ) { }

  async create(userId: number, createPostDto: CreatePostDto): Promise<Post> {
    const user = await this.userRepository.findOneBy({ id: userId })

    try {
      const result = await this.postRepository.save({
        ...createPostDto, user
      })

      return await this.postRepository.findOneBy({ id: result.id })
    } catch (error) {
      console.log(error)
      throw new HttpException('Cannot create post', HttpStatus.BAD_REQUEST)
    }
  }

  async findAll(query: FilterPostDto): Promise<Post[]> {
    const index = Number(query.index) || 1
    const limit = Number(query.limit) || 10
    const skip = (index - 1) * limit

    return await this.postRepository.find({
      where: [
        { caption: Like('%' + query.search + '%') }
      ],
      order: { createdAt: 'DESC' },
      take: index,
      skip: skip,
      relations: { user: true },
      select: {
        user: {
          id: true,
          username: true,
          email: true,
          avatar: true
        }
      }
    })
  }

  async find(id: number): Promise<Post> {
    return await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
      select: {
        user: {
          id: true,
          username: true,
          email: true,
          avatar: true
        }
      }
    })
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<UpdateResult> {
    return await this.postRepository.update(id, updatePostDto)
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.postRepository.delete(id)
  }
}
