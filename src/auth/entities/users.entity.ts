import { ApiProperty } from "@nestjs/swagger";
import { Task } from "src/tasks/entities/task.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @ApiProperty({
        example: 'test@gmail.com',
        uniqueItems: true,
        description: 'User email',
    })
    @Column({
        unique: true,
        nullable: false,
        type: 'text'
    })
    email: string;

    @ApiProperty({
        example: 'Ab12345',
        uniqueItems: false,
        description: 'User password',
    })
    @Column({
        type: 'text',
        nullable: false,
        select: false
    })
    password: string;


    @ApiProperty({
        example: 'Xavier',
        uniqueItems: false,
        description: 'User full name',
    })
    @Column({
        type: 'text',
        nullable: false,
    })
    fullName: string;

    @OneToMany(
        () => Task,
        (task) => task.createBy,
        { cascade: true }
    )
    tasks: Task;
}
