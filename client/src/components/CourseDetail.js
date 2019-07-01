import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import {Spring} from 'react-spring/renderprops';


class CourseDetail extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      course: [ ],
      user: [ ]
    }
     this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id    

    //gets course and saves it. If server error, pushes error page 
    axios
      .get(`http://localhost:5000/api/courses/${id}`)
      .then(res => {
        this.setState({
          course: res.data,
          user: res.data.User,
        });
      })
      .catch(err => {
        if (err.res.status === 500) {         
          console.error(err);
          this.props.history.push('/error');
        } else {          
          this.props.history.push('/notfound');
        }
      });
  }

  // deletes course then redirects to home page, or catches any server error.
  handleDelete() {
    const { match: {params}, history } = this.props;

    axios
      .delete(`http://localhost:5000/api/courses/${params.id}`, {
        auth: {
          username: window.localStorage.getItem("EmailAddress"),
          password: window.localStorage.getItem("Password"),
        }
      })
      .then(() => {
        history.push('/');
      })
      .catch(err => {
        if (err.response.status === 500) {
          console.error(err);
          this.props.history.push('/error');
        } else {
          this.props.history.push('/notfound');
        }
      });
  }

  render () {

    const {course, user} = this.state;
    const isLoggedIn = localStorage.getItem("IsLoggedIn");
    const UserId = JSON.parse(localStorage.getItem("UserId"));

    return (
      <Spring from={{opacity: 0}} to={{opacity: 2}}>
        {props => (
         
          <div style={props}>
            <div className="actions--bar">
              <div className="bounds">
                <div className="grid-100">

                
                  {(isLoggedIn && user.id === UserId) ? (
                      <span>

                        <Link className="button" to={`/courses/${course.id}/update`}>
                          Update Course
                        </Link>

                        <button className="button" to="#" onClick={this.handleDelete}>
                          Delete Course
                        </button>

                      </span>
                  ) 
                    :  '' 
                  }

                  <Link className="button button-secondary" to="/">
                    Return to List
                  </Link>

                </div>
              </div>
            </div>
            
            <div className="bounds course--detail">
              <div className="grid-66">
                <div className="course--header">
                  <h4 className="course--label">Course</h4>
                  <h3 className="course--title">{course.title}</h3>
                  <p>By {user.firstName} {user.lastName}</p>
                </div>
                <div className="course-description">
                  <ReactMarkdown source={course.description} />
                </div>
              </div>
              <div className="grid-25 grid-right">
                <div className="course--stats">
                  <ul className="course--stats--list">
                    <li className="course--stats--list--item">
                      <h4>Estimated Time</h4>
                      <h3>{course.estimatedTime}</h3>
                    </li>
                    <li className="course--stats--list--item">
                      <h4>Materials Needed</h4>
                      <ul>
                        <ReactMarkdown source={course.materialsNeeded} />
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </Spring>
    )}}

export default CourseDetail;