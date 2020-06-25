'use strict'

// Takes 'I AM A STRING' returns 'I Am A String'
export const formatName = name => {
  const nameArr = String(name).split(' ')
  for (let i = 0; i < nameArr.length; i++) {
    nameArr[i] = nameArr[i].charAt(0).toUpperCase() + nameArr[i].slice(1).toLowerCase()
  }
  const result = nameArr.join(' ')
  return result
}

// Takes the address object from Amadeus and formats it to a readable address
export const formatAddress = address => {
  const addressArr = []
  for (let i = 0; i < address.lines.length; i++) {
    addressArr.push(formatName(address.lines[i]))
  }
  addressArr.push(address.postalCode)
  addressArr.push(formatName(address.cityName) + ',')
  addressArr.push(address.countryCode)
  const newAdd = addressArr.join(' ')
  return newAdd
}

// pass it a string, returns an array with one index, itself
export const jsxHack = str => {
  const result = []
  result.push(str)
  return result
}
