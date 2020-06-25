'use strict'

// takes an array holding objects with dates and times
export const addDateTimeItinerary = arr => {
  for (let i = 0; i < arr.length; i++) {
    // converts them to strings acceptable by JS date objects, ex '2020-25-06T14:11'
    const dateTime = `${arr[i].date}T${arr[i].start_time}`
    arr[i].dateObj = new Date(dateTime)
  }
  // returns an array of those dates and times as JS Date objects
  return arr
}

// does the same as the above, but using the nomenclature for Itinerary objects (the above is for plans)
export const addDateTimePlan = arr => {
  for (let i = 0; i < arr.length; i++) {
    const dateTime = `${arr[i].start_date}T${arr[i].flight_to_dep_time}`
    arr[i].dateObj = new Date(dateTime)
  }
  return arr
}

// orders an array of JS date objects
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
