// Reproduced from: https://github.com/obsidian-tasks-group/obsidian-tasks
import { FilterInstructionsBasedField } from './FilterInstructionsBasedField';
import { Task } from '../../FileInterface';

export class StatusField extends FilterInstructionsBasedField {
    constructor() {
        super();

        this._filters.add('done', (task: Task) => task.status === Status.Done);
        this._filters.add(
            'not done',
            (task: Task) => task.status !== Status.Done,
        );
    }

    protected fieldName(): string {
        return 'status';
    }
}
