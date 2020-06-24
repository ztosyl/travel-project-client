import axios from 'axios'
import qs from 'qs'

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

export const getFlights = (urlString, token) => {
  return axios({
    url: urlString,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}
