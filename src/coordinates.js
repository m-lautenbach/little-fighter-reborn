export const worldToCamera = ({ camera: { x: cx }, rendering: { height } }, { x, y, z }) => ({
  x: x - cx,
  y: height - y / 2 - z,
})
