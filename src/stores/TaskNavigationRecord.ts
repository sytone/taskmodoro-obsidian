import  { Writable,writable } from 'svelte/store';
import type { FilePath } from '../file-interface';
import { TaskDetails } from '../task-details';
import type TQPlugin from '../main';

export class TaskDetailsNavigation{
    public tasksNavigation: Writable<FilePath[]>

    constructor(){
        this.tasksNavigation=writable([])
        
    }
}