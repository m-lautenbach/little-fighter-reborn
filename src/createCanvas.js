import initialState from './initialState'

export default () => {
  const fullscreenContainer = document.getElementById('fullscreen-container')
  const canvas = document.getElementById('screen')
  fullscreenContainer.style.height = `${initialState.rendering.width}px`
  canvas.setAttribute('width', `${initialState.rendering.width}px`)
  canvas.setAttribute('height', `${initialState.rendering.width}px`)
  return canvas
}
