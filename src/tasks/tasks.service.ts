import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { User } from 'src/auth/entities/users.entity';
import { LoggerService } from 'src/services/logger/logger.service';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) { }

  async create(createTaskDto: CreateTaskDto, user: User) {
    try {
      const task = this.taskRepository.create({
        ...createTaskDto,
        createBy: user,
      });
      await this.taskRepository.save(task);
      return task;
    } catch (error) {
      this.handleError(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 0 } = paginationDto;
    try {

      const tasks = this.taskRepository.find({
        take: limit,
        skip: offset,
      });
      return tasks;

    } catch (error) {
      throw new InternalServerErrorException('Error finding tasks');
    }
  }

  async findOne(id: string) {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: User) {

    const task = await this.taskRepository.preload({
      id: id,
      ...updateTaskDto
    })

    if (!task) throw new NotFoundException(`Task with ${id} not found`);

    try {
      task.createBy = user;
      await this.taskRepository.save(task);
      return task;
    } catch (error) {
      this.handleError(error);
    }

  }

  async remove(id: string) {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
    return `Task with ${id} deleted`;
  }

  async searchTasks(keyword: string, status: string, daysLeft: number) {
    try {
      const query = this.taskRepository.createQueryBuilder('task');

      if (keyword) {
        query.andWhere('(task.title LIKE :keyword OR task.description LIKE :keyword)', { keyword: `%${keyword}%` });
      }

      if (status) {
        query.andWhere('task.status = :status', { status });
      }

      if (daysLeft !== undefined) {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + daysLeft);
        query.andWhere('task.dateline <= :targetDate', { targetDate });
      }

      return await query.getMany();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error searching tasks');
    }

  }

  //Manejo de error
  private handleError(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    throw new InternalServerErrorException('Error creating task');
  }


}

