// Reproduced from: https://github.com/obsidian-tasks-group/obsidian-tasks
import type { Moment } from 'moment';
import { Task } from '../../FileInterface';
import { DateField } from './DateField';

/**
 * Support the 'scheduled' search instruction.
 */
export class ScheduledDateField extends DateField {
    private static readonly scheduledRegexp =
        /^scheduled (before|after|on)? ?(.*)/;

    protected filterRegexp(): RegExp {
        return ScheduledDateField.scheduledRegexp;
    }
    protected fieldName(): string {
        return 'scheduled';
    }
    protected date(task: Task): Moment | null {
        return task.scheduled;
    }
    protected filterResultIfFieldMissing() {
        return false;
    }
}
