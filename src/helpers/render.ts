import { MarkdownRenderer, TFile } from 'obsidian'
import Cursor from './cursor'
export class Render {

  static displayMD = (md: string, el: HTMLElement) => {
    md=this.mdPostprocessing(md)
    let offset = Cursor.getCurrentCursorOffset(el)
    let text = el.innerText.substring(0, offset)
    let mdOffset = Cursor.getMDCursorOffset(md, text, offset)
    el.innerHTML = md
    Cursor.setCurrentCursorPosition(mdOffset, el)
  }

  static renderMD (md: string, el: HTMLElement, file: TFile=undefined) {
    if (!el) return
    md=this.mdPostprocessing(md)
    const tempEl = createDiv()
    MarkdownRenderer.renderMarkdown(md, tempEl, file ? file.path : './', null)

    el.innerHTML =
      tempEl.children.length !== 0
        ? tempEl.children[0].innerHTML
        : tempEl.innerHTML
  }

  static mdPostprocessing(md:string){
    return md.replace(/[ ]{2}/,'\n')
  }
  static removeLeadingWhitespace(md:string){
    return md.replace(/^([ ]+)/,'')
  }

  static removeNewline(md:string){
    return md.replace(/([\n]+)/,'')
  }
}
