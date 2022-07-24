/* eslint-disable linebreak-style */

import { viewSource, walkNodeTree } from '../editor/helpers'

import { TFile } from 'obsidian'
import TQPlugin from '../main'

export default class InternalLink {
  private readonly plugin: TQPlugin
  private readonly close: () => void

  constructor (plugin: TQPlugin, close: () => void) {
    this.plugin = plugin
    this.close = close
  }

  public allowOpenInternalLinks = (el: HTMLElement): void => {
    walkNodeTree(el, (node: Node) => {
      this.addInternalLinkClickListener(
        node,
        (event: any, anchor: HTMLAnchorElement) => {
          event.preventDefault()
          this.openInternalLink(anchor)
        },
      )
    })
  }
  

  private readonly addInternalLinkClickListener = (
    node: Node,
    listener: (event: any, anchor: HTMLAnchorElement) => void,
  ): void => {
    if (node instanceof HTMLAnchorElement) {
      const anchor = node
      const isInternalLink = anchor.className.contains('internal-link')
      if (!isInternalLink) return
      if (isInternalLink) {
        anchor.addEventListener('click', event => {
          listener(event, anchor)
          event.preventDefault()
          this.openInternalLink(anchor)
        })
      }
    }
  }

  private readonly openInternalLink = (anchor: HTMLAnchorElement): void => {
    const files = this.plugin.app.vault.getMarkdownFiles()
    files.forEach((file: TFile) => {
      let match = false
      const dataHref = anchor.getAttribute('data-href')
      const isPath = dataHref.contains('/')
      if (isPath) {
        match = file.path === `${dataHref}.md`
      } else {
        match = file.name === `${dataHref}.md`
      }
      if (match) {
        viewSource(file, this.plugin, this.close)
        return
      }
    })
  }
}
