import apiUrl from '../apiConfig'
import axios from 'axios'

export const getPlans = token => {
  return axios({
    url: apiUrl + '/plans/',
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`
    }
  })
}
