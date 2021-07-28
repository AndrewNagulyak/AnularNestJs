import {EntityRepository, Repository} from 'typeorm';
import {Task} from './task.entity';
import {CreateTaskDto} from './dto/create-task.dto';
import {TaskStatus} from './task-status.enum';
import {GetTasksFilterDTO} from './dto/get-tasks-filter.dto';
import {User} from '../auth/user.entity';
import {InternalServerErrorException, Logger} from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
 private logger = new Logger('TaskRepository');

 async createTask(creatTaskDto: CreateTaskDto, user: User): Promise<Task> {
	const {title, description, cardId} = creatTaskDto;
	const task = new Task();
	task.title = title;
	task.cardId = cardId
	task.description = description;
	task.status = TaskStatus.OPEN;
	console.log(user);
	task.user = user;
	await task.save();
	delete task.user;
	return task;
 }

 async getTasks(user: User, filterDto: GetTasksFilterDTO): Promise<Task[]> {
	const {status, searchTerm} = filterDto;
	const queary = this.createQueryBuilder('task');
	queary.where('task.userId = :userId', {userId: user.id})
	if (status) {
	 queary.andWhere('task.status = :status', {status})
	}
	if (searchTerm) {
	 queary.andWhere('task.title LIKE :searchTerm OR task.description LIKE :searchTerm', {searchTerm: `%${searchTerm}%`})
	}
	try {
	 const tasks = queary.getMany()
	 return tasks;
	} catch (error) {
	 this.logger.error(error);
	 throw new InternalServerErrorException()
	}
 }

 async updateTask(task: Task, status): Promise<Task> {
	task.status = status;
	return await this.save(task);
 }
}
