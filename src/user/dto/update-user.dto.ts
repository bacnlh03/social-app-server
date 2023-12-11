import { IsNotEmpty } from "class-validator"

export class UpdateUserDto {
  @IsNotEmpty()
  username: string
  
  isActive: boolean
}