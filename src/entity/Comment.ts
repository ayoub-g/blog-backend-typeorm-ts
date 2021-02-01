import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Post } from "./Post";
import { User } from "./User";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    date: Date;

    @Column()
    content: string;

    @ManyToOne(type => User, { nullable: false })
    @JoinColumn()
    user: User;

    @OneToOne(type => Comment, { nullable: true })
    @JoinColumn()
    responseToComment: Comment

    @OneToOne(type => Post, { nullable: false })
    @JoinColumn()
    post: Post
}
