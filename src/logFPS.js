export default (numberOfFrames, currentTimestamp, initalTimestamp) => console.log('fps', numberOfFrames / ((currentTimestamp - initalTimestamp) / 1000))
