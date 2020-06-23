import React, { useState, useEffect } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Accordion from 'react-bootstrap/Accordion'
import Modal from 'react-bootstrap/Modal'
import messages from '../AutoDismissAlert/messages'
import { getItineraries, deleteItinerary, updateItinerary, addItinerary } from '../../api/itineraries'
import { getPlan } from '../../api/plans'
import { formatDates, formatDatesSlash } from '../../lib/date-functions'
import { formatTimes } from '../../lib/time-functions'

const Itineraries = ({ msgAlert, userToken, match }) => {
  const { planId } = match.params
  const [itineraries, setItineraries] = useState([])
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

  useEffect(() => {
    getItineraries(planId, userToken)
      .then(data => {
        for (let i = 0; i < data.data.length; i++) {
          setShow({
            ...show,
            [i]: false
          })
        }
        setItineraries(data.data)
        return getPlan(planId, userToken)
      })
      .then(data => {
        setPlan(data.data)
      })
      .catch(() => {
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
    updateItinerary(newItinerary, userToken)
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
    addItinerary(plan.id, newItinerary, userToken)
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
    deleteItinerary(newItinerary.id, userToken)
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

  if (!planId) {
    return (
      <Redirect to='/plans' />
    )
  } else {
    return (
      <div>
        <h2>Itinerary for {plan.destination}</h2>
        {itineraries && itineraries.map(itinerary => (
          <div key={itinerary.id}>
            <Accordion>
              <Card>
                <Card.Body>
                  <Card.Title><h3>{itinerary.point_of_interest}</h3></Card.Title>
                  <Card.Text><h5>On {formatDates(itinerary.date)} from {formatTimes(itinerary.start_time)} to {formatTimes(itinerary.end_time)}</h5></Card.Text>
                  <Accordion.Toggle as={Button} variant="link" eventKey="1">
                        Show More
                  </Accordion.Toggle>
                </Card.Body>
              </Card>
              <Accordion.Collapse eventKey='1'>
                <Card>
                  <Card.Body>
                    <Card.Text>{itinerary.description}.</Card.Text>
                    <Button onClick={() => handleShow(itinerary)}>Update itinerary</Button>
                    <Button onClick={() => handleDelete(itinerary)}>Delete itinerary</Button>
                  </Card.Body>
                </Card>
              </Accordion.Collapse>
            </Accordion>
            <Modal show={show[itinerary.id]} onHide={() => handleClose(itinerary.id)} backdrop="static">
              <Modal.Header closeButton>
                <Modal.Title>Update Itinerary</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleUpdateSubmit}>
                  <Form.Group className='col-6' controlId="formBasicPOI">
                    <Form.Label>Point of Interest</Form.Label>
                    <Form.Control type="text" onChange={onPOIChange} value={newItinerary.point_of_interest}/>
                  </Form.Group>
                  <Form.Group className='col-6' controlId="formBasicDate">
                    <Form.Label>Date</Form.Label>
                    <Form.Control type="text" onChange={onDateChange} value={newItinerary.date}/>
                  </Form.Group>
                  <Form.Row>
                    <Col>
                      <Form.Group controlId="formBasicStartTime">
                        <Form.Label>Time Start</Form.Label>
                        <Form.Control type="text" maxLength="3" onChange={onTimeStartChange} value={newItinerary.start_time} />
                        <Form.Text>Please use 24-hour format.</Form.Text>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formBasicEndTime">
                        <Form.Label>Time End</Form.Label>
                        <Form.Control type="text" maxLength="3" onChange={onTimeEndChange} value={newItinerary.end_time} />
                      </Form.Group>
                    </Col>
                  </Form.Row>
                  <Form.Group controlId="formBasicDesc">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" value={newItinerary.description} onChange={onDescChange}/>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Update
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        ))}
        <Card>
          <Card.Body>
            <Card.Title>Add New Itinerary Item</Card.Title>
            <Card.Text><Form onSubmit={handlePostSubmit}>
              <Form.Group className='col-6' controlId="formBasicPOI">
                <Form.Label>Point of Interest</Form.Label>
                <Form.Control type="text" onChange={onPOIChange} value={newItinerary.point_of_interest} placeholder='Point of interest here'/>
              </Form.Group>
              <Form.Group className='col-6' controlId="formBasicDate">
                <Form.Label>Date</Form.Label>
                <Form.Control type="text" onChange={onDateChange} value={newItinerary.date} placeholder='00/00/0000'/>
              </Form.Group>
              <Form.Row>
                <Col>
                  <Form.Group controlId="formBasicStartTime">
                    <Form.Label>Time Start</Form.Label>
                    <Form.Control type="text" maxLength="5" onChange={onTimeStartChange} value={newItinerary.start_time} placeholder='00:00'/>
                    <Form.Text>Please use 24-hour format.</Form.Text>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="formBasicEndTime">
                    <Form.Label>Time End</Form.Label>
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
                Add Itinerary
              </Button>
            </Form></Card.Text>
          </Card.Body>
        </Card>
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
}

export default withRouter(Itineraries)
