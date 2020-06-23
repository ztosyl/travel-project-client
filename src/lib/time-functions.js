'use strict'

export const formatTimes = time => {
  if (time) {
    const timeArray = time.split(':')
    const result = `${timeArray[0]}:${timeArray[1]}`
    return result
  } else {
    return ''
  }
}
