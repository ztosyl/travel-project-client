import React, { Component, Fragment } from 'react'
import { Route } from 'react-router-dom'

import AuthenticatedRoute from '../AuthenticatedRoute/AuthenticatedRoute'
import AutoDismissAlert from '../AutoDismissAlert/AutoDismissAlert'
import Header from '../Header/Header'
import SignUp from '../SignUp/SignUp'
import SignIn from '../SignIn/SignIn'
import SignOut from '../SignOut/SignOut'
import ChangePassword from '../ChangePassword/ChangePassword'
import Plans from '../Plans/Plans'
import Itineraries from '../Itineraries/Itineraries'

class App extends Component {
  constructor () {
    super()

    this.state = {
      userId: null,
      userToken: null,
      msgAlerts: []
    }
  }

  setUserId = id => this.setState({ userId: id })

  setUserToken = token => this.setState({ userToken: token })

  clearUser = () => {
    this.setState({ userId: null })
    this.setState({ userToken: null })
  }

  msgAlert = ({ heading, message, variant }) => {
    this.setState({ msgAlerts: [...this.state.msgAlerts, { heading, message, variant }] })
  }

  render () {
    const { msgAlerts, userId, userToken } = this.state

    return (
      <Fragment>
        <Header user={userToken} />
        {msgAlerts.map((msgAlert, index) => (
          <AutoDismissAlert
            key={index}
            heading={msgAlert.heading}
            variant={msgAlert.variant}
            message={msgAlert.message}
          />
        ))}
        <main className="container">
          <Route path='/sign-up' render={() => (
            <SignUp msgAlert={this.msgAlert} setUserId={this.setUserId} setUserToken={this.setUserToken} />
          )} />
          <Route path='/sign-in' render={() => (
            <SignIn msgAlert={this.msgAlert} setUserId={this.setUserId} setUserToken={this.setUserToken} />
          )} />
          <AuthenticatedRoute userToken={userToken} path='/sign-out' render={() => (
            <SignOut msgAlert={this.msgAlert} clearUser={this.clearUser} userToken={userToken} />
          )} />
          <AuthenticatedRoute userToken={userToken} path='/change-password' render={() => (
            <ChangePassword msgAlert={this.msgAlert} userToken={userToken} />
          )} />
          <AuthenticatedRoute userToken={userToken} path='/plans' render={() => (
            <Plans msgAlert={this.msgAlert} userToken={userToken} userId={userId}/>
          )} />
          <AuthenticatedRoute userToken={userToken} path='/:planId/itineraries' render={() => (
            <Itineraries msgAlert={this.msgAlert} userToken={userToken} userId={userId}/>
          )} />
        </main>
      </Fragment>
    )
  }
}

export default App
