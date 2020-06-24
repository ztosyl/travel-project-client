import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Accordion from 'react-bootstrap/Accordion'
import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'
import messages from '../AutoDismissAlert/messages'
import { getPlans, addPlan, updatePlan, deletePlan } from '../../api/plans'
import { formatDates, formatDatesSlash } from '../../lib/date-functions'
import { formatTimes } from '../../lib/time-functions'
import { addDateTimePlan, sortByDate } from '../../lib/sort'

const Plans = ({ userToken, msgAlert, setCurrPlan }) => {
  const [plans, setPlans] = useState([])
  const [newPlan, setNewPlan] = useState({
    destination: '',
    dep_airport_code: '',
    arr_airport_code: '',
    start_date: '',
    end_date: '',
    flight_to_dep_time: '',
    flight_to_arr_time: '',
    flight_from_dep_time: '',
    flight_from_arr_time: '',
    hotel_name: '',
    id: ''
  })
  const [rerender, setRerender] = useState(false)
  const [show, setShow] = useState({})
  const [showDel, setShowDel] = useState(false)
  const [accordionWord, setAccordionWord] = useState({})

  const resetNewPlan = () => {
    setNewPlan({
      destination: '',
      dep_airport_code: '',
      arr_airport_code: '',
      start_date: '',
      end_date: '',
      flight_to_dep_time: '',
      flight_to_arr_time: '',
      flight_from_dep_time: '',
      flight_from_arr_time: '',
      hotel_name: '',
      id: ''
    })
  }

  useEffect(() => {
    getPlans(userToken)
      .then(data => {
        let wordObj = {}
        let showObj = {}
        for (let i = 0; i < data.data.length; i++) {
          showObj = {
            ...showObj,
            [data.data[i].id]: false
          }
          wordObj = {
            ...wordObj,
            [data.data[i].id]: 'Show more'
          }
          setShow(showObj)
          setAccordionWord(wordObj)
        }
        const datedPlans = addDateTimePlan(data.data)
        const sortedPlans = sortByDate(datedPlans)
        setPlans(sortedPlans)
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
      start_date: event.target.value
    })
  }

  const onReturnDateChange = event => {
    setNewPlan({
      ...newPlan,
      end_date: event.target.value
    })
  }

  const onAirLocalChange = event => {
    setNewPlan({
      ...newPlan,
      dep_airport_code: event.target.value
    })
  }

  const onAirDestChange = event => {
    setNewPlan({
      ...newPlan,
      arr_airport_code: event.target.value
    })
  }

  const onDepTimeDestChange = event => {
    setNewPlan({
      ...newPlan,
      flight_to_dep_time: event.target.value
    })
  }

  const onArrTimeDestChange = event => {
    setNewPlan({
      ...newPlan,
      flight_to_arr_time: event.target.value
    })
  }

  const onDepTimeHomeChange = event => {
    setNewPlan({
      ...newPlan,
      flight_from_dep_time: event.target.value
    })
  }

  const onArrTimeHomeChange = event => {
    setNewPlan({
      ...newPlan,
      flight_from_arr_time: event.target.value
    })
  }

  const onHotelChange = event => {
    setNewPlan({
      ...newPlan,
      hotel_name: event.target.value
    })
  }

  const handlePostSubmit = event => {
    event.preventDefault()
    addPlan(newPlan, userToken)
      .then(() => {
        resetNewPlan()
        setRerender(!rerender)
      }
      )
      .catch(() => {
        msgAlert({
          heading: 'Plan Post Failed',
          message: messages.postPlan,
          variant: 'danger'
        })
      })
  }

  const handleUpdateSubmit = event => {
    event.preventDefault()
    updatePlan(newPlan, userToken)
      .then(() => {
        handleClose(newPlan.id)
        setRerender(!rerender)
      }
      )
      .catch(() => {
        msgAlert({
          heading: 'Plan Update Failed',
          message: messages.updatePlan,
          variant: 'danger'
        })
      })
  }

  const handleDelete = plan => {
    setShowDel(true)
    setNewPlan({
      id: plan.id
    })
  }

  const handleDelClose = event => {
    setShowDel(false)
    resetNewPlan()
  }

  const handleConfirmDelete = event => {
    deletePlan(newPlan.id, userToken)
      .then(() => {
        handleDelClose()
        setRerender(!rerender)
      })
      .catch(() => {
        msgAlert({
          heading: 'Plan Deletion Failed',
          message: messages.deletePlan,
          variant: 'danger'
        })
      })
  }

  const handleClose = id => {
    setShow({
      ...show,
      [id]: false
    })
    resetNewPlan()
  }

  const handleShow = plan => {
    setNewPlan({
      ...plan,
      start_date: formatDatesSlash(plan.start_date),
      end_date: formatDatesSlash(plan.end_date),
      flight_to_dep_time: formatTimes(plan.flight_to_dep_time),
      flight_to_arr_time: formatTimes(plan.flight_to_arr_time),
      flight_from_dep_time: formatTimes(plan.flight_from_dep_time),
      flight_from_arr_time: formatTimes(plan.flight_from_arr_time)
    })
    setShow({
      ...show,
      [plan.id]: true
    })
  }

  const handleToggle = id => {
    if (accordionWord[id] === 'Show more') {
      setAccordionWord({
        ...accordionWord,
        [id]: 'Hide'
      })
    } else {
      setAccordionWord({
        ...accordionWord,
        [id]: 'Show more'
      })
    }
  }

  return (
    <div>
      <h2>Your plans:</h2>
      {plans && plans.map((plan, index) => (
        <div key={plan.id}>
          <Accordion>
            <Card>
              <Card.Header><h3>{plan.destination}</h3></Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Card.Text><h5>From {formatDates(plan.start_date)} to {formatDates(plan.end_date)}</h5></Card.Text>
                </ListGroup.Item>
              </ListGroup>
              <Accordion.Toggle onClick={() => handleToggle(plan.id)} as={Button} variant="link" eventKey="2">
                {accordionWord[plan.id]}
              </Accordion.Toggle>
              <Accordion.Collapse eventKey='2'>
                <Card.Body>
                  <Card.Text>Taking off at {formatTimes(plan.flight_to_dep_time)} from {plan.dep_airport_code}, and arriving in {plan.arr_airport_code} at {formatTimes(plan.flight_to_arr_time)}.</Card.Text>
                  <Card.Text>Staying at {plan.hotel_name}.</Card.Text>
                  <Card.Text>Heading home at {formatTimes(plan.flight_from_dep_time)} from {plan.arr_airport_code}, and arriving in {plan.dep_airport_code} at {formatTimes(plan.flight_from_arr_time)}.</Card.Text>
                  <Button onClick={() => handleShow(plan)}>Update plan</Button>
                  <Button onClick={() => handleDelete(plan)}>Delete plan</Button>
                  <Link to={`/${plan.id}/itineraries`}><Button>View Itinerary</Button></Link>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Modal show={show[plan.id]} onHide={() => handleClose(plan.id)} backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>Update Plan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleUpdateSubmit}>
                <Form.Group className='col-6' controlId="formBasicDestination">
                  <Form.Label>Destination</Form.Label>
                  <Form.Control type="text" onChange={onDestChange} value={newPlan.destination}/>
                </Form.Group>
                <Form.Row>
                  <Form.Group controlId="formBasicAirportLocal">
                    <Form.Label>Airport: Local</Form.Label>
                    <Form.Control type="text" maxLength="3" onChange={onAirLocalChange} value={newPlan.dep_airport_code} />
                    <Form.Text>Please use the three-letter airport code.</Form.Text>
                  </Form.Group>
                  <Form.Group controlId="formBasicAirportDest">
                    <Form.Label>Airport: Destination</Form.Label>
                    <Form.Control type="text" maxLength="3" onChange={onAirDestChange} value={newPlan.arr_airport_code} />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group controlId="formBasicDepartureDate">
                    <Form.Label>Start date</Form.Label>
                    <Form.Control type="text" maxLength="10" value={newPlan.start_date} onChange={onDepDateChange}/>
                  </Form.Group>
                  <Form.Group controlId="formBasicArrivalDate">
                    <Form.Label>End date</Form.Label>
                    <Form.Label></Form.Label>
                    <Form.Control type="text" maxLength="10" value={newPlan.end_date} onChange={onReturnDateChange}/>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group controlId="formBasicDepartureTime">
                    <Form.Label>Flight Departure time to Destination</Form.Label>
                    <Form.Control type="text" maxLength="5" value={newPlan.flight_to_dep_time} onChange={onDepTimeDestChange}/>
                    <Form.Text>Please use 24-hour format</Form.Text>
                  </Form.Group>
                  <Form.Group controlId="formBasicArrivalTime">
                    <Form.Label>Flight Arrival time at Destination</Form.Label>
                    <Form.Control type="text" maxLength="5" value={newPlan.flight_to_arr_time} onChange={onArrTimeDestChange} />
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group controlId="formBasicReturnDepartureTime">
                    <Form.Label>Flight Departure time to Home</Form.Label>
                    <Form.Control type="text" maxLength="5" value={newPlan.flight_from_dep_time} onChange={onDepTimeHomeChange} />
                    <Form.Text>Please use 24-hour format</Form.Text>
                  </Form.Group>
                  <Form.Group controlId="formBasicReturnArrivalTime">
                    <Form.Label>Flight Arrival time at Home</Form.Label>
                    <Form.Control type="text" maxLength="5" value={newPlan.flight_from_arr_time} onChange={onArrTimeHomeChange} />
                  </Form.Group>
                </Form.Row>
                <Form.Group controlId="formBasicHotel" className='col-6'>
                  <Form.Label>Hotel Name</Form.Label>
                  <Form.Control type="text" value={newPlan.hotel_name} onChange={onHotelChange} placeholder="Enter hotel name" />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Update
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      ))}
      <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="1">
          Add New Plan
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>
              <Card.Text><Form onSubmit={handlePostSubmit}>
                <Col>
                  <Form.Group controlId="formBasicDestination">
                    <Form.Label>Destination</Form.Label>
                    <Form.Control type="text" onChange={onDestChange} value={newPlan.destination} placeholder="Enter destination" />
                  </Form.Group>
                </Col>
                <Form.Row>
                  <Col className='col-3'>
                    <Form.Group controlId="formBasicAirportLocal">
                      <Form.Label>Airport: Local</Form.Label>
                      <Form.Control type="text" maxLength="3" onChange={onAirLocalChange} value={newPlan.dep_airport_code} placeholder="Enter code" />
                      <Form.Text>Please use the three-letter airport code.</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col className='col-3'>
                    <Form.Group controlId="formBasicAirportDest">
                      <Form.Label>Airport: Destination</Form.Label>
                      <Form.Control type="text" maxLength="3" onChange={onAirDestChange} value={newPlan.arr_airport_code} placeholder="Enter code" />
                    </Form.Group>
                  </Col>
                  <Col className='col-3'>
                    <Form.Group controlId="formBasicDepartureDate">
                      <Form.Label>Start date</Form.Label>
                      <Form.Control type="text" maxLength="10" value={newPlan.start_date} onChange={onDepDateChange} placeholder="MM/DD/YYYY" />
                    </Form.Group>
                  </Col>
                  <Col className='col-3'>
                    <Form.Group controlId="formBasicArrivalDate">
                      <Form.Label>End date</Form.Label>
                      <Form.Label></Form.Label>
                      <Form.Control type="text" maxLength="10" value={newPlan.end_date} onChange={onReturnDateChange} placeholder="MM/DD/YYYY" />
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Col className='col-3'>
                    <Form.Group controlId="formBasicDepartureTime">
                      <Form.Label>Flight Departure time to Destination</Form.Label>
                      <Form.Control type="text" maxLength="5" value={newPlan.flight_to_dep_time} onChange={onDepTimeDestChange} placeholder="00:00" />
                      <Form.Text>Please use 24-hour format</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col className='col-3'>
                    <Form.Group controlId="formBasicArrivalTime">
                      <Form.Label>Flight Arrival time at Destination</Form.Label>
                      <Form.Control type="text" maxLength="5" value={newPlan.flight_to_arr_time} onChange={onArrTimeDestChange} placeholder="00:00" />
                    </Form.Group>
                  </Col>
                  <Col className='col-3'>
                    <Form.Group controlId="formBasicReturnDepartureTime">
                      <Form.Label>Flight Departure time to Home</Form.Label>
                      <Form.Control type="text" maxLength="5" value={newPlan.flight_from_dep_time} onChange={onDepTimeHomeChange} placeholder="00:00" />
                    </Form.Group>
                  </Col>
                  <Col className='col-3'>
                    <Form.Group controlId="formBasicReturnArrivalTime">
                      <Form.Label>Flight Arrival time at Home</Form.Label>
                      <Form.Control type="text" maxLength="5" value={newPlan.flight_from_arr_time} onChange={onArrTimeHomeChange} placeholder="00:00" />
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Col>
                  <Form.Group controlId="formBasicHotel">
                    <Form.Label>Hotel Name</Form.Label>
                    <Form.Control type="text" value={newPlan.hotel_name} onChange={onHotelChange} placeholder="Enter hotel name" />
                  </Form.Group>
                </Col>
                <Col>
                  <Button variant="primary" type="submit">
                    Add Plan
                  </Button>
                </Col>
              </Form></Card.Text>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <Modal
        show={showDel}
        onHide={handleDelClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDelClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default withRouter(Plans)
