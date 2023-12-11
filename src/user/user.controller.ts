import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AuthGuard)
  @ApiQuery({ name: 'index' })
  @ApiQuery({ name: 'limit' })
  @ApiQuery({ name: 'search' })
  @Get()
  findAll(@Query() query: FilterUserDto): Promise<User[]> {
    return this.userService.findAll(query)
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(Number(id))
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto)
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(Number(id), updateUserDto)
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(Number(id))
  }

  @UseGuards(AuthGuard)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: storageConfig('avatar'),
    fileFilter: (req, file, callback) => {
      const ext = extname(file.originalname)

      const allowedExtArr = ['.jpg', '.png', '.jpeg']

      if (!allowedExtArr.includes(ext)) {
        req.fileValidationError = 'Wrong file extension. Only accepted extensions ' + allowedExtArr.toString()
        callback(null, false)
      } else {
        const fileSize = parseInt(req.headers['content-length'])

        if (fileSize > 1024 * 1024 * 5) {
          req.fileValidationError = 'File size is too large. Only accepted file size less than 5MB'
          callback(null, false)
        } else {
          callback(null, true)
        }
      }
    }
  }))
  uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    console.log('upload avatar')
    console.log(file)

    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError)
    }
    if (!file) {
      throw new BadRequestException('File is required')
    }

    this.userService.updateAvatar(
      req.user_data.id,
      file.destination + '/' + file.filename
    )
  }
}
