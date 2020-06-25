import axios from 'axios'
import qs from 'qs'

// get token from Amadeus: necessary if we want to access it
export const getToken = () => {
  return axios({
    url: 'https://test.api.amadeus.com/v1/security/oauth2/token',
    method: 'POST',
    data: qs.stringify({
      'grant_type': 'client_credentials',
      'client_id': 'YZgByq0GmXZ3uMuDMTdGVhA77mfs0y6H',
      'client_secret': '4c82ssVO8s6F85q3'
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}

// get flight info
// this function is passed a string, which is added to the end of the URL
// the string contains parameters for the data we'll receive
export const getFlights = (urlString, token) => {
  return axios({
    url: 'https://test.api.amadeus.com/v2/shopping/flight-offers?' + urlString,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

// gets hotel info
// same logic as above re: the string
export const getHotels = (urlString, token) => {
  return axios({
    url: 'https://test.api.amadeus.com/v2/shopping/hotel-offers?' + urlString,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}
