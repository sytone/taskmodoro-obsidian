// Reproduced from: https://github.com/obsidian-tasks-group/obsidian-tasks
import { Task } from '../../FileInterface';
import { FilterInstructionsBasedField } from './FilterInstructionsBasedField';

export class CompletedField extends FilterInstructionsBasedField {
    constructor() {
        super();

        this._filters.add('completed', (task: Task) => task.completed);
        this._filters.add('not completed', (task: Task) => !task.completed);
    }

    protected fieldName(): string {
        return 'completed';
    }
}
