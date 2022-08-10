import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import type { FilePath } from '../FileInterface';
export default class SubtasksExpandedState {
    public expandedState: Writable<Record<FilePath, boolean>>;
    constructor() {
        this.expandedState = writable({});
    }
}
