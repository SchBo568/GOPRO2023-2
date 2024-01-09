import { Options } from "@nestjs/common";
import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { User } from "./User";
import { UserTool } from "./UserTool";

@Entity( {name:'PaymentMethod'})
export class PaymentMethod {

    @PrimaryGeneratedColumn()
    PK_pMethod_id: number;

    @Column()
    description: string;

    @OneToMany(() => UserTool, userTool => userTool.payment_method)
    reservations: UserTool[];
}