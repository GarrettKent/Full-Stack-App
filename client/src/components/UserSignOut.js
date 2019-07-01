import React, {Component} from "react";
import {Redirect} from "react-router-dom";

//when signing out, everything is to be cleared from the browser
class UserSignOut extends Component {
  componentDidMount() {
    window.localStorage.removeItem('FirstName')
    window.localStorage.removeItem('LastName')
    window.localStorage.removeItem('EmailAddress')
    window.localStorage.removeItem('Password')
    window.localStorage.removeItem('UserId')
    window.localStorage.removeItem('IsLoggedIn')
    window.localStorage.removeItem('id')
    window.localStorage.removeItem('name')
    window.localStorage.removeItem('password')
    window.localStorage.removeItem('username')
    window.location.assign('/signin')
  }
  render() {
    return(
      <Redirect to="/signin" />
    )
  }
}

export default UserSignOut;