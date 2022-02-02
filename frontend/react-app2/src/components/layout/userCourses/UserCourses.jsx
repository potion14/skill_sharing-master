import classes from "./UserCourses.module.css";
import axios from "axios";
//import { useEffect, useState } from "react";
import { Component } from 'react';
import CoursePageLayout from "../../courses/course_page/CoursePageLayout";
import UserCoursesList from "./UserCoursesList";

class UserCourses extends Component {

  constructor(props) {
    super(props);
    this.state = {
      courses: [],
      cardId: null,
      isLoading: true,
      sort: ['none', 'categories', 'alphabetic', 'likes', 'date-created'],
      filters: ['none', 'categories'],
      pressedSort: null,
      pressedFilter: null
    }
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
    this.setState({cardId: id})
  }

  onSortClick(e, value) {
    e.preventDefault();
    this.setState({pressedSort: value});
  }

  onFilterClick(e, value) {
    e.preventDefault();
    this.setState({pressedFilter: value});
  }

  render() {
    const ID = localStorage.getItem("pressedCourseID");
    //console.log("render ID: ", ID)
    if (ID === 'null')
    {
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
                      </ul>
                  </div>
              </div>
              <div className={classes.middleContent}>
                  <span className={classes.userCoursesText}>User Courses</span>
                  <UserCoursesList courses={this.state.courses} IsLoading={this.state.isLoading} returnId={this.getId} pressedSort={this.state.pressedSort}
                  pressedFilter={this.state.pressedFilter} buttonContent="wypisz" page="UserCourses"/>
              </div>
              <div className={classes.rightSide}></div>
          </div>
      );
    } else if (this.state.cardId !== null) {
      //console.log("else", localStorage.getItem("pressedCourseID"));
      return (<div><CoursePageLayout {...this.props}/></div>);
    } else {
      return (
        <div className={classes.userCoursesContainer}>
              <div className={classes.leftSide}>
                  <div className={classes.filtersContainer}>
                      <span className={classes.filtersTitle}>Sort by</span>
                      <ul className={classes.filtersList}>
                          <li className={classes.filtersListItem}>loading...</li>
                      </ul>
                  </div>
                  <div className={classes.differentContainer}>
                      <span className={classes.filtersTitle}>Different</span>
                  </div>
              </div>
              <div className={classes.middleContent}>
                <span className={classes.userCoursesText}>User Courses</span>
                <div className={classes.userCoursesListContainer}>
                  <div className={classes.loadingWrapper}><div className={classes.loading}></div></div>
                </div>
              </div>
              <div className={classes.rightSide}></div>
          </div>
      )
    }
  }
}

export default UserCourses;