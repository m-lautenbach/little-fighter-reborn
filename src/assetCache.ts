const assetCache: any = {
  data: {
    characters: {},
  },
  images: {
    spritesheets: {}
  },
  sounds: {}
}

declare global {
  interface Window {
    assetCache: any;
  }
}

window.assetCache = assetCache

export default assetCache
