import  { Writable,writable } from 'svelte/store';
import type { FilePath } from '../file-interface';
import { TaskDetails } from '../task-details';
import type TQPlugin from '../main';

export class TaskDetailsNavigation{
    public tasksNavigation: Writable<FilePath[]>

    // Used for updating UI when any node in a tree of subtasks changes
    public rootTd: Writable<TaskDetails>

    constructor(plugin:TQPlugin){
        this.tasksNavigation=writable([])
        this.rootTd=writable(new TaskDetails(plugin))
        
    }
}