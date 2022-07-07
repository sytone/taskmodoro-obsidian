import { MarkdownRenderer, TFile } from 'obsidian'
import Cursor from './cursor'
export class Render {

  static displayMD = (md: string, el: HTMLElement) => {
    let offset = Cursor.getCurrentCursorOffset(el)
    let text = el.innerText.substring(0, offset)
    let mdOffset = Cursor.getMDCursorOffset(md, text, offset)
    el.innerHTML = md
    Cursor.setCurrentCursorPosition(mdOffset, el)
  }

  static renderMD (md: string, el: HTMLElement, file: TFile=undefined) {
    if (!el) return
    const tempEl = createDiv()
    MarkdownRenderer.renderMarkdown(md, tempEl, file ? file.path : './', null)

    el.innerHTML =
      tempEl.children.length !== 0
        ? tempEl.children[0].innerHTML
        : tempEl.innerHTML
  }

  static removeLeadingWhitespace(md:string){
    return md.replace(/^([ ]+)/,'')
  }
}
