const resize = (event: any) => {
  let target = event.target
  target.style.height = 4 + 'px'
  target.style.height = +target.scrollHeight + 'px'
}

export const textareaResize = (el: any) => {
  el.addEventListener('input', resize)
  return {
    destroy: () => el.removeEventListener('input', resize),
  }
}
