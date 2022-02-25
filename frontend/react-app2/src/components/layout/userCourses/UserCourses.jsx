import classes from "./UserCourses.module.css";
import axios from "axios";
import { Component } from 'react';
import CoursePageLayout from "../../courses/course_page/CoursePageLayout";
import CategoriesList from "../AllCourses/CategoriesList";
import UserCoursesList from "./UserCoursesList";
import DeleteModal from "./DeleteModal"

class UserCourses extends Component {

  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      cardId: null,
      isLoading: true,
      sort: ['alphabetic', 'likes', 'date-created'],
      filters: ['all', 'categories'],
      pressedSort: null,
      pressedFilter: 'all',
      modal: false,
      pressedFilterId: null
    }
    this.onCloseModal = this.onCloseModal.bind(this)
  }

  componentDidMount() {
    localStorage.setItem("pressedCourseID", null)
    const url = 'http://127.0.0.1:8000/api/v1/courses/my-started-courses';
    const token = localStorage.getItem('token');
    const header = 'Token ' + token;
    axios.get(url, {
      auth: {
          username: localStorage.getItem('username'),
          email: localStorage.getItem('email'),
          password: localStorage.getItem('password')
        }
      })
      .then(res => {
        this.setState({
          courses: res.data
        });
      })
      this.state.isLoading = false;
  }

  componentWillUnmount() {
    localStorage.removeItem("pressedCourseID");
  }

  getId = (id) => {
    this.setState({cardId: id, modal: true})
  }

  onSortClick(e, value) {
    e.preventDefault();
    this.setState({pressedSort: value});
  }

  onFilterClick(e, value) {
    e.preventDefault();
    this.setState({pressedFilter: value});
  }

  onCloseModal() {
    this.setState({modal: false});
  }

  onSortClick() {

  }

  onFilterClick() {

  }

  render() {
    const ID = localStorage.getItem("pressedCourseID");
      return (
          <div className={classes.userCoursesContainer}>
              <div className={classes.leftSide}>
                  <div className={classes.filtersContainer}>
                    <span className={classes.filtersTitle}>Sort by</span>
                    <ul className={classes.filtersList}>
                        {
                          this.state.sort.map((i, index) => <li key={index} tabIndex={index} onClick={(e) => {this.onSortClick(e, i)}}>{i}</li>)
                        }
                    </ul>
                </div>
                <div className={classes.differentContainer}>
                    <span className={classes.filtersTitle}>Filter by</span>
                    <ul className={classes.filtersList}>
                        {
                          this.state.filters.map((i, index) => <li key={index} tabIndex={index} onClick={(e) => {this.onFilterClick(e, i)}}>{i}</li>)
                        }
                        <CategoriesList pressedFilter={this.state.pressedFilterId} />
                    </ul>
                </div>
              </div>
              <div className={classes.middleContent}>
                  <span className={classes.userCoursesText}>User Courses</span>
                  <UserCoursesList courses={this.state.courses} IsLoading={this.state.isLoading} returnId={this.getId} pressedSort={this.state.pressedSort}
                  pressedFilter={this.state.pressedFilter} buttonContent="sign out" page="UserCourses"/>
              </div>
              <div className={classes.rightSide}></div>
              { this.state.modal && <DeleteModal closeModal={this.onCloseModal} cardId={this.state.cardId} /> }
          </div>
      );
  }
}

export default UserCourses;