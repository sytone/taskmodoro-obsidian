import type { Writable } from 'svelte/store';
import type { FilePath } from '../file-interface';
import { writable } from 'svelte/store';
export default class SubtasksExpandedState{
    public expandedState: Writable<Record<FilePath, boolean>>
    constructor(){
        this.expandedState=writable({})
    }
}