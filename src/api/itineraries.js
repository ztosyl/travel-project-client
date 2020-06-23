import apiUrl from '../apiConfig'
import axios from 'axios'
import { reformatDates } from '../lib/date-functions'

export const getItineraries = (id, token) => {
  return axios({
    url: apiUrl + '/plans/' + id + '/itineraries',
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`
    }
  })
}

export const deleteItinerary = (id, token) => {
  return axios({
    url: apiUrl + '/itineraries/' + id + '/',
    method: 'DELETE',
    headers: {
      'Authorization': `Token ${token}`
    }
  })
}

export const updateItinerary = (itinerary, token) => {
  const date = reformatDates(itinerary.date)
  return axios({
    url: apiUrl + '/itineraries/' + itinerary.id + '/',
    method: 'PATCH',
    data: {
      'itinerary': {
        'point_of_interest': itinerary.point_of_interest,
        'date': date,
        'start_time': itinerary.start_time,
        'end_time': itinerary.end_time,
        'address': itinerary.address,
        'description': itinerary.description
      }
    },
    headers: {
      'Authorization': `Token ${token}`
    }
  })
}

export const addItinerary = (id, itinerary, token) => {
  const date = reformatDates(itinerary.date)
  console.log(itinerary)
  return axios({
    url: apiUrl + '/plans/' + id + '/itineraries/',
    method: 'POST',
    data: {
      'itinerary': {
        'point_of_interest': itinerary.point_of_interest,
        'date': date,
        'start_time': itinerary.start_time,
        'end_time': itinerary.end_time,
        'address': itinerary.address,
        'description': itinerary.description,
        'plan': id
      }
    },
    headers: {
      'Authorization': `Token ${token}`
    }
  })
}
