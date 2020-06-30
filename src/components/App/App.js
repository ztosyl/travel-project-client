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
      /* user replaced with userToken, a bit easier to manage */
      userToken: null,
      msgAlerts: [],
      isGuest: false
    }
  }

  setUserToken = token => this.setState({ userToken: token })

  setIsGuest = bool => this.setState({ isGuest: bool })

  clearUser = () => {
    this.setState({
      userToken: null,
      isGuest: false
    })
  }

  msgAlert = ({ heading, message, variant }) => {
    this.setState({ msgAlerts: [...this.state.msgAlerts, { heading, message, variant }] })
  }

  render () {
    const { msgAlerts, userToken, isGuest } = this.state

    return (
      <Fragment>
        <Header user={userToken} setIsGuest={this.setIsGuest}/>
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
            <SignUp msgAlert={this.msgAlert} setUserToken={this.setUserToken} />
          )} />
          <Route path='/sign-in' render={() => (
            <SignIn msgAlert={this.msgAlert} setUserToken={this.setUserToken} isGuest={isGuest}/>
          )} />
          <AuthenticatedRoute userToken={userToken} path='/sign-out' render={() => (
            <SignOut msgAlert={this.msgAlert} clearUser={this.clearUser} userToken={userToken} />
          )} />
          <AuthenticatedRoute userToken={userToken} path='/change-password' render={() => (
            <ChangePassword msgAlert={this.msgAlert} userToken={userToken} />
          )} />
          {/* Get all of a user's plans (django already knows to only return one user's plans) */}
          <AuthenticatedRoute userToken={userToken} path='/plans' render={() => (
            <Plans msgAlert={this.msgAlert} userToken={userToken}/>
          )} />
          {/* Get all itineraries associated with a certain plan */}
          <AuthenticatedRoute userToken={userToken} path='/:planId/itineraries' render={() => (
            <Itineraries msgAlert={this.msgAlert} userToken={userToken}/>
          )} />
        </main>
      </Fragment>
    )
  }
}

export default App
