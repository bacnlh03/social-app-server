import { Post } from "src/post/entities/post.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

  @Column({ nullable: true, default: null })
  avatar: string

  @Column()
  isActive: boolean

  @Column({ nullable: true, default: null })
  refreshToken: string

  @CreateDateColumn()
  createAt: Date

  @CreateDateColumn()
  updateAt: Date

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]
}