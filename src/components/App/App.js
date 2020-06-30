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
      user: null,
      msgAlerts: [],
      isGuest: false
    }
  }

  setUser = newUser => this.setState({ user: newUser })

  setIsGuest = bool => this.setState({ isGuest: bool })

  clearUser = () => {
    this.setState({
      user: null,
      isGuest: false
    })
  }

  msgAlert = ({ heading, message, variant }) => {
    this.setState({ msgAlerts: [...this.state.msgAlerts, { heading, message, variant }] })
  }

  render () {
    const { msgAlerts, user, isGuest } = this.state

    return (
      <Fragment>
        <Header user={user} setIsGuest={this.setIsGuest}/>
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
            <SignUp msgAlert={this.msgAlert} setUser={this.setUser} />
          )} />
          <Route path='/sign-in' render={() => (
            <SignIn msgAlert={this.msgAlert} setUser={this.setUser} isGuest={isGuest}/>
          )} />
          <AuthenticatedRoute user={user} path='/sign-out' render={() => (
            <SignOut msgAlert={this.msgAlert} clearUser={this.clearUser} user={user} />
          )} />
          <AuthenticatedRoute user={user} path='/change-password' render={() => (
            <ChangePassword msgAlert={this.msgAlert} user={user} />
          )} />
          {/* Get all of a user's plans (django already knows to only return one user's plans) */}
          <AuthenticatedRoute user={user} path='/plans' render={() => (
            <Plans msgAlert={this.msgAlert} user={user}/>
          )} />
          {/* Get all itineraries associated with a certain plan */}
          <AuthenticatedRoute user={user} path='/:planId/itineraries' render={() => (
            <Itineraries msgAlert={this.msgAlert} user={user}/>
          )} />
        </main>
      </Fragment>
    )
  }
}

export default App
