// Reproduced from: https://github.com/obsidian-tasks-group/obsidian-tasks
import { FilterInstructionsBasedField } from './FilterInstructionsBasedField';

/**
 * Implements 'exclude sub-items' filter
 */
export class ExcludeSubtasksField extends FilterInstructionsBasedField {
    constructor() {
        super();

        this._filters.add(
            'exclude subtasks',
            (task) => !task.parents || task.parents.length === 0,
        );
    }

    protected fieldName(): string {
        return 'exclude';
    }
}
