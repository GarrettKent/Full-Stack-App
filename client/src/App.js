import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import axios from 'axios';

import CourseDetail from './components/CourseDetail';
import Courses from './components/Courses';
import CreateCourse from './components/CreateCourse';
import Forbidden from './components/Forbidden';
import Header from './components/Header';
import NotFound from './components/NotFound';
import PrivateRoute from './components/PrivateRoute';
import UnhandledError from './components/UnhandledError';
import UpdateCourse from './components/UpdateCourse';
import UserSignIn from './components/UserSignIn';
import UserSignUp from './components/UserSignUp';
import UserSignOut from './components/UserSignOut';

class App extends Component {
 constructor() {
    super();
    this.state = {
      validationError: ''
    };
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  //handles signing in users then stores their info to the browser, catches any errors
  handleSignIn(username, password, props) {
    axios.get("http://localhost:5000/api/users", {
      auth: {
        username: username,
        password: password
      }
    })
    .then(res => { 
      window.localStorage.setItem('FirstName',res.data.firstName)
      window.localStorage.setItem('LastName', res.data.lastName)
      window.localStorage.setItem('EmailAddress', username)
      window.localStorage.setItem('Password', password)
      window.localStorage.setItem('UserId', JSON.stringify(res.data.id))
      window.localStorage.setItem('IsLoggedIn', JSON.stringify(true))

      this.setState({validationError: ''})
    })
    .catch(err => {
      if (err.response.status === 401) {
        this.setState ({validationError: err.response.data.message })
    } else {
        console.error(err);
        this.props.history.push('/error');
      }
    });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="root">
          <Header />
          <Switch>
            <Route exact path="/" component={Courses} />
            <PrivateRoute path="/courses/create" component={CreateCourse} />
            <PrivateRoute path="/courses/:id/update" component={UpdateCourse} />
            <Route exact path="/courses/:id" component={CourseDetail} />
            <Route exact path="/signin" component={ (props) => <UserSignIn
              handleSignIn={this.handleSignIn} 
              validationError={this.state.validationError}
              {...props} /> 
            } />

            <Route exact path="/signup" component={ (props) => <UserSignUp
              handleSignIn={this.handleSignIn}
              {...props} /> 
            } />

            <Route exact path="/signout" component={UserSignOut} />
            <Route exact path="/forbidden" component={Forbidden} />
            <Route exact path="/notfound" component={NotFound} />
            <Route exact path="/error" component={UnhandledError} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </BrowserRouter>    
    )}};

export default App;