'use strict'

export const addDateTimeItinerary = arr => {
  for (let i = 0; i < arr.length; i++) {
    const dateTime = `${arr[i].date}T${arr[i].start_time}`
    arr[i].dateObj = new Date(dateTime)
  }
  return arr
}

export const addDateTimePlan = arr => {
  for (let i = 0; i < arr.length; i++) {
    const dateTime = `${arr[i].start_date}T${arr[i].flight_to_dep_time}`
    arr[i].dateObj = new Date(dateTime)
  }
  return arr
}

export const sortByDate = arr => {
  let dateObjArr = []
  const resultArr = []
  for (let i = 0; i < arr.length; i++) {
    dateObjArr[i] = arr[i].dateObj.getTime()
  }
  dateObjArr = dateObjArr.sort()
  for (let q = 0; q < arr.length; q++) {
    const index = dateObjArr.indexOf(arr[q].dateObj.getTime())
    resultArr[index] = arr[q]
  }
  return resultArr
}
