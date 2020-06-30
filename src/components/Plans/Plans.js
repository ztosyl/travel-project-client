import React, { useState, useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'

// Bootstrap components for styling
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// internal imports
import messages from '../AutoDismissAlert/messages'
import { getPlans, addPlan, updatePlan, deletePlan } from '../../api/plans'
import { getFlights, getHotels, getToken } from '../../api/amadeus'
import { formatDates, formatDatesSlash, reformatDates, findNormalDate } from '../../lib/date-functions'
import { formatTimes, findNormalTime } from '../../lib/time-functions'
import { formatName, formatAddress, jsxHack } from '../../lib/name-functions'
import { addDateTimePlan, sortByDate } from '../../lib/sort'

const Plans = ({ user, msgAlert, setCurrPlan }) => {
  // The plans that will be displayed onscreen
  // Will be 'loading' while waiting for API call, then will display plans
  const [plans, setPlans] = useState('Loading...')
  // The state used for posting, updating and autofilling plans
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
  // triggers if I want useEffect to reload
  const [rerender, setRerender] = useState(false)
  // whether or not update modal is shown
  const [show, setShow] = useState({})
  // whether or not delete modal is shown
  const [showDel, setShowDel] = useState(false)
  // whether the accordion says 'Show more' or 'Hide'
  // it's an object because it is separate per plan instance
  // each plan's word will be stored in a separate index in this object
  const [accordionWord, setAccordionWord] = useState({})
  // whether or not flight search modal is shown
  const [showFlightSearch, setShowFlightSearch] = useState(false)
  // the searched flight info, to be displayed when someone searches for flights
  // displays 'Loading...' until api call is complete
  const [flightInfo, setFlightInfo] = useState('Loading...')
  // a state that helps us hold desired searched flight info to add it to the post plan form
  const [addFlightInfo, setAddFlightInfo] = useState({})
  // whether or not to show hotel search modal
  const [showHotelSearch, setShowHotelSearch] = useState(false)
  // the searched hotel info, same as flightInfo but for hotels
  const [hotelInfo, setHotelInfo] = useState('Loading...')
  // again, same as addFlightInfo but for searched hotels
  const [addHotelInfo, setAddHotelInfo] = useState({})

  // resets the New Plan to default
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
    // get all available plans for a user
    getPlans(user.token)
      .then(data => {
        let wordObj = {}
        let showObj = {}
        for (let i = 0; i < data.data.length; i++) {
          // data to hold for the 'Update' buttons to reference
          // whether or not each individual plan's modal is shown is a boolean that's a value in this object
          // the key is the unique plan ID
          // by default, all are false
          showObj = {
            ...showObj,
            [data.data[i].id]: false
          }
          // same logic here, but for the word on the accordion
          // by default, all are 'Show more'
          wordObj = {
            ...wordObj,
            [data.data[i].id]: 'Show more'
          }
          setShow(showObj)
          setAccordionWord(wordObj)
        }
        // all plans except with date objects
        const datedPlans = addDateTimePlan(data.data)
        // all plans sorted by date
        const sortedPlans = sortByDate(datedPlans)
        setPlans(sortedPlans)
      })
      .catch(() => {
        // This will display on the main page
        setPlans('Could not get plans. Sorry, please try again later.')
        msgAlert({
          heading: 'Plans Display Failed',
          message: messages.getPlans,
          variant: 'danger'
        })
      })
  }, [rerender])

  // next couple functions are form input handlers
  // these work for both post and update
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

  // when the user posts a new plan
  const handlePostSubmit = event => {
    event.preventDefault()
    addPlan(newPlan, user.token)
      .then(() => {
        // reset to default
        resetNewPlan()
        // trigger a useEffect rerender
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

  // when the user updates a plan
  const handleUpdateSubmit = event => {
    event.preventDefault()
    updatePlan(newPlan, user.token)
      .then(() => {
        // close the modal
        handleClose(newPlan.id)
        // trigger a useEffect rerender
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

  // open modal confirming whether or not user wants to delete
  // triggers when user clicks 'delete' button on plan
  const handleDelete = plan => {
    setShowDel(true)
    // saves current plan id to state for later use
    setNewPlan({
      id: plan.id
    })
  }

  const handleDelClose = event => {
    // hide modal
    setShowDel(false)
    // reset new plan so id is erased
    resetNewPlan()
  }

  // if user confirms they want to delete the plan
  const handleConfirmDelete = event => {
    deletePlan(newPlan.id, user.token)
      .then(() => {
        // close modal
        handleDelClose()
        // trigger useEffect rerender
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

  // close update modal
  const handleClose = id => {
    // finds the specific index corresponding to that plan's id
    // sets that value to false, hiding the modal
    setShow({
      ...show,
      [id]: false
    })
    resetNewPlan()
  }

  // shows update modal corresponding to specific plan
  // uses specific plan data to autofill the fields with old plan data
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

  // handles the toggling of 'show more' in plan
  const handleToggle = id => {
    if (accordionWord[id] === 'Show more') {
      // finds the index corresponding to that plan, changes the word
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

  // when user searches for flights
  const handleFlightSearch = () => {
    // get token from API (necessary if we want to access it)
    getToken()
      .then(data => {
        // Loading while database fetches data
        setFlightInfo('Loading...')
        // show the modal
        setShowFlightSearch(true)
        const token = data.data.access_token
        // add airport codes
        let urlString = `originLocationCode=${newPlan.dep_airport_code}&destinationLocationCode=${newPlan.arr_airport_code}`
        // format departure and return dates to a format recognizable by the API, ex 2020-06-24
        const depDate = reformatDates(newPlan.start_date)
        const retDate = reformatDates(newPlan.end_date)
        // add them to the URL we'll eventually send to Amadeus
        urlString = urlString + `&departureDate=${depDate}&returnDate=${retDate}`
        // add some extra default variables to refine our search a bit
        // will only return nonstop flights for one adult with prices in USD
        // will only return a maximum of 20 flights
        urlString = urlString + '&adults=1&nonStop=true&currencyCode=USD&max=20'
        // send result to API and get flights!
        return getFlights(urlString, token)
      })
      .then(data => {
        // if nothing comes back, say so
        if (!data.data.data || data.data.data.length === 0) {
          setFlightInfo('Sorry, no flights matched your search. Please try again.')
        } else {
          let addFlightObj = {}
          const flights = data.data.data
          // similar logic to earlier, we're storing each flight's data in an object at keys corresponding to their index
          // this will be used if the user wants to add a particular flight to their plan
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
          // set the flight info and the information for each individual flight
          setFlightInfo(flights)
          setAddFlightInfo(addFlightObj)
        }
      })
      .catch(() => {
        // This will display on the modal
        setFlightInfo('Sorry, we could not find any flights at this time. Please try again later.')
        msgAlert({
          heading: 'Flight Search Failed',
          message: messages.searchFlight,
          variant: 'danger'
        })
      })
  }

  // Just close the modal
  const handleFlightSearchClose = () => {
    setShowFlightSearch(false)
  }

  // when a user chooses a flight they want to use
  const handleFlightSelection = index => {
    const flightObj = addFlightInfo[index]
    // sets the flight info that they clicked (by index) to the new plan
    // this autopopulates the flight time fields with what they want
    setNewPlan({
      ...newPlan,
      ...flightObj
    })
    // close the modal
    handleFlightSearchClose()
  }

  // handle user searching for hotels
  const handleHotelSearch = () => {
    // get token from API (necessary if we want to access it)
    getToken()
      .then(data => {
        // show the modal, and that it's loading
        setHotelInfo('Loading...')
        setShowHotelSearch(true)
        const token = data.data.access_token
        // add airport codes
        let urlString = `cityCode=${newPlan.arr_airport_code}`
        // format departure and return dates to a format recognizable by the API, ex 2020-06-24
        const depDate = reformatDates(newPlan.start_date)
        const retDate = reformatDates(newPlan.end_date)
        // add them to the URL we'll eventually send to Amadeus
        urlString = urlString + `&checkInDate=${depDate}&checkOutDate=${retDate}`
        // add some extra default variables to refine our search a bit
        // will only return hotels for one adult within 15km of the airport with currency USD
        // will only return a maximum of 20 hotels
        urlString = urlString + '&adults=1&page[20]radius=60&radiusUnit=KM&currency=USD&includeClosed=true'
        // send result to API and get flights!
        return getHotels(urlString, token)
      })
      .then(data => {
        // if there are no hotels, say so
        if (!data.data.data || data.data.data.length === 0) {
          setHotelInfo('Sorry, no hotels matched your search. Please try again.')
        } else {
          // same as before, we're saving all the info from each hotel on the state
          // we will access it once someone chooses one
          const hotels = data.data.data
          let addHotelObj = {}
          for (let i = 0; i < hotels.length; i++) {
            addHotelObj = {
              ...addHotelObj,
              [i]: {
                hotel_name: formatName(hotels[i].hotel.name)
              }
            }
          }
          setAddHotelInfo(addHotelObj)
          setHotelInfo(hotels)
        }
      })
      .catch(() => {
        // the modal will display this if there's an error
        setHotelInfo('Sorry, we could not find any hotels at this time. Please try again later.')
        msgAlert({
          heading: 'Hotel Search Failed',
          message: messages.searchHotel,
          variant: 'danger'
        })
      })
  }

  // Just close the hotel search modal
  const handleHotelSearchClose = () => {
    setShowHotelSearch(false)
  }

  // when the user chooses a hotel to autopopulate the post
  const handleHotelSelection = index => {
    // adds hotel info to new plan, which automatically fills the field in the post form
    const hotelObj = addHotelInfo[index]
    setNewPlan({
      ...newPlan,
      ...hotelObj
    })
    // close the modal
    handleHotelSearchClose()
  }

  return (
    <div>
      <h2 className='page-title'>Travel Plans</h2>
      {Array.isArray(plans) && plans.map((plan, index) => (
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
                    <li><Card.Text><h5><span className='title-class'>Hotel name:</span> {plan.hotel_name}</h5></Card.Text></li>
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
      {!Array.isArray(plans) && jsxHack(plans).map(plan => (
        <Card key={plan}>
          <Card.Header><h3>{plans}</h3></Card.Header>
        </Card>
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
                    <Form.Text className='faux-link' onClick={handleHotelSearch}>Search available hotels near destination airport on dates input.</Form.Text>
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
      <Modal
        show={showHotelSearch}
        onHide={handleHotelSearchClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className='title-class'>Hotels Available</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Array.isArray(hotelInfo) && hotelInfo.map((hotel, index) => (
            <div key={hotel.hotel.hotelId}>
              <Card className='flight-card'>
                <Card.Body>
                  <Card.Title className='title-class flight-title'><h3>{formatName(hotel.hotel.name)}</h3></Card.Title>
                  <ListGroup className="list-group-flush flight-listgroup">
                    <ListGroup.Item>Distance from Airport: {hotel.hotel.hotelDistance.distance} km</ListGroup.Item>
                    <ListGroup.Item>Address: {formatAddress(hotel.hotel.address)}</ListGroup.Item>
                    <ListGroup.Item>Phone Number: {hotel.hotel.contact.phone}</ListGroup.Item>
                  </ListGroup>
                  <Card.Title className='flight-title'>Price: {hotel.offers ? hotel.offers[0].price.total : 'N/A'}</Card.Title>
                  <Button onClick={() => handleHotelSelection(index)} className='btn btn-primary'>Use This Hotel</Button>
                </Card.Body>
              </Card>
            </div>
          ))}
          {!Array.isArray(hotelInfo) && hotelInfo}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHotelSearchClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default withRouter(Plans)
