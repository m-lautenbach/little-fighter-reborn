export default async (path) => {
  const source = (await import('./assets/littlefighters2/' + path)).default
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
