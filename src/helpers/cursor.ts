// Reproduced from to Liam (Stack Overflow)

// https://stackoverflow.com/a/41034697/3480193
export default class Cursor {
  static getCurrentCursorOffset (parentElement: HTMLElement) {
    var selection = window.getSelection(),
      charOffset = -1,
      node

    if (selection.focusNode) {
      if (Cursor._isChildOf(selection.focusNode, parentElement.id)) {
        node = selection.focusNode
        charOffset = selection.focusOffset

        //Traversing backwards node siblings to calculate overall focus offset
        while (node) {
          if (node === parentElement) {
            break
          }

          if (node.previousSibling) {
            node = node.previousSibling
            charOffset += node.textContent?.length
          } else {
            node = node.parentNode
            if (node === null) {
              break
            }
          }
        }
      }
    }

    return charOffset
  }

  static setCurrentCursorPosition (focusOffset: number, el: HTMLElement) {
    if (focusOffset >= 0) {
      var selection = window.getSelection()
      const offset = { value: focusOffset }
      let range = Cursor._createRange(el, offset, null)
      if (range) {
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
        // console.log('range_end: ',range.endOffset,'  focus_offset: ',selection.focusOffset)
      }
    }
  }

  static _isChildOf (node: any, parentId: any) {
    while (node !== null) {
      if (node.id === parentId) {
        return true
      }
      node = node.parentNode
    }

    return false
  }

  static _createRange (node: Node, offset: { value: number }, range: Range) {
    if (!range) {
      range = document.createRange()
      range.selectNode(node)
      range.setStart(node, 0)
    }

    if (offset.value === 0) {
      range.setEnd(node, offset.value)
    } else if (node && offset.value > 0) {
      if (node.nodeType === Node.TEXT_NODE) {
        const nodeTextLen = node.textContent.length
        // When text node is reached we substract it's text length from current offset
        // in order to find proper offset and node to which range end should be set
        if (nodeTextLen < offset.value) {
          offset.value -= nodeTextLen
        }
        // Proper node has been reached
        else {
          range.setEnd(node, offset.value)
        }
      } else {
        for (var i = 0; i < node.childNodes.length; i++) {
          range = Cursor._createRange(node.childNodes[i], offset, range)

          if (offset.value === 0) {
            break
          }
        }
      }
    }

    return range
  }


  static getMDCursorOffset (md: string, text: string, textOffset: number) {
    for (let ti = 0, mi = 0; mi < md.length; mi++) {
      if (text[ti] === md[mi]) {
        ti++
        if (textOffset === ti) {
          return mi + 1
        }
      }
    }
  }

}
