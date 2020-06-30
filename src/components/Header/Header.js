import React, { Fragment } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

const authenticatedOptions = (
  <Fragment>
    <Nav.Link href="#plans">Plans</Nav.Link>
    <Nav.Link href="#change-password">Change Password</Nav.Link>
    <Nav.Link href="#sign-out">Sign Out</Nav.Link>
  </Fragment>
)

// const unauthenticatedOptions = (
//   <Fragment>
//     <Nav.Link href="#sign-up">Sign Up</Nav.Link>
//     <Nav.Link href="#sign-in">Sign In</Nav.Link>
//     <Nav.Link onClick={onGuestLogin}>Sign In As Guest</Nav.Link>
//   </Fragment>
// )

const alwaysOptions = (
  <Fragment>
  </Fragment>
)

const Header = ({ user, setIsGuest }) => {
  const onGuestLogin = () => {
    setIsGuest(true)
  }
  return (
    <Navbar className='main-nav' expand="md">
      <Navbar.Brand>
        <img
          alt=""
          src="https://i.imgur.com/z9jp6mA.png"
          width="40"
          height="40"
          className="d-inline-block align-top"
        />{' '}
        TraveloZity
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          { user && <span className="navbar-text mr-2 welcome">Welcome!</span>}
          { alwaysOptions }
          { user ? authenticatedOptions : (<Fragment>
            <Nav.Link href="#sign-up">Sign Up</Nav.Link>
            <Nav.Link href="#sign-in">Sign In</Nav.Link>
            <Nav.Link href="#sign-in" onClick={onGuestLogin}>Sign In As Guest</Nav.Link>
          </Fragment>) }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header
