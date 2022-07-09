import type { Writable } from 'svelte/store';
import type { FilePath } from '../file-interface';
import { writable } from 'svelte/store';
export default class SubtasksExpansionRecord{
    public expansionRecord: Writable<Record<FilePath, boolean>>
    constructor(){
        this.expansionRecord=writable({})
    }
}