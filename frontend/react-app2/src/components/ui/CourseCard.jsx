import classes from './CourseCard.module.css';
import {Link} from 'react-router-dom'
import { useState, useEffect } from "react";

function CourseCard (props) {

    const [state, setState] = useState({
        id: props.id,
        title: props.title,
        sourcePage: null
    })

    function handleClick(e, id) {
        e.preventDefault();
        props.sendData(id);
    }

    useEffect(() => {
        //setState({sourcePage: props.page})
        console.log("żródełko c: ", props.page)
    }, [])

    return (
        <div>
        {
            props.page === "AllCourses" || props.page === "HomePage" ?
            <div className={classes.singleCourseContainer}>
                <img src="" alt="" className={classes.courseImg} />
                <a  className={classes.singleCourseTitle}>{props.title}</a>
                <div className={classes.wrapper}>
                    <button className={classes.singleCourseButton} onClick={(e) => {handleClick(e, props.id)}}>{props.buttonText}</button>
                </div>
            </div> : props.page === "UserCourses" ?
            <div className={classes.singleCourseContainer}>
                <img src="" alt="" className={classes.courseImg} />
                <Link to={{ pathname: '/course', state: state }} className={classes.singleCourseTitle}>{props.title}</Link>
                <div className={classes.wrapper}>
                    <button className={classes.singleCourseButton} onClick={(e) => {handleClick(e, props.id)}}>{props.buttonText}</button>
                </div>
            </div> :
                <div className={classes.singleCourseContainer}>
                <img src="" alt="" className={classes.courseImg} />
                <Link to={{ pathname: '/course', state: state }} className={classes.singleCourseTitle}>{props.title}</Link>
                <div className={classes.wrapper}>
                    <button className={classes.singleCourseButton} onClick={(e) => {handleClick(e, props.id)}}>{props.buttonText}</button>
                    <Link to={{ pathname: '/user-courses/course-edit', state: state }} className={classes.editIcon}></Link>
                </div>
            </div> 
        }
        </div>
    )
}

export default CourseCard;