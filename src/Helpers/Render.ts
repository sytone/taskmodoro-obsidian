import { MarkdownRenderer, TFile } from 'obsidian'

import Cursor from './Cursor'

export class Render {

  public static displayMD = (md: string, el: HTMLElement): void => {
    const cleanedMD=this.mdPostprocessing(md)
    el.innerText = cleanedMD
    Cursor.setCurrentCursorPosition(cleanedMD.length, el)
  }

  public static renderMD (md: string, el: HTMLElement, file: TFile=undefined): void {
    if (!el) return
    const cleanedMD=this.mdPostprocessing(md)
    const tempEl = createDiv()
    MarkdownRenderer.renderMarkdown(cleanedMD, tempEl, file ? file.path : './', null)

    el.innerHTML =
      tempEl.children.length !== 0
        ? tempEl.children[0].innerHTML
        : tempEl.innerHTML
  }

  public static mdPostprocessing(md:string): string{
    return md.replace(/[ ]{2}/,'\n')
  }
  
 public static removeLeadingWhitespace(md:string): string{
    return md.replace(/^([ ]+)/,'')
  }

  public static removeNewline(md:string): string{
    return md.replace(/([\n]+)/,'')
  }
}
