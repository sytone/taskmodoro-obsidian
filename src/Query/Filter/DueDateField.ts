// Reproduced from: https://github.com/obsidian-tasks-group/obsidian-tasks
import type { Moment } from 'moment';
import { Task } from '../../FileInterface';
import { DateField } from './DateField';

/**
 * Support the 'due' search instruction.
 */
export class DueDateField extends DateField {
    private static readonly dueRegexp = /^due (before|after|on)? ?(.*)/;

    protected filterRegexp(): RegExp {
        return DueDateField.dueRegexp;
    }
    protected fieldName(): string {
        return 'due';
    }
    protected date(task: Task): Moment | null {
        return task.due;
    }
    protected filterResultIfFieldMissing() {
        return false;
    }
}
