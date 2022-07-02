import  { Writable,writable } from 'svelte/store';
import type { FilePath } from '../file-interface';

export class TaskDetailsNavigation{
    public tasksNavigation: Writable<FilePath[]>
    constructor(){
        this.tasksNavigation=writable([])
    }
}