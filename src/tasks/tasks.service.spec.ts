import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task.status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  username: 'John',
  id: 'someid',
  password: 'somepassword',
  tasks: [],
};

describe('TaskService', () => {
  let taskService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    //initialse a nestjs module with taskservice and taskRepository
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    taskService = module.get(TasksService);
    tasksRepository = module.get(TaskRepository);
  });

  describe('getTasks', () => {
    it('calls TaskRepository.getTasks and returns the result', async () => {
      expect(tasksRepository.getTasks).not.toHaveBeenCalled();
      tasksRepository.getTasks.mockResolvedValue('someValue');
      //call taskService.gettasks which should then call the repository getTasks
      const results = await taskService.getTasks(null, mockUser);
      expect(tasksRepository.getTasks).toHaveBeenCalled();
      expect(results).toEqual('someValue');
    });
  });

  describe('getTasksById', () => {
    it('calls TaskRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: 'Test title',
        description: 'Test desc',
        id: 'some id',
        status: TaskStatus.OPEN,
      };
      await tasksRepository.findOne.mockResolvedValue(mockTask);
      const results = await taskService.getTaskById('someid', mockUser);
      expect(results).toEqual(mockTask);
    });

    it('calls TaskRepository.findOne and handles the error', async () => {
      await tasksRepository.findOne.mockResolvedValue(null);
      expect(taskService.getTaskById('someid', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
