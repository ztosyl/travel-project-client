import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'

import { signIn } from '../../api/auth'
import messages from '../AutoDismissAlert/messages'

import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'

const SignIn = ({ msgAlert, history, setUserToken, isGuest }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailChange = event => {
    setEmail(event.target.value)
  }
  const handlePasswordChange = event => {
    setPassword(event.target.value)
  }

  useEffect(() => {
    if (isGuest) {
      setEmail('guest@guest.com')
      setPassword('ggggg')
    }
  }, [])

  const onSignIn = event => {
    event.preventDefault()
    signIn(email, password)
      .then(res => {
        setUserToken(res.data.token)
      })
      .then(() => msgAlert({
        heading: 'Sign In Success',
        message: messages.signInSuccess,
        variant: 'success'
      }))
      .then(() => history.push('/plans'))
      .catch(error => {
        setEmail('')
        setPassword('')
        msgAlert({
          heading: 'Sign In Failed with error: ' + error.message,
          message: messages.signInFailure,
          variant: 'danger'
        })
      })
  }
  return (
    <div className="row">
      <div className="col-sm-10 col-md-8 mx-auto mt-5">
        <Card className='auth-card'>
          <h3>Sign In</h3>
          <Form className='auth-form' onSubmit={onSignIn}>
            <Form.Group controlId="email">
              <Form.Control
                required
                type="email"
                name="email"
                value={email}
                placeholder="Enter email"
                onChange={handleEmailChange}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Control
                required
                name="password"
                value={password}
                type="password"
                placeholder="Password"
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Button
              className='col-3'
              variant="primary"
              type="submit"
            >
              Submit
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default withRouter(SignIn)
