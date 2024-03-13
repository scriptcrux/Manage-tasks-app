import { Injectable, NotFoundException } from '@nestjs/common';
// import { Task, TaskStatus } from './task.status.enum';
import { TaskStatus } from './task.status.enum';
// import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
// import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
// import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    // @InjectRepository(Task)
    private tasksRepository: TaskRepository,
  ) {}

  getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }
  // private tasks: Task[] = [];
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  //   return tasks;
  // }
  // setTasks(tasks: Task[]) {
  //   this.tasks = tasks;
  // }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    } else {
      return found;
    }
  }

  // getTaskById(id: string): Task {
  //   const task = this.getAllTasks().find((task) => task.id === id);
  //   if (!task) {
  //     throw new NotFoundException(`Task with ID "${id}" not found`);
  //   } else {
  //     return task;
  //   }
  // }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  // deleteTask(id: string):void {
  //   const found = this.getTaskById(id);
  //   this.tasks = this.getAllTasks().filter((task) => task.id !== found.id);
  //   // const tasks = this.getAllTasks().filter((task) => task.id !== id);
  //   // this.setTasks(tasks);
  // }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    this.tasksRepository.save(task);
    // const updatedTask = [task, ...this.getAllTasks()];
    // this.setTasks(updatedTask);
    return task;
  }

  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   // const updatedTask = [task, ...this.getAllTasks()];
  //   // this.setTasks(updatedTask);
  //   return task;
  // }
}
