import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne } from "typeorm";
import { Role } from "./Role";
import { Tool } from "./Tool";
import { User } from "./User";

@Entity( {name:'Kiosk'})
export class Kiosk {

    @PrimaryGeneratedColumn()
    PK_location_id: number;

    @Column()
    name: string;

    @Column()
    address: string;

    @Column({type: "int"})
    placeholder: number;
    
    @OneToMany(() => User, user => user.kiosk, {onUpdate: 'CASCADE'})
    users: User[];

    @OneToMany(() => Tool, tool => tool.kiosk, {onUpdate: 'CASCADE'})
    tools: Tool[]

}