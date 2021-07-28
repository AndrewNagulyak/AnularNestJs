import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {CreateTaskDto} from './dto/create-task.dto';
import {Task} from './task.entity';
import {TaskRepository} from './task.repository';
import {TaskStatus} from './task-status.enum';
import {GetTasksFilterDTO} from './dto/get-tasks-filter.dto';
import {User} from '../auth/user.entity';

@Injectable()
export class TasksService {

 constructor(
	@Inject(TaskRepository)
	private taskRepository: TaskRepository) {

 }

 async getTaskById(id: number, user: User): Promise<Task> {
	const found = await this.taskRepository.findOne(id, {where: {id, userId: user.id}});
	if (!found) {
	 throw new NotFoundException(`Task with ID ${id} not found`);
	}
	return found;
 }

 // private tasks: Task[] = [];
 //


 getAllTasks(user: User, filterDTO?: GetTasksFilterDTO) {
	let foundedTasks = this.taskRepository.getTasks(user, filterDTO);

	return foundedTasks;
	// const {searchTerm, status} = filterDTO;
	//
	// if (searchTerm) {
	// 		foundedTasks = foundedTasks.filter(task => (task.title.includes(searchTerm)));
	//
	// }
	// if (status) {
	// 		foundedTasks = foundedTasks.filter(task => (task.status === status));
	// }
 }

 async createTask(createTask: CreateTaskDto, user: User): Promise<Task> {

	return this.taskRepository.createTask(createTask, user);
 }

 async updateTaskStatus(id: number, status: TaskStatus, user: User) {
	const task = await this.getTaskById(id, user);
	return this.taskRepository.updateTask(task, status);
 }

 async deleteTask(id: number, user: User) {
	const result = await this.taskRepository.delete({id, userId: user.id});
	if (result.affected === 0) {
	 throw new NotFoundException(`Task with ID ${id} not found`);
	}
	return {id: id};
 }

 // getTaskById(id: string): Task {
 // 		const found = this.tasks.find((task) => (task.id === id));
 // 		if (!found) {
 // 				throw new NotFoundException(`Task with id '${id}' not found`);
 // 		}
 // 		return found;
 // }
}
