import { Entity, PrimaryColumn, Column, PrimaryGeneratedColumn, Double, ManyToOne, OneToMany, ManyToMany, JoinTable} from "typeorm";
import { User } from "./User";
import { Review } from "./Review";
import { Kiosk } from "./Kiosk";
import { ToolPicture } from "./ToolPicture";
import { Category } from "./Category";
import { DateRange } from "./DateRange";
import { UserTool } from "./UserTool";

@Entity({name:'Tool'})
export class Tool {

    @PrimaryGeneratedColumn()
    PK_tool_id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    status: string;

    @Column({type: "double"})
    rental_rate: number;

    @Column()
    condition: string;

    @Column()
    code: string;

    @ManyToOne(() => User, user => user.tools)
    user: User;

    @OneToMany(() => Review, review => review.tool, { onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    review: Review[]

    @ManyToOne(() => Kiosk, kiosk => kiosk.tools)
    kiosk: Kiosk

    @ManyToOne(() => Category, category => category.tools)
    category: Category
    
    @OneToMany(() => ToolPicture, toolPicture => toolPicture.tool, { onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    pictures: ToolPicture[];

    @OneToMany(() => DateRange, dateRange => dateRange.tool, { onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    dateRanges: DateRange[];

    @OneToMany(() => UserTool, userTool => userTool.tool, { onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    rentings: UserTool[];
}