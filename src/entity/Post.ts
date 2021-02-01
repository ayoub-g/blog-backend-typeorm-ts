import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User"
@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: Date;

    @Column()
    content: string;

    @ManyToOne(type => User, { nullable: false })
    @JoinColumn()
    user: User;

}
