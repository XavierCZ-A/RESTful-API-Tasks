import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/entities/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in progress',
    COMPLETED = 'completed',
}

@Entity()
export class Task {

    @ApiProperty({
        example: '161a42ac-8725-4bf0-8ae1-c243c0eaa40e',
        uniqueItems: true,
        description: 'Task id',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Test task',
        uniqueItems: true,
        description: 'Task title',
    })
    @Column({
        length: 255,
        unique: true,
        nullable: false,
    })
    title: string;

    @ApiProperty({
        example: 'Task description',
        uniqueItems: false,
        description: 'Task description',
    })
    @Column({
        type: 'text',
        nullable: false,
    })
    description: string;

    @ApiProperty({
        example: 'completed',
        uniqueItems: false,
        description: 'Status of the task',
    })
    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.PENDING,
    })
    status: string;

    @ApiProperty({
        example: '2024-06-19',
        uniqueItems: false,
        description: 'Dateline task',
    })
    @Column({
        type: 'date',
        nullable: false,
    })
    dateline: Date;

    @ApiProperty({
        example: 'Task comment',
        uniqueItems: false,
        description: 'Task comment',
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    comment: string;

    @ApiProperty({
        example: '["tag1", "tag2"]',
        uniqueItems: false,
        description: 'Task tags',
    })
    @Column({
        type: 'text',
        nullable: true,
        array: true,
    })
    tags: string[];


    @ApiProperty({
        example: {
            id: '796f75cb-27e1-47ce-b8fc-7c50401b52dd',
            email: 'xavier@gmail.com',
            fullName: 'Xavier'
        },
        description: 'User who created the task',
    })
    @ManyToOne(
        () => User,
        (user) => user.tasks,
        { eager: true }
    )
    createBy: User;
}
