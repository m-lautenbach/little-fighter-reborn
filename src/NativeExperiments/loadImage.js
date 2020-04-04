export default (source) => {
  return new Promise(
    (resolve) => {
      const img = new Image()
      img.onload = () => {
        img.onload = null
        resolve(img)
      }
      img.src = source
    },
  )
}
