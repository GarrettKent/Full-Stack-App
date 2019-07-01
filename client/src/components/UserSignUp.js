import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class UserSignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      emailAddress: '',
      password: '',
      confirmPassword: '',
      validationErrors: [],
      emailInUseError: '',
      passwordsNotMatching: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  //hitting submit checks if passwords match then calls handleSignUp
  handleSubmit = (e) => {
    const { password, confirmPassword } = this.state 
    e.preventDefault();
    if(password === confirmPassword) {
      this.setState ({ passwordsNotMatching: false })
      this.handleSignUp();
    } else {
      this.setState ({ passwordsNotMatching: true })
    }
  }

  handleSignUp = () => {
    const { firstName, lastName, emailAddress, password, confirmPassword } = this.state;
    //using post to create new user
    axios({
      method: 'post',
      url: 'http://localhost:5000/api/users/',
      data: {
        firstName,
        lastName,
        emailAddress,
        password,
        confirmPassword
      }
    })
    .then(() => {
      //signs new user in, catches any errors
      this.props.handleSignIn(emailAddress, password);      
    })
    .catch(err => {
      if (err.response.status === 500) {
        console.error(err);
        this.props.history.push('/error');
      } else if (err.response.data.message) {
        this.setState ({ emailInUseError: err.response.data.message })
      } else {
        this.setState({ validationErrors: err.response.data.errors })
      }
    });
  }

  handleChange = e => {
    this.setState({ [ e.target.name ] : e.target.value });
  }
  //if signup works, redirect to home. if not, check for val errors
  render() {
    const { validationErrors, emailInUseError, passwordsNotMatching } = this.state
    return (
      <div className="bounds">
        { localStorage.getItem("IsLoggedIn") && (
            this.props.history.push('/')
        )}

        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
          <div>
            <div className="validation-errors">
              <ul>
                { validationErrors ? (
                  validationErrors.map((err) =>
                    <li key={err.toString()}>{err}</li>
                  )
                ) :''}
                { passwordsNotMatching ? (
                  <li>Passwords are not matching</li>
                ) :''}
                {emailInUseError ? (
                  <li>{emailInUseError}</li>
                ) : ''}
              </ul>
            </div>
            <form onSubmit={this.handleSubmit}>
              <div>
                <input 
                  id="firstName" 
                  name="firstName" 
                  type="text"
                  className=""
                  placeholder="First Name"
                  value={this.state.firstName}
                  onChange={e => this.handleChange(e)}
                />
              </div>
              <div>
                <input 
                  id="lastName" 
                  name="lastName" 
                  type="text"
                  className=""
                  placeholder="Last Name"
                  value={this.state.lastName}
                  onChange={e => this.handleChange(e)}
                />
              </div>
              <div>
                <input 
                  id="emailAddress" 
                  name="emailAddress" 
                  type="email"
                  className=""
                  placeholder="Email Address"
                  value={this.state.emailAddress}
                  onChange={e => this.handleChange(e)}
                />
              </div>
              <div>
                <input 
                  id="password"
                  name="password"
                  type="password"
                  className=""
                  placeholder="Password"
                  value={this.state.password}
                  onChange={e => this.handleChange(e)}
                />
              </div>
              <div>
                <input 
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className=""
                  placeholder="Confirm Password"
                  value={this.state.confirmPassword}
                  onChange={e => this.handleChange(e)}
                />
              </div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="sumbit">Sign Up</button>
                <Link className="button button-secondary" to="/">Cancel</Link>
              </div>
            </form>
            <p>&nbsp;</p>
            <p>Already have a user account?<Link to="/signin">Click here</Link>to sign in!</p>
          </div>
        </div>
      </div>
    )}};

export default UserSignUp;