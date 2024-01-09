import { Options } from "@nestjs/common";
import { Entity, PrimaryColumn, Column, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { Kiosk } from "./Kiosk";
import { User } from "./User";
@Entity( {name:'Role'})
export class Role {

    @PrimaryColumn()
    PK_role_name: string;

    @Column()
    description: string;
}