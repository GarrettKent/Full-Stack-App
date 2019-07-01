import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

class UpdateCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      course: [],
      user: [],
      title: '',
      description: '',
      estimatedTime: '',
      materialsNeeded: '',
      validationErrors: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  //hitting submit sends request to update the selected course, then pushes it to the page. catches any errors.
  handleSubmit = (e) => {

    const id =  this.props.match.params.id;
    e.preventDefault();

    axios ({
      method: 'put',
      url: `http://localhost:5000/api/courses/${id}`,
      auth: {
        username: window.localStorage.getItem('EmailAddress'),
        password: window.localStorage.getItem('Password')
      },
      data: {
        id: id,
        title: this.state.title,
        description: this.state.description,
        estimatedTime: this.state.estimatedTime,
        materialsNeeded: this.state.materialsNeeded
      }
    })
    .then( () => {
      this.props.history.push(`/courses/${id}`);
    })
    .catch(err => {
      if (err.response.status === 500) {
        console.error(err);
        this.props.history.push('/error');
      } else {
        this.setState({ validationErrors: err.response.data.message })
      }
    });
  }

  /* Handle changes to the form inputs */
  handleChange = e => {
    this.setState({ [ e.target.name ] : e.target.value });
  }

  componentDidMount() {
    const id =  this.props.match.params.id;
    axios.get(`http://localhost:5000/api/courses/${id}`)
      .then(res => {
        const course = res.data;

        //determines if user has authrity to update course. If not, user redirected to forbidden page. Catches any errors
        if(course.userId === JSON.parse(localStorage.getItem('UserId'))) {
          this.setState({
            user: course.User,
            title: course.title,
            description: course.description,
            estimatedTime: course.estimatedTime,
            materialsNeeded: course.materialsNeeded
          });
        } 
        else {
          this.props.history.push('/forbidden');
        }
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
  //checks for validation errors. If none, returns the newly updated course info
  render() {
    const { title, description, estimatedTime, materialsNeeded, user, validationErrors } = this.state;
    return (
      <div className="bounds course--detail">
        <h1>Update Course</h1>
        <div>
          {validationErrors ? (
            <div>
              <h2 className="validation--errors--labels">Validation errors</h2>
              <div className="validation-errors">
                <ul>
                  <li>{validationErrors}</li>
                </ul>
              </div>
            </div>
          ):''}
          <form onSubmit={this.handleSubmit}>
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div>
                  <input 
                    id="title"
                    name="title"
                    type="text"
                    className="input-title course--title--input"
                    placeholder="Course title..."
                    value={title}
                    onChange={e => this.handleChange(e)}
                  />
                </div>
                <p>By {user.firstName} {user.lastName}</p>
              </div>
              <div className="course--description">
                <div>
                  <textarea
                    id="description"
                    name="description"
                    className=""
                    placeholder="Course description..."
                    value={description}
                    onChange={e => this.handleChange(e)}
                  />
                </div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div>
                      <input
                        id="estimatedTime"
                        name="estimatedTime"
                        type="text"
                        className="course--time--input"
                        placeholder="Hours"
                        value={estimatedTime}
                        onChange={e => this.handleChange(e)}
                      />
                    </div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div>
                      <textarea
                        id="materialsNeeded"
                        name="materialsNeeded"
                        className=""
                        placeholder="List materials..."
                        value={materialsNeeded}
                        onChange={e => this.handleChange(e)}
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom">
              <button className="button" type="submit">
                Update Course
              </button>
              <Link className="button button-secondary" to={"/courses/" + this.props.match.params.id}>Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    )}};

export default UpdateCourse;