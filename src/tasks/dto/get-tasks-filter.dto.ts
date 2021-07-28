import {TaskStatus} from '../task-status.enum';
import {IsIn, IsNotEmpty, IsOptional} from 'class-validator';

export class GetTasksFilterDTO {
		@IsOptional()
		@IsIn(Object.keys(TaskStatus).map(k => TaskStatus[k as any]))
		status: TaskStatus;
		@IsOptional()
		@IsNotEmpty()
		searchTerm: string;
}