import { useEffect, useState } from "react"
import classes from "./UserCourses.module.css";
import CourseCard from "../../ui/CourseCard";

export default function UserCoursesList(props) {

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState();
    const [pressedSort, setPressedSort] = useState();
    const sortedCourses = [...courses];
    const [sortedCoursesState, SetSCS] = useState([]);
    const [pressedFilter, setPressedFilter] = useState();

    useEffect(() => {
        setCourses(props.courses);
        SetSCS(courses);
        setIsLoading(props.IsLoading);
        setPressedSort(props.pressedSort);
        setPressedFilter(props.pressedFilter)
        if (pressedSort === 'alphabetic') {
            SetSCS(sortedCourses.sort((a,b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1))
        } else if (pressedSort === 'date-created') { 
            SetSCS(sortedCourses.sort((a,b) => a.created_at > b.created_at ? 1 : -1))
        } else if (pressedSort === 'none' || pressedSort === null || pressedFilter === 'none') {
            SetSCS(courses)
        }
        console.log("got id: ", props.pressedFilterId)
    })

    function getData(id) {
      console.log("zwrócone id: ", id);
      localStorage.setItem("pressedCourseID", id);
      props.returnId(id)
    }

    return (
    <div>
        {/* {
            pressedFilter === null ?
            <div className={classes.userCoursesListContainer}>
                {
                isLoading === false ?
                sortedCourses.map(course => <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                buttonText={props.buttonContent}
                sendData = {getData}/>) : 
                <div className={classes.loadingWrapper}><div className={classes.loading}></div></div>
                }
            </div> : null
        } */}
        {
            pressedFilter === 'categories' ?
            <div className={classes.userCoursesListContainer}>
                {
                isLoading === false ?
                sortedCoursesState.filter(course => course.category === props.pressedFilterId).map(course => <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                buttonText={props.buttonContent}
                sendData = {getData}
                page={props.page}/>) : 
                <div className={classes.loadingWrapper}><div className={classes.loading}></div></div>
                }
            </div> : null
        }
        {/* <div className={classes.userCoursesListContainer}>
            {
            isLoading === false ?
            sortedCoursesState.filter(course => course.category === 3).map(course => <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            buttonText={props.buttonContent}
            sendData = {getData}/>) : 
            <div className={classes.loadingWrapper}><div className={classes.loading}></div></div>
            }
        </div> */}
        {pressedFilter === 'none' ?
        <div className={classes.userCoursesListContainer}>
            {
            isLoading === false ?
            sortedCoursesState.map(course => <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            buttonText={props.buttonContent}
            sendData = {getData}
            page={props.page}/>) : 
            <div className={classes.loadingWrapper}><div className={classes.loading}></div></div>
            }
        </div> : null
        }
    </div>
    )
}