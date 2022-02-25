import { useState } from "react";
import { useEffect } from "react";
import Ad from "../components/layout/Ad";
import classes from "./HomePage.module.css"
import axios from "axios";
import UserCoursesList from "../components/layout/userCourses/UserCoursesList";

const DUMMY_DATA = [
    {
      id: 'm1',
      title: 'SQL Course',
      image:
        'https://image.shutterstock.com/image-photo/php-programming-language-on-computer-600w-1915285948.jpg',
      address: 'Sample text',
      description:
        'Learn SQL to gain some experience and mental illness!',
    },
    {
      id: 'm2',
      title: 'React Course',
      image:
        'https://image.shutterstock.com/image-photo/php-programming-language-on-computer-600w-1915285948.jpg',
      address: 'Sample text',
      description:
        'sample data',
    },
    {
      id: 'm3',
      title: 'React Course',
      image:
        'https://image.shutterstock.com/image-photo/php-programming-language-on-computer-600w-1915285948.jpg',
      address: 'Sample text',
      description:
        'sample data again',
    },
    {
      id: 'm4',
      title: 'React Course',
      image:
        'https://image.shutterstock.com/image-photo/php-programming-language-on-computer-600w-1915285948.jpg',
      address: 'Sample text',
      description:
        'You get the point',
    },
  ];


function AllMeetupsPage() {

  const [topCourses, setTopCourses] = useState([])
  const [recent, setRecent] = useState([])
  const [loading, setIsLoading] = useState(true)

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/v1/courses/top-courses-ranking', {
      auth: {
          username: localStorage.getItem('username'),
          email: localStorage.getItem('email'),
          password: localStorage.getItem('password')
          }
      })
      .then(res => {
        setTopCourses(res.data.slice(0, 4))
        setIsLoading(false)
      })
  }, [])

  function getId(id) {

  }

    return <div>
      <div><Ad /></div>
      <h1>Recently top rated courses</h1> 
      <div className={classes.coursesListContainer}>
        {
          <UserCoursesList courses={topCourses} IsLoading={loading} returnId={getId} pressedFilter='all' pressedFilterId={null}
          pressedSort={null} buttonContent="sign in" page="AllCourses"/>
        }
      </div>
      <hr className={classes.listHr}></hr>
      <h1>Recently added courses</h1>
      <div className={classes.coursesListContainer}>
        {
          <UserCoursesList courses={topCourses} IsLoading={loading} returnId={getId} pressedFilter='all' pressedFilterId={null}
          pressedSort={null} buttonContent="sign in" page="AllCourses"/>
        }
      </div>
      <div className={classes.bottomEnder}></div>
    </div>
}

export default AllMeetupsPage;