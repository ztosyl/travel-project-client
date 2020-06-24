import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import messages from '../AutoDismissAlert/messages'
import { getPlans, addPlan, updatePlan, deletePlan } from '../../api/plans'
import { getFlights, getToken } from '../../api/amadeus'
import { formatDates, formatDatesSlash, reformatDates, findNormalDate } from '../../lib/date-functions'
import { formatTimes, findNormalTime } from '../../lib/time-functions'
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
  const [showFlightSearch, setShowFlightSearch] = useState(false)
  const [flightInfo, setFlightInfo] = useState('Sorry, we could not find any flights at this time. Please try again later.')
  const [addFlightInfo, setAddFlightInfo] = useState({})

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

  const handleFlightSearch = () => {
    getToken()
      .then(data => {
        const token = data.data.access_token
        // beginning of URL
        let urlString = 'https://test.api.amadeus.com/v2/shopping/flight-offers?'
        // add airport codes
        urlString = urlString + `originLocationCode=${newPlan.dep_airport_code}&destinationLocationCode=${newPlan.arr_airport_code}`
        // format departure and return dates to a format recognizable by the API, ex 2020-06-24
        const depDate = reformatDates(newPlan.start_date)
        const retDate = reformatDates(newPlan.end_date)
        // add them to the URL we'll eventually send to Amadeus
        urlString = urlString + `&departureDate=${depDate}&returnDate=${retDate}`
        // add some extra default variables to refine our search a bit
        // will only return nonstop flights for one adult with prices in USD
        // will only return a maximum of 10 flights
        urlString = urlString + '&adults=1&nonStop=true&currencyCode=USD&max=10'
        // send result to API and get flights!
        return getFlights(urlString, token)
      })
      .then(data => {
        if (!data.data.data || data.data.data.length === 0) {
          setFlightInfo('Sorry, no flights matched your search. Please try again.')
        } else {
          let addFlightObj = {}
          const flights = data.data.data
          for (let i = 0; i < flights.length; i++) {
            addFlightObj = {
              ...addFlightObj,
              [i]: {
                flight_to_dep_time: findNormalTime(flights[i].itineraries[0].segments[0].departure.at),
                flight_to_arr_time: findNormalTime(flights[i].itineraries[0].segments[0].arrival.at),
                flight_from_dep_time: findNormalTime(flights[i].itineraries[1].segments[0].departure.at),
                flight_from_arr_time: findNormalTime(flights[i].itineraries[1].segments[0].arrival.at)
              }
            }
          }
          setFlightInfo(flights)
          setAddFlightInfo(addFlightObj)
        }
        setShowFlightSearch(true)
      })
      .catch(error => {
        console.log(error)
        setFlightInfo('Sorry, we could not find any flights at this time. Please try again later.')
        msgAlert({
          heading: 'Flight Search Failed',
          message: messages.searchFlight,
          variant: 'danger'
        })
      })
  }

  const handleFlightSearchClose = () => {
    setShowFlightSearch(false)
    setFlightInfo('Sorry, we could not find any flights at this time. Please try again later.')
  }

  const handleFlightSelection = index => {
    event.preventDefault()
    const flightObj = addFlightInfo[index]
    setNewPlan({
      ...newPlan,
      ...flightObj
    })
    handleFlightSearchClose()
  }

  return (
    <div>
      <h2 className='page-title'>Travel Plans</h2>
      {plans && plans.map((plan, index) => (
        <div key={plan.id}>
          <Accordion>
            <Card>
              <Card.Header><h3>{plan.destination}</h3></Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Card.Text><h4><span className='title-class'>Trip Duration: </span>{formatDates(plan.start_date)} - {formatDates(plan.end_date)}</h4></Card.Text>
                </ListGroup.Item>
              </ListGroup>
              <Accordion.Toggle onClick={() => handleToggle(plan.id)} as={Button} variant="link" eventKey="2">
                {accordionWord[plan.id]}
              </Accordion.Toggle>
              <Accordion.Collapse eventKey='2'>
                <Card.Body>
                  <ul>
                    <li><Card.Text><h5><span className='title-class'>Flight to {plan.destination}:</span> Departs at {formatTimes(plan.flight_to_dep_time)} from {plan.dep_airport_code}, and arrives in {plan.arr_airport_code} at {formatTimes(plan.flight_to_arr_time)}.</h5></Card.Text></li>
                    <li><Card.Text><h5><span className='title-class'>Hotel name:</span> {plan.hotel_name}.</h5></Card.Text></li>
                    <li><Card.Text><h5><span className='title-class'>Flight from {plan.destination}:</span> Departs at {formatTimes(plan.flight_from_dep_time)} from {plan.arr_airport_code}, and arrives in {plan.dep_airport_code} at {formatTimes(plan.flight_from_arr_time)}.</h5></Card.Text></li>
                  </ul>
                  <Container>
                    <Row>
                      <Col className='col-4'>
                        <Button onClick={() => handleShow(plan)}>Update plan</Button>
                      </Col>
                      <Col className='col-4'>
                        <Button onClick={() => handleDelete(plan)}>Delete plan</Button>
                      </Col>
                      <Col className='col-4'>
                        <Link to={`/${plan.id}/itineraries`}><Button>View Itinerary</Button></Link>
                      </Col>
                    </Row>
                  </Container>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <Modal show={show[plan.id]} onHide={() => handleClose(plan.id)} backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title className='title-class'>Update Plan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleUpdateSubmit}>
                <Form.Group controlId="formBasicDestination">
                  <Form.Label>Destination</Form.Label>
                  <Form.Control type="text" onChange={onDestChange} value={newPlan.destination}/>
                </Form.Group>
                <Form.Row>
                  <Col className='col-6'>
                    <Form.Group controlId="formBasicAirportLocal">
                      <Form.Label>Local Airport</Form.Label>
                      <Form.Control type="text" maxLength="3" onChange={onAirLocalChange} value={newPlan.dep_airport_code} />
                      <Form.Text>Please use the three-letter airport code.</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col className='col-6'>
                    <Form.Group controlId="formBasicAirportDest">
                      <Form.Label>Destination Airport</Form.Label>
                      <Form.Control type="text" maxLength="3" onChange={onAirDestChange} value={newPlan.arr_airport_code} />
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Col className='col-6'>
                    <Form.Group controlId="formBasicDepartureDate">
                      <Form.Label>Departure date</Form.Label>
                      <Form.Control type="text" maxLength="10" value={newPlan.start_date} onChange={onDepDateChange}/>
                    </Form.Group>
                  </Col>
                  <Col className='col-6'>
                    <Form.Group controlId="formBasicArrivalDate">
                      <Form.Label>Return date</Form.Label>
                      <Form.Label></Form.Label>
                      <Form.Control type="text" maxLength="10" value={newPlan.end_date} onChange={onReturnDateChange}/>
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Col className='col-6'>
                    <Form.Group controlId="formBasicDepartureTime">
                      <Form.Label>Flight Departure, Destination</Form.Label>
                      <Form.Control type="text" maxLength="5" value={newPlan.flight_to_dep_time} onChange={onDepTimeDestChange}/>
                      <Form.Text>Please use 24-hour format</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col className='col-6'>
                    <Form.Group controlId="formBasicArrivalTime">
                      <Form.Label>Flight Arrival, Destination</Form.Label>
                      <Form.Control type="text" maxLength="5" value={newPlan.flight_to_arr_time} onChange={onArrTimeDestChange} />
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Col className='col-6'>
                    <Form.Group controlId="formBasicReturnDepartureTime">
                      <Form.Label>Flight Departure, Home</Form.Label>
                      <Form.Control type="text" maxLength="5" value={newPlan.flight_from_dep_time} onChange={onDepTimeHomeChange} />
                      <Form.Text>Please use 24hr format</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col className='col-6'>
                    <Form.Group controlId="formBasicReturnArrivalTime">
                      <Form.Label>Flight Arrival, Home</Form.Label>
                      <Form.Control type="text" maxLength="5" value={newPlan.flight_from_arr_time} onChange={onArrTimeHomeChange} />
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Group controlId="formBasicHotel">
                  <Form.Label>Hotel Name</Form.Label>
                  <Form.Control type="text" value={newPlan.hotel_name} onChange={onHotelChange} placeholder="Enter hotel name" />
                </Form.Group>
                <Modal.Footer>
                  <Button variant="primary" type="submit">
                    Update Plan
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      ))}
      <Accordion>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="1" className='add-button'>
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
                      <Form.Label>Local Airport</Form.Label>
                      <Form.Control type="text" maxLength="3" onChange={onAirLocalChange} value={newPlan.dep_airport_code} placeholder="Enter code" />
                      <Form.Text>Please use the three-letter airport code.</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col className='col-3'>
                    <Form.Group controlId="formBasicAirportDest">
                      <Form.Label>Destination Aiport</Form.Label>
                      <Form.Control type="text" maxLength="3" onChange={onAirDestChange} value={newPlan.arr_airport_code} placeholder="Enter code" />
                    </Form.Group>
                  </Col>
                  <Col className='col-3'>
                    <Form.Group controlId="formBasicDepartureDate">
                      <Form.Label>Departure Date</Form.Label>
                      <Form.Control type="text" maxLength="10" value={newPlan.start_date} onChange={onDepDateChange} placeholder="MM/DD/YYYY" />
                    </Form.Group>
                  </Col>
                  <Col className='col-3'>
                    <Form.Group controlId="formBasicArrivalDate">
                      <Form.Label>Return Date</Form.Label>
                      <Form.Label></Form.Label>
                      <Form.Control type="text" maxLength="10" value={newPlan.end_date} onChange={onReturnDateChange} placeholder="MM/DD/YYYY" />
                      <Form.Text className='faux-link' onClick={handleFlightSearch}>Search available flights with this info.</Form.Text>
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Col className='col-3'>
                    <Form.Group controlId="formBasicDepartureTime">
                      <Form.Label>Flight Departure, Destination</Form.Label>
                      <Form.Control type="text" maxLength="5" value={newPlan.flight_to_dep_time} onChange={onDepTimeDestChange} placeholder="00:00" />
                      <Form.Text>Please use 24hr format</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col className='col-3'>
                    <Form.Group controlId="formBasicArrivalTime">
                      <Form.Label>Flight Arrival, Destination</Form.Label>
                      <Form.Control type="text" maxLength="5" value={newPlan.flight_to_arr_time} onChange={onArrTimeDestChange} placeholder="00:00" />
                    </Form.Group>
                  </Col>
                  <Col className='col-3'>
                    <Form.Group controlId="formBasicReturnDepartureTime">
                      <Form.Label>Flight Departure, Home</Form.Label>
                      <Form.Control type="text" maxLength="5" value={newPlan.flight_from_dep_time} onChange={onDepTimeHomeChange} placeholder="00:00" />
                    </Form.Group>
                  </Col>
                  <Col className='col-3'>
                    <Form.Group controlId="formBasicReturnArrivalTime">
                      <Form.Label>Flight Arrival, Home</Form.Label>
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
          <Modal.Title className='title-class'>Confirm deletion</Modal.Title>
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
      <Modal
        show={showFlightSearch}
        onHide={handleFlightSearchClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className='title-class'>Available flights</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Array.isArray(flightInfo) && flightInfo.map((flight, index) => (
            <div key='flight.id'>
              <Card className='flight-card'>
                <Card.Body>
                  <Card.Title className='title-class flight-title'><h3>Departure</h3></Card.Title>
                  <ListGroup className="list-group-flush flight-listgroup">
                    <ListGroup.Item>Depart from {flight.itineraries[0].segments[0].departure.iataCode} at {findNormalTime(flight.itineraries[0].segments[0].departure.at)} on {findNormalDate(flight.itineraries[0].segments[0].departure.at)}</ListGroup.Item>
                    <ListGroup.Item>Arrive at {flight.itineraries[0].segments[0].arrival.iataCode} at {findNormalTime(flight.itineraries[0].segments[0].arrival.at)} on {findNormalDate(flight.itineraries[0].segments[0].arrival.at)}</ListGroup.Item>
                  </ListGroup>
                  <Card.Title className='title-class flight-title'><h3>Return</h3></Card.Title>
                  <ListGroup className="list-group-flush flight-listgroup">
                    <ListGroup.Item>Depart from {flight.itineraries[1].segments[0].departure.iataCode} at {findNormalTime(flight.itineraries[1].segments[0].departure.at)} on {findNormalDate(flight.itineraries[1].segments[0].departure.at)}</ListGroup.Item>
                    <ListGroup.Item>Arrive at {flight.itineraries[1].segments[0].arrival.iataCode} at {findNormalTime(flight.itineraries[1].segments[0].arrival.at)} on {findNormalDate(flight.itineraries[1].segments[0].arrival.at)}</ListGroup.Item>
                  </ListGroup>
                  <Card.Title className='flight-title'>Total price: ${flight.price.total}</Card.Title>
                  <Button onClick={() => handleFlightSelection(index)} className='btn btn-primary'>Use This Flight</Button>
                </Card.Body>
              </Card>
            </div>
          ))}
          {!Array.isArray(flightInfo) && flightInfo}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleFlightSearchClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default withRouter(Plans)
