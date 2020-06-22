import apiUrl from '../apiConfig'
import axios from 'axios'
import { reformatDates } from '../lib/date-functions'

export const getPlans = token => {
  return axios({
    url: apiUrl + '/plans/',
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`
    }
  })
}

export const addPlan = (plan, token) => {
  const depDate = reformatDates(plan.depDate)
  const returnDate = reformatDates(plan.returnDate)
  return axios({
    url: apiUrl + '/plans/',
    method: 'POST',
    data: {
      'plan': {
        'destination': plan.destination,
        'dep_airport_code': plan.airLocal,
        'arr_airport_code': plan.airDest,
        'start_date': depDate,
        'end_date': returnDate,
        'flight_to_dep_time': plan.depTimeDest,
        'flight_to_arr_time': plan.arrTimeDest,
        'flight_from_dep_time': plan.depTimeHome,
        'flight_from_arr_time': plan.arrTimeHome,
        'hotel_name': plan.hotel
      }
    },
    headers: {
      'Authorization': `Token ${token}`
    }
  })
}
