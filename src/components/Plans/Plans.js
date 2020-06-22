import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import messages from '../AutoDismissAlert/messages'
import { getPlans, addPlan } from '../../api/plans'
import { formatDates } from '../../lib/date-functions'

const Plans = ({ userToken, msgAlert }) => {
  const [plans, setPlans] = useState([])
  const [newPlan, setNewPlan] = useState({
    destination: '',
    airLocal: '',
    airDest: '',
    depDate: '',
    returnDate: '',
    depTimeDest: '',
    arrTimeDest: '',
    depTimeHome: '',
    arrTimeHome: '',
    hotel: ''
  })
  const [rerender, setRerender] = useState(false)

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
  }, [rerender])

  const onDestChange = event => {
    setNewPlan({
      ...newPlan,
      destination: event.target.value
    })
  }

  const onDepDateChange = event => {
    setNewPlan({
      ...newPlan,
      depDate: event.target.value
    })
  }

  const onReturnDateChange = event => {
    setNewPlan({
      ...newPlan,
      returnDate: event.target.value
    })
  }

  const onAirLocalChange = event => {
    setNewPlan({
      ...newPlan,
      airLocal: event.target.value
    })
  }

  const onAirDestChange = event => {
    setNewPlan({
      ...newPlan,
      airDest: event.target.value
    })
  }

  const onDepTimeDestChange = event => {
    setNewPlan({
      ...newPlan,
      depTimeDest: event.target.value
    })
  }

  const onArrTimeDestChange = event => {
    setNewPlan({
      ...newPlan,
      arrTimeDest: event.target.value
    })
  }

  const onDepTimeHomeChange = event => {
    setNewPlan({
      ...newPlan,
      depTimeHome: event.target.value
    })
  }

  const onArrTimeHomeChange = event => {
    setNewPlan({
      ...newPlan,
      arrTimeHome: event.target.value
    })
  }

  const onHotelChange = event => {
    setNewPlan({
      ...newPlan,
      hotel: event.target.value
    })
  }

  // turn dates back to the way Django expects them

  const handleSubmit = event => {
    event.preventDefault()
    addPlan(newPlan, userToken)
      .then(() => {
        setNewPlan({
          destination: '',
          airLocal: '',
          airDest: '',
          depDate: '',
          returnDate: '',
          depTimeDest: '',
          arrTimeDest: '',
          depTimeHome: '',
          arrTimeHome: '',
          hotel: ''
        })
        setRerender(!rerender)
      }
      )
      .catch(() => {
        msgAlert({
          heading: 'Plan Post Failed',
          message: messages.addPlan,
          variant: 'danger'
        })
      })
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
      <Card>
        <Card.Body>
          <Card.Title>Add New Plan</Card.Title>
          <Card.Text><Form onSubmit={handleSubmit}>
            <Form.Group className='col-6' controlId="formBasicDestination">
              <Form.Label>Destination</Form.Label>
              <Form.Control type="text" onChange={onDestChange} value={newPlan.destination} placeholder="Enter destination" />
            </Form.Group>
            <Form.Row>
              <Col className='col-3'>
                <Form.Group controlId="formBasicAirportLocal">
                  <Form.Label>Airport: Local</Form.Label>
                  <Form.Control type="text" maxLength="3" onChange={onAirLocalChange} value={newPlan.airLocal} placeholder="Enter code" />
                  <Form.Text>Please use the three-letter airport code.</Form.Text>
                </Form.Group>
              </Col>
              <Col className='col-3'>
                <Form.Group controlId="formBasicAirportDest">
                  <Form.Label>Airport: Destination</Form.Label>
                  <Form.Control type="text" maxLength="3" onChange={onAirDestChange} value={newPlan.airDest} placeholder="Enter code" />
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col className='col-3'>
                <Form.Group controlId="formBasicDepartureDate">
                  <Form.Label>Start date</Form.Label>
                  <Form.Control type="text" maxLength="10" value={newPlan.depDate} onChange={onDepDateChange} placeholder="MM/DD/YYYY" />
                </Form.Group>
              </Col>
              <Col className='col-3'>
                <Form.Group controlId="formBasicArrivalDate">
                  <Form.Label>End date</Form.Label>
                  <Form.Label></Form.Label>
                  <Form.Control type="text" maxLength="10" value={newPlan.returnDate} onChange={onReturnDateChange} placeholder="MM/DD/YYYY" />
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col className='col-3'>
                <Form.Group controlId="formBasicDepartureTime">
                  <Form.Label>Flight Departure time to Destination</Form.Label>
                  <Form.Control type="text" maxLength="5" value={newPlan.depTimeDest} onChange={onDepTimeDestChange} placeholder="00:00" />
                  <Form.Text>Please use 24-hour format</Form.Text>
                </Form.Group>
              </Col>
              <Col className='col-3'>
                <Form.Group controlId="formBasicArrivalTime">
                  <Form.Label>Flight Arrival time at Destination</Form.Label>
                  <Form.Control type="text" maxLength="5" value={newPlan.arrTimeDest} onChange={onArrTimeDestChange} placeholder="00:00" />
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Row>
              <Col className='col-3'>
                <Form.Group controlId="formBasicReturnDepartureTime">
                  <Form.Label>Flight Departure time to Home</Form.Label>
                  <Form.Control type="text" maxLength="5" value={newPlan.depTimeHome} onChange={onDepTimeHomeChange} placeholder="00:00" />
                  <Form.Text>Please use 24-hour format</Form.Text>
                </Form.Group>
              </Col>
              <Col className='col-3'>
                <Form.Group controlId="formBasicReturnArrivalTime">
                  <Form.Label>Flight Arrival time at Home</Form.Label>
                  <Form.Control type="text" maxLength="5" value={newPlan.arrTimeHome} onChange={onArrTimeHomeChange} placeholder="00:00" />
                </Form.Group>
              </Col>
            </Form.Row>
            <Form.Group controlId="formBasicHotel" className='col-6'>
              <Form.Control type="text" value={newPlan.hotel} onChange={onHotelChange} placeholder="Enter hotel name" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Plan
            </Button>
          </Form></Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}

export default withRouter(Plans)
