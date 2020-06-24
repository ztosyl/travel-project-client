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

// takes '2020-08-01T10:00:00', returns '10:00'
export const findNormalTime = time => {
  const timeArr = time.split('T')
  const longTime = timeArr[1]
  return formatTimes(longTime)
}
