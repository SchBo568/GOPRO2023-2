import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tool } from "./Tool";

@Entity( {name:'DateRange'})
export class DateRange {

    @PrimaryGeneratedColumn()
    PK_dateRange_id: number;

    @Column({type: "date"})
    start: Date;

    @Column({type: "date"})
    end: Date;
    
    @Column({nullable: true})
    mode: string

    @ManyToOne(() => Tool, tool => tool.dateRanges)
    tool: Tool;

}