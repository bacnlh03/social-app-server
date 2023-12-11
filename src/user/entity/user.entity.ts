import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  email: string

  @Column()
  username: string

  @Column()
  password: string

  @Column()
  isActive: boolean

  @Column()
  refreshToken: string

  @CreateDateColumn()
  createAt: Date

  @CreateDateColumn()
  updateAt: Date
}