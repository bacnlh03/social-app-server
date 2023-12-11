import { IsNotEmpty } from "class-validator"
import { User } from "src/user/entities/user.entity"

export class CreatePostDto {
  @IsNotEmpty()
  caption: string

  @IsNotEmpty()
  image: string

  user: User
}