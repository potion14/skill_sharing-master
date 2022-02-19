import classes from './CourseCard.module.css';
import {Link} from 'react-router-dom'
import { useState, useEffect } from "react";
import StarBorder from "@material-ui/icons/StarBorder";
import Star from '@material-ui/icons/Star';
import RatingList from './RatingList';
import axios from 'axios';

function CourseCard (props) {

    const [state, setState] = useState({
        id: props.id,
        title: props.title,
        sourcePage: null
    })
    const [modal, setModal] = useState(false);
    const [ratings, setRatings] = useState([])
    const [creatorId, setCreatorId] = useState();

    function handleClick(e, id) {
        e.preventDefault();
        props.sendData(id);
    }

    function handleModal() {
        setModal(false)
    }

    function handleRatingClick(e) {
        e.preventDefault()
        setModal(true)
    }

    useEffect(() => {
        const url = 'http://127.0.0.1:8000/api/v1/courses/course/' + props.id + '/ratings/'
        axios.get(url, {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
              }
            })
            .then(res => {
              setRatings(res.data)
            })
            // axios.get('http://127.0.0.1:8000/api/v1/courses/course/' + props.id, {
            //     auth: {
            //         username: localStorage.getItem('username'),
            //         email: localStorage.getItem('email'),
            //         password: localStorage.getItem('password')
            //       }
            //     })
            //     .then(res => {
            //       setCreatorId(res.data.creator.id)
            //     })
    }, [])

    return (
        <div>
        {
            props.page === "AllCourses" || props.page === "HomePage" ?
            <div className={classes.singleCourseContainer}>
                <div className={classes.ratingDisplay} onClick={(e) => {handleRatingClick(e)}}>
                    <Star className={classes.star}/>
                    <span>{props.rating}</span>
                </div>
                <img src="" alt="" className={classes.courseImg} />
                <a  className={classes.singleCourseTitle}>{props.title}</a>
                <div className={classes.wrapper}>
                    <button className={classes.singleCourseButton} onClick={(e) => {handleClick(e, props.id)}}>{props.buttonText}</button>
                </div>
            </div> : props.page === "UserCourses" ?
            <div className={classes.singleCourseContainer}>
                <div className={classes.ratingDisplay} onClick={(e) => {handleRatingClick(e)}}>
                    <Star className={classes.star}/>
                    <span>{props.rating}</span>
                </div>
                <img src="" alt="" className={classes.courseImg} />
                <Link to={{ pathname: '/course', state: state }} className={classes.singleCourseTitle}>{props.title}</Link>
                <div className={classes.wrapper}>
                    <button className={classes.singleCourseButton} onClick={(e) => {handleClick(e, props.id)}}>{props.buttonText}</button>
                </div>
            </div> :
                <div className={classes.singleCourseContainer}>
                    <div className={classes.ratingDisplay} onClick={(e) => {handleRatingClick(e)}}>
                        <Star className={classes.star}/>
                        <span>{props.rating}</span>
                    </div>
                    <img src="" alt="" className={classes.courseImg} />
                    <Link to={{ pathname: '/course', state: state }} className={classes.singleCourseTitle}>{props.title}</Link>
                    <div className={classes.wrapper}>
                        <button className={classes.singleCourseButton} onClick={(e) => {handleClick(e, props.id)}}>{props.buttonText}</button>
                        <Link to={{ pathname: '/user-courses/course-edit', state: state }} className={classes.editIcon}></Link>
                    </div>
                </div> 
        }
        {modal && <RatingList closeModal={handleModal} courseId={props.id} list={ratings}/>}
        </div>
    )
}

export default CourseCard;