/* eslint-disable linebreak-style */

import { TFile } from 'obsidian';
import TQPlugin from '../main';
import { walkNodeTree as traverseNodeTree, viewSource } from './EditorHelpers';

// Used to open internal links in TaskDetailsModal
export const allowOpenInternalLinks = (
    el: HTMLElement,
    plugin: TQPlugin,
    close: () => void,
): void => {
    traverseNodeTree(el, (node: Node) => {
        addInternalLinkClickListener(
            node,
            (event: any, anchor: HTMLAnchorElement) => {
                event.preventDefault();
                openInternalLink(anchor, plugin, close);
            },
        );
    });
};

export const preventModalOpenOnInternalLinksClick = (
    el: HTMLElement,
    listener: () => void,
): void => {
    traverseNodeTree(el, (node: Node) => {
        addInternalLinkClickListener(node, () => {
            listener();
        });
    });
};

export const addInternalLinkClickListener = (
    node: Node,
    listener: (event: any, anchor: HTMLAnchorElement) => void,
): void => {
    if (node instanceof HTMLAnchorElement) {
        const anchor = node;
        const isInternalLink = anchor.className.contains('internal-link');
        if (!isInternalLink) return;
        if (isInternalLink) {
            anchor.addEventListener('click', (event) => {
                listener(event, anchor);
            });
        }
    }
};

export const openInternalLink = (
    anchor: HTMLAnchorElement,
    plugin: TQPlugin,
    close: () => void,
): void => {
    const files = plugin.app.vault.getMarkdownFiles();
    files.forEach((file: TFile) => {
        let match = false;
        const dataHref = anchor.getAttribute('data-href');
        const isPath = dataHref.contains('/');
        if (isPath) {
            match = file.path === `${dataHref}.md`;
        } else {
            match = file.name === `${dataHref}.md`;
        }
        if (match) {
            viewSource(file, plugin, close);
            return;
        }
    });
};
