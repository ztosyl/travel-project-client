'use strict'

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export const formatDates = date => {
  // we will return this eventually
  let result = ''
  // split date by '-', which will give us ['yr', 'mo', 'day']
  const yearMonthDayArr = date.split('-')
  // converts the string month number to an integer
  const monthNum = parseInt(yearMonthDayArr[1], 10)
  // sees which it is from 1-12, assigns a month name
  const month = months[monthNum - 1]
  // puts it in readable format
  // ex: January 10, 2021
  result = `${month} ${yearMonthDayArr[2]} ${yearMonthDayArr[0]}`
  return result
}

// turns "2010-01-01" to "01/01/2010"
export const formatDatesSlash = date => {
  if (date) {
    const dateArray = date.split('-')
    return `${dateArray[1]}/${dateArray[2]}/${dateArray[0]}`
  } else {
    return ''
  }
}

// turns "01/01/2010" to "2010-01-01"
export const reformatDates = date => {
  let result = ''
  const depDateArray = date.split('/')
  result = `${depDateArray[2]}-${depDateArray[0]}-${depDateArray[1]}`
  return result
}

// takes '2020-08-01T10:00:00', returns '10:00'
export const findNormalDate = date => {
  const dateArr = date.split('T')
  const unformattedDate = dateArr[0]
  return formatDatesSlash(unformattedDate)
}
