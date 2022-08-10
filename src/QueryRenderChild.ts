import { MarkdownRenderChild } from 'obsidian';
import { Query } from './Query';
import QueryTasksList from './UI/QueryTasksList.svelte';
import TQPlugin from './main';

export default class QueryRenderChild extends MarkdownRenderChild {
    private readonly queryTaskList: any;
    constructor(plugin: TQPlugin, container: HTMLElement, source: string) {
        super(container);
        this.queryTaskList = new QueryTasksList({
            target: container,
            props: {
                plugin,
                query: new Query({ source }),
            },
        });
    }
    public onunload(): void {
        this.queryTaskList.$destroy();
    }
}
