import initialState from './initialState'

export default () => {
  const canvas = document.createElement('CANVAS')
  canvas.setAttribute('width', `${initialState.rendering.width}px`)
  canvas.setAttribute('height', `${initialState.rendering.height}px`)
  document.body.appendChild(canvas)
  return canvas
}
