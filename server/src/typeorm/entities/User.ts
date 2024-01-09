import { Entity, PrimaryColumn, Column, OneToMany, ManyToMany, JoinTable, ManyToOne, CreateDateColumn } from "typeorm";
import { Tool } from "./Tool";
import { Review } from "./Review";
import { Role } from "./Role";
import { PaymentMethod } from "./PaymentMethod";
import { Kiosk } from "./Kiosk";
import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { UserTool } from "./UserTool";

@Entity( {name:'User'})
export class User {

    @IsNotEmpty()
    @PrimaryColumn()
    PK_username: string;

    @IsNotEmpty()
    @Column()
    password: string;

    @IsEmail()
    @IsNotEmpty()
    @Column()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Column()
    firstname: string;

    @IsString()
    @IsNotEmpty()
    @Column()
    lastname: string;

    @IsDate()
    @IsNotEmpty()
    @Column({ type: 'date' })
    birthdate: Date;

    @IsNotEmpty()
    @Column()
    phone_number: string;

    //TODO: Add payment info

    @OneToMany(() => Tool, tool => tool.user, { onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    tools: Tool[]

    @OneToMany(() => Review, review => review.reviewedUser, { onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    reviews: Review[]

    @OneToMany(() => Review, review => review.reviewingUser, { onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    writed_reviews: Review[]

    @ManyToOne(() => Kiosk, (kiosk) => Kiosk)
    kiosk: Kiosk;

    @ManyToMany(() => Role)
    @JoinTable()
    roles: Role[];

    @OneToMany(() => UserTool, userTool => userTool.user, { onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    rentings: UserTool[];
}
