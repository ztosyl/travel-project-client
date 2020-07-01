import React, { useState, useEffect } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import messages from '../AutoDismissAlert/messages'
import { getItineraries, deleteItinerary, updateItinerary, addItinerary } from '../../api/itineraries'
import { getPlan } from '../../api/plans'
import { formatDates, formatDatesSlash } from '../../lib/date-functions'
import { formatTimes } from '../../lib/time-functions'
import { jsxHack } from '../../lib/name-functions'
import { addDateTimeItinerary, sortByDate } from '../../lib/sort'

const Itineraries = ({ msgAlert, user, match }) => {
  const { planId } = match.params
  const [itineraries, setItineraries] = useState('Loading...')
  const [newItinerary, setNewItinerary] = useState({
    date: '',
    start_time: '',
    end_time: '',
    point_of_interest: '',
    address: '',
    description: '',
    plan: '',
    id: ''
  })
  const [plan, setPlan] = useState({})
  const [showDel, setShowDel] = useState(false)
  const [rerender, setRerender] = useState(false)
  const [show, setShow] = useState({})
  const [accordionWord, setAccordionWord] = useState({})

  useEffect(() => {
    getItineraries(planId, user.token)
      .then(data => {
        let showObj = {}
        let wordObj = {}
        const datedItineraries = addDateTimeItinerary(data.data)
        const sortedItineraries = sortByDate(datedItineraries)
        // making an array of itinerary arrays by day
        const days = []
        for (let i = 0; i < sortedItineraries.length; i++) {
          showObj = {
            ...showObj,
            [sortedItineraries[i].id]: false
          }
          wordObj = {
            ...wordObj,
            [sortedItineraries[i].id]: 'Show more'
          }
          // look for an array where the 0 index matches the date we want
          if (!days.find(arr => arr[0] === sortedItineraries[i].date)) {
            // if not, add it
            days.push([sortedItineraries[i].date, sortedItineraries[i]])
          } else {
            // if we find one, add the itinerary to the appropriate sub-array
            const index = days.findIndex(arr => arr[0] === sortedItineraries[i].date)
            days[index].push(sortedItineraries[i])
          }
        }
        setShow(showObj)
        setAccordionWord(wordObj)
        setItineraries(days)
        return getPlan(planId, user.token)
      })
      .then(data => {
        setPlan(data.data)
      })
      .catch(error => {
        console.log(error)
        setItineraries('Could not get itinerary. Sorry, please try again later.')
        msgAlert({
          heading: 'Itinerary Display Failed',
          message: messages.getItineraries,
          variant: 'danger'
        })
      })
  }, [rerender])

  const resetNewItin = () => {
    setNewItinerary({
      date: '',
      start_time: '',
      end_time: '',
      point_of_interest: '',
      address: '',
      description: '',
      plan: '',
      id: ''
    })
  }

  const handleClose = id => {
    setShow({
      ...show,
      [id]: false
    })
    resetNewItin()
  }

  const handleShow = itinerary => {
    setNewItinerary({
      ...itinerary,
      date: formatDatesSlash(itinerary.date),
      start_time: formatTimes(itinerary.start_time),
      end_time: formatTimes(itinerary.end_time)
    })
    setShow({
      ...show,
      [itinerary.id]: true
    })
  }

  const onPOIChange = event => {
    setNewItinerary({
      ...newItinerary,
      point_of_interest: event.target.value
    })
  }

  const onDateChange = event => {
    setNewItinerary({
      ...newItinerary,
      date: event.target.value
    })
  }

  const onTimeStartChange = event => {
    setNewItinerary({
      ...newItinerary,
      start_time: event.target.value
    })
  }

  const onTimeEndChange = event => {
    setNewItinerary({
      ...newItinerary,
      end_time: event.target.value
    })
  }

  const onDescChange = event => {
    setNewItinerary({
      ...newItinerary,
      description: event.target.value
    })
  }

  const onAddressChange = event => {
    setNewItinerary({
      ...newItinerary,
      address: event.target.value
    })
  }

  const handleUpdateSubmit = event => {
    event.preventDefault()
    updateItinerary(newItinerary, user.token)
      .then(() => {
        handleClose(newItinerary.id)
        setRerender(!rerender)
      }
      )
      .catch(() => {
        msgAlert({
          heading: 'Itinerary Update Failed',
          message: messages.updateItinerary,
          variant: 'danger'
        })
      })
  }

  const handlePostSubmit = event => {
    event.preventDefault()
    addItinerary(plan.id, newItinerary, user.token)
      .then(() => {
        resetNewItin()
        setRerender(!rerender)
      }
      )
      .catch(() => {
        msgAlert({
          heading: 'Itinerary Post Failed',
          message: messages.postItinerary,
          variant: 'danger'
        })
      })
  }

  const handleDelete = itin => {
    setShowDel(true)
    setNewItinerary({
      id: itin.id
    })
  }

  const handleDelClose = event => {
    setShowDel(false)
    resetNewItin()
  }

  const handleConfirmDelete = event => {
    deleteItinerary(newItinerary.id, user.token)
      .then(() => {
        handleDelClose()
        setRerender(!rerender)
      })
      .catch(() => {
        msgAlert({
          heading: 'Itinierary Item Deletion Failed',
          message: messages.deleteItinerary,
          variant: 'danger'
        })
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

  if (!planId) {
    return (
      <Redirect to='/plans' />
    )
  } else {
    return (
      <div>
        <h2 className='page-title'>Itinerary for {plan.destination}</h2>
        {Array.isArray(itineraries) && itineraries.map((day, index) => (
          <div key={index}>
            <Card>
              <Card.Header><h3>{formatDates(day[0])}</h3></Card.Header>
              <Card.Body>
                {day.slice(1).map((itinerary, index) => (
                  <div key={index}>
                    <Accordion>
                      <ListGroup className='itinerary-info'>
                        <ListGroup.Item><h4>{itinerary.point_of_interest}</h4></ListGroup.Item>
                        <ListGroup.Item><h5><strong>Time:</strong> {formatTimes(itinerary.start_time)} - {formatTimes(itinerary.end_time)}</h5></ListGroup.Item>
                      </ListGroup>
                      <Accordion.Toggle onClick={() => handleToggle(itinerary.id)} as={Button} variant="link" eventKey="1">
                        {accordionWord[itinerary.id]}
                      </Accordion.Toggle>
                      <Accordion.Collapse eventKey='1'>
                        <React.Fragment>
                          <p className='add-desc'><strong>Address:</strong> {itinerary.address}</p>
                          <p className='add-desc'><strong>Description:</strong> {itinerary.description}</p>
                          <Container>
                            <Row className='itinerary-button-class'>
                              <Col className='col-6'>
                                <Button onClick={() => handleShow(itinerary)}>Update Itinerary Item</Button>
                              </Col>
                              <Col className='col-6'>
                                <Button onClick={() => handleDelete(itinerary)}>Delete Itinerary Item</Button>
                              </Col>
                            </Row>
                          </Container>
                        </React.Fragment>
                      </Accordion.Collapse>
                      <Modal show={show[itinerary.id]} onHide={() => handleClose(itinerary.id)} backdrop="static">
                        <Modal.Header closeButton>
                          <Modal.Title className='title-class'>Update Itinerary Item</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <Form onSubmit={handleUpdateSubmit}>
                            <Form.Group controlId="formBasicPOI">
                              <Form.Label>Point of Interest</Form.Label>
                              <Form.Control type="text" onChange={onPOIChange} value={newItinerary.point_of_interest}/>
                            </Form.Group>
                            <Form.Group controlId="formBasicPOI">
                              <Form.Label>Address</Form.Label>
                              <Form.Control type="text" onChange={onAddressChange} value={newItinerary.address}/>
                            </Form.Group>
                            <Form.Row>
                              <Col className='col-4'>
                                <Form.Group controlId="formBasicDate">
                                  <Form.Label>Date</Form.Label>
                                  <Form.Control type="text" onChange={onDateChange} value={newItinerary.date}/>
                                </Form.Group>
                              </Col>
                              <Col className='col-4'>
                                <Form.Group controlId="formBasicStartTime">
                                  <Form.Label>Start Time</Form.Label>
                                  <Form.Control type="text" maxLength="5" onChange={onTimeStartChange} value={newItinerary.start_time} />
                                  <Form.Text>Please use 24hr format.</Form.Text>
                                </Form.Group>
                              </Col>
                              <Col className='col-4'>
                                <Form.Group controlId="formBasicEndTime">
                                  <Form.Label>End Time</Form.Label>
                                  <Form.Control type="text" maxLength="5" onChange={onTimeEndChange} value={newItinerary.end_time} />
                                </Form.Group>
                              </Col>
                            </Form.Row>
                            <Form.Group controlId="formBasicDesc">
                              <Form.Label>Description</Form.Label>
                              <Form.Control type="text" value={newItinerary.description} onChange={onDescChange}/>
                            </Form.Group>
                            <Modal.Footer>
                              <Button variant="primary" type="submit">
                                Update Itinerary Item
                              </Button>
                            </Modal.Footer>
                          </Form>
                        </Modal.Body>
                      </Modal>
                    </Accordion>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </div>
        ))}
        {!Array.isArray(itineraries) && jsxHack(itineraries).map(itineraries => (
          <Card key={itineraries}>
            <Card.Header><h3>{itineraries}</h3></Card.Header>
          </Card>
        ))}
        <Accordion>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="1" className='add-button'>
        Add New Itinerary Item
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey='1'>
              <Card.Body>
                <Card.Text><Form onSubmit={handlePostSubmit}>
                  <Form.Row>
                    <Col>
                      <Form.Group controlId="formBasicPOI">
                        <Form.Label>Point of Interest</Form.Label>
                        <Form.Control type="text" onChange={onPOIChange} value={newItinerary.point_of_interest} placeholder='Point of interest here'/>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formBasicDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="text" onChange={onDateChange} value={newItinerary.date} placeholder='00/00/0000'/>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Row>
                    <Col>
                      <Form.Group controlId="formBasicStartTime">
                        <Form.Label>Start Time</Form.Label>
                        <Form.Control type="text" maxLength="5" onChange={onTimeStartChange} value={newItinerary.start_time} placeholder='00:00'/>
                        <Form.Text>Please use 24hr format.</Form.Text>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formBasicEndTime">
                        <Form.Label>End Time</Form.Label>
                        <Form.Control type="text" maxLength="5" onChange={onTimeEndChange} value={newItinerary.end_time} placeholder='00:00'/>
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Group controlId="formBasicDesc">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" value={newItinerary.address} onChange={onAddressChange} placeholder="Address here"/>
                  </Form.Group>
                  <Form.Group controlId="formBasicDesc">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" value={newItinerary.description} onChange={onDescChange} placeholder="Description here"/>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                  Add Itinerary Item
                  </Button>
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
      </div>
    )
  }
}

export default withRouter(Itineraries)
