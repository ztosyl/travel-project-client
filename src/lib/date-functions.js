'use strict'

export const formatDates = date => {
  // we will return this eventually
  let result = ''
  // split date by '-', which will give us ['yr', 'mo', 'day']
  const yearMonthDayArr = date.split('-')
  // will eventually hold the month name
  let month
  // converts the string month number to an integer
  const monthNum = parseInt(yearMonthDayArr[1], 10)
  // sees which it is from 1-12, assigns a month name
  if (monthNum === 1) {
    month = 'January'
  } else if (monthNum === 2) {
    month = 'February'
  } else if (monthNum === 3) {
    month = 'March'
  } else if (monthNum === 4) {
    month = 'April'
  } else if (monthNum === 5) {
    month = 'May'
  } else if (monthNum === 6) {
    month = 'June'
  } else if (monthNum === 7) {
    month = 'July'
  } else if (monthNum === 8) {
    month = 'August'
  } else if (monthNum === 9) {
    month = 'September'
  } else if (monthNum === 10) {
    month = 'October'
  } else if (monthNum === 11) {
    month = 'November'
  } else {
    month = 'December'
  }
  // puts it in readable format
  // ex: January 10, 2021
  result = `${month} ${yearMonthDayArr[2]}, ${yearMonthDayArr[0]}`
  return result
}

export const reformatDates = date => {
  let result = ''
  const depDateArray = date.split('/')
  result = `${depDateArray[2]}-${depDateArray[0]}-${depDateArray[1]}`
  console.log(result)
  return result
}
