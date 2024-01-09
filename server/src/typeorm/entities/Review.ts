import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { Tool } from "./Tool";
import { User } from "./User";

@Entity( {name:'Review'})
export class Review {

    @PrimaryGeneratedColumn()
    PK_review_id: number;

    @Column()
    stars: number;

    @Column()
    comment: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    timestamp: Date;

    @ManyToOne(() => Tool, (tool) => Tool)
    tool: Tool;

    @ManyToOne(() => User, (user) => User)
    reviewingUser: User;

    @ManyToOne(() => User, (user) => User)
    reviewedUser: User;

}