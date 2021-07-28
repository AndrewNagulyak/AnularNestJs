import {ArgumentMetadata, BadRequestException, PipeTransform} from '@nestjs/common';
import {TaskStatus} from '../task-status.enum';

export class 	TaskStatusValidationPipe implements PipeTransform {
		readonly allowedStatuses = [
				TaskStatus.DONE,
				TaskStatus.IN_PROGRESS,
				TaskStatus.OPEN,
		]
		transform(value: string, metadata: ArgumentMetadata): any {
				value = value.toUpperCase();
				if(!this.isValidStatus(value)){
						throw new BadRequestException(`"${value} status is not valid"`);
				}
				return value;
		}
		private isValidStatus(status:any) {
				const index = this.allowedStatuses.indexOf(status);
				return index!== -1;
		}
}