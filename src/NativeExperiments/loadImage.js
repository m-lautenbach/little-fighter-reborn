export default (source) => {
  return new Promise(
    (resolve) => {
      const img = new Image()
      img.addEventListener(
        'load',
        () => resolve(img),
      )
      img.src = source
    },
  )
}
