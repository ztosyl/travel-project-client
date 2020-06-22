import React from 'react'
import { Route, Redirect } from 'react-router-dom'

// props will include a `user` object or empty object
// props will include a `component` as `Component` or a `render`
// all other props that may be passed in are `..rest`
const AuthenticatedRoute = ({
  userToken,
  component: Component,
  render,
  ...rest
}) => {
  // if props include a `user` object and a `render` then create route with `render`
  if (userToken && render) {
    return <Route {...rest} render={render} />

  // if props include a `user` object but no `render` then create route with `Component`
  // if props do not include a `user` object then redirect to home
  } else {
    return <Route {...rest} render={props =>
      userToken ? <Component {...props} /> : <Redirect to='/' />
    } />
  }
}

export default AuthenticatedRoute
