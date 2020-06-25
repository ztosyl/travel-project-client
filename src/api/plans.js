import apiUrl from '../apiConfig'
import axios from 'axios'
import { reformatDates } from '../lib/date-functions'

// gets all plans for current user
// the 'by current user' filter happens on the back end
export const getPlans = token => {
  return axios({
    url: apiUrl + '/plans/',
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`
    }
  })
}

// gets a single plan associated with the current user
export const getPlan = (id, token) => {
  return axios({
    url: apiUrl + '/plans/' + id + '/',
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`
    }
  })
}

// adds a plan
export const addPlan = (plan, token) => {
  // these two functions format the dates in a way Django recognizes
  const startDate = reformatDates(plan.start_date)
  const endDate = reformatDates(plan.end_date)
  return axios({
    url: apiUrl + '/plans/',
    method: 'POST',
    data: {
      'plan': {
        'destination': plan.destination,
        'dep_airport_code': plan.dep_airport_code,
        'arr_airport_code': plan.arr_airport_code,
        'start_date': startDate,
        'end_date': endDate,
        'flight_to_dep_time': plan.flight_to_dep_time,
        'flight_to_arr_time': plan.flight_to_arr_time,
        'flight_from_dep_time': plan.flight_from_dep_time,
        'flight_from_arr_time': plan.flight_from_arr_time,
        'hotel_name': plan.hotel_name
      }
    },
    headers: {
      'Authorization': `Token ${token}`
    }
  })
}

// update one plan
export const updatePlan = (plan, token) => {
  const startDate = reformatDates(plan.start_date)
  const endDate = reformatDates(plan.end_date)
  return axios({
    url: apiUrl + '/plans/' + plan.id + '/',
    method: 'PATCH',
    data: {
      'plan': {
        'destination': plan.destination,
        'dep_airport_code': plan.dep_airport_code,
        'arr_airport_code': plan.arr_airport_code,
        'start_date': startDate,
        'end_date': endDate,
        'flight_to_dep_time': plan.flight_to_dep_time,
        'flight_to_arr_time': plan.flight_to_arr_time,
        'flight_from_dep_time': plan.flight_from_dep_time,
        'flight_from_arr_time': plan.flight_from_arr_time,
        'hotel_name': plan.hotel_name
      }
    },
    headers: {
      'Authorization': `Token ${token}`
    }
  })
}

// delete one plan
export const deletePlan = (id, token) => {
  return axios({
    url: apiUrl + '/plans/' + id + '/',
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`
    }
  })
}
