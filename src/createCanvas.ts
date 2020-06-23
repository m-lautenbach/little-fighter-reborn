import initialState from './initialState'

export default () => {
  const fullscreenContainer = document.getElementById('fullscreen-container')
  const canvas = <HTMLCanvasElement>document.getElementById('screen')
  fullscreenContainer.style.height = `${initialState.rendering.height}px`
  canvas.setAttribute('width', `${initialState.rendering.width}px`)
  canvas.setAttribute('height', `${initialState.rendering.height}px`)
  return canvas
}
