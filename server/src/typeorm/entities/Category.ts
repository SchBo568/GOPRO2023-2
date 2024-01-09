
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tool } from "./Tool";

@Entity( {name:'Category'})
export class Category {

    @PrimaryGeneratedColumn()
    PK_category_id: number;

    @Column()
    name: string;

    @Column()
    description: string;
    
    @OneToMany(() => Tool, tool => tool.category, {onUpdate: 'CASCADE'})
    tools: Tool[];

}
