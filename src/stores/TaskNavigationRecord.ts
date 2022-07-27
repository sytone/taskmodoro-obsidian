import  { Writable, writable } from 'svelte/store';

import type { FilePath } from '../FileInterface';
import type TQPlugin from '../main';
import { TaskDetails } from '../TaskDetails';

export class TaskDetailsNavigation{
    public tasksNavigation: Writable<FilePath[]>

    constructor(){
        this.tasksNavigation=writable([])
        
    }
}