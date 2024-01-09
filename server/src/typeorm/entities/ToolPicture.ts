import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Tool } from './Tool';

@Entity()
export class ToolPicture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @ManyToOne(() => Tool, tool => tool.pictures)
  tool: Tool;
}