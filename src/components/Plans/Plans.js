import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
// import Form from 'react-bootstrap/Form'
// import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import messages from '../AutoDismissAlert/messages'
import { getPlans } from '../../api/plans'

const Plans = ({ userToken, msgAlert }) => {
  const [plans, setPlans] = useState([])

  useEffect(() => {
    getPlans(userToken)
      .then(data => {
        setPlans(data.data)
      })
      .catch(() => {
        msgAlert({
          heading: 'Plans Display Failed',
          message: messages.getPlans,
          variant: 'danger'
        })
      })
  }, [])

  // makes dates a bit more readable
  const formatDates = date => {
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

  return (
    <div>
      <h2>Your plans:</h2>
      {plans && plans.map(plan => (
        <div key={plan.id}>
          <Card>
            <Card.Body>
              <Card.Title><h3>{plan.destination}</h3></Card.Title>
              <Card.Text><h5>From {formatDates(plan.start_date)} to {formatDates(plan.end_date)}</h5></Card.Text>
              <Card.Text>Something else will go here</Card.Text>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  )
}

export default withRouter(Plans)
