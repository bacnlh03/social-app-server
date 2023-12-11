import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { extname } from 'path';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Post')
@ApiBearerAuth()
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @UseGuards(AuthGuard)
  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('image', {
    storage: storageConfig('post'),
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
  create(
    @Req() req,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log(req['user_data'])
    console.log(createPostDto)

    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError)
    }
    if (!file) {
      throw new BadRequestException('File is required')
    }

    return this.postService.create(
      req['user_data'].id,
      { ...createPostDto, image: file.destination + '/' + file.filename }
    )
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'index' })
  @ApiQuery({ name: 'limit' })
  @ApiQuery({ name: 'search' })
  findAll(@Query() query: FilterPostDto) {
    return this.postService.findAll(query)
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  find(@Param('id') id: string) {
    return this.postService.find(Number(id))
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('image', {
    storage: storageConfig('post'),
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
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError)
    }

    if (file) {
      updatePostDto.image = file.destination + '/' + file.filename
    }

    return this.postService.update(Number(id), updatePostDto)
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.postService.delete(Number(id))
  }
}
