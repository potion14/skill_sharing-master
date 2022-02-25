import classes from './CourseCard.module.css';
import {Link} from 'react-router-dom'
import { useState, useEffect } from "react";
import StarBorder from "@material-ui/icons/StarBorder";
import Star from '@material-ui/icons/Star';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import RatingList from './RatingList';
import axios from 'axios';

function CourseCard (props) {

    const [modal, setModal] = useState(false);
    const [ratings, setRatings] = useState([])
    const [isCocreator, setIsCocreator] = useState(false)

    useEffect(() => {
        chceckIfCocreator()
    })

    async function chceckIfCocreator() {
        await props.courseCocreator.map(object => 
            object.email === localStorage.getItem('email') ? setIsCocreator(true) : null
        );
    }

    const [state, setState] = useState({
        id: props.id,
        title: props.title,
        sourcePage: null,
        creatorId: props.creatorId,
        cocreator: false
    })

    const [secondstate, setSecondState] = useState({
        id: props.id,
        title: props.title,
        sourcePage: null,
        creatorId: props.creatorId,
        cocreator: true
    })

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
    }, [])

    return (
        <div>
        {
            props.page === "AllCourses" || props.page === "HomePage" ?
            <div className={classes.singleCourseContainer}>
                <Link to={{ pathname: '/user', state: state }} className={classes.creator}><AccountBoxIcon className={classes.accountIcon} /></Link>
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
                <Link to={{ pathname: '/user', state: state }} className={classes.creator}><AccountBoxIcon className={classes.accountIcon} /></Link>
                <div className={classes.ratingDisplay} onClick={(e) => {handleRatingClick(e)}}>
                    <Star className={classes.star}/>
                    <span>{props.rating}</span>
                </div>
                <img src="" alt="" className={classes.courseImg} />
                <Link to={{ pathname: '/course', state: state }} className={classes.singleCourseTitle}>{props.title}</Link>
                <div className={classes.wrapper}>
                    <button className={classes.singleCourseButton} onClick={(e) => {handleClick(e, props.id)}}>{props.buttonText}</button>
                </div>
            </div> : props.page === "OtherUserProfile" ?
                <div>
                {
                    isCocreator ? 
                    <div className={classes.singleCourseContainer}>
                        <Link to={{ pathname: '/user', state: state }} className={classes.creator}><AccountBoxIcon className={classes.accountIcon} /></Link>
                        <div className={classes.ratingDisplay} onClick={(e) => {handleRatingClick(e)}}>
                            <Star className={classes.star}/>
                            <span>{props.rating}</span>
                        </div>
                        <img src="" alt="" className={classes.courseImg} />
                        <Link to={{ pathname: '/course', state: state }} className={classes.singleCourseTitle}>{props.title}</Link>
                        <div className={classes.wrapper}>
                            <Link to={{ pathname: '/user-courses/course-edit', state: secondstate }} className={classes.editIcon}></Link>
                        </div>
                    </div> : 
                    <div className={classes.singleCourseContainer}>
                        <Link to={{ pathname: '/user', state: state }} className={classes.creator}><AccountBoxIcon className={classes.accountIcon} /></Link>
                        <div className={classes.ratingDisplay} onClick={(e) => {handleRatingClick(e)}}>
                            <Star className={classes.star}/>
                            <span>{props.rating}</span>
                        </div>
                        <img src="" alt="" className={classes.courseImg} />
                        <a  className={classes.singleCourseTitle}>{props.title}</a>
                        <div className={classes.wrapper}>
                            <button className={classes.singleCourseButton} onClick={(e) => {handleClick(e, props.id)}}>{props.buttonText}</button>
                        </div>
                    </div>
                }
                </div> : props.page === "UserProfile" ?
                <div>
                {
                    isCocreator ? 
                    <div className={classes.singleCourseContainer}>
                        <Link to={{ pathname: '/user', state: state }} className={classes.creator}><AccountBoxIcon className={classes.accountIcon} /></Link>
                        <div className={classes.ratingDisplay} onClick={(e) => {handleRatingClick(e)}}>
                            <Star className={classes.star}/>
                            <span>{props.rating}</span>
                        </div>
                        <img src="" alt="" className={classes.courseImg} />
                        <Link to={{ pathname: '/course', state: state }} className={classes.singleCourseTitle}>{props.title}</Link>
                        <div className={classes.wrapper}>
                            <Link to={{ pathname: '/user-courses/course-edit', state: secondstate }} className={classes.editIcon}></Link>
                        </div>
                    </div> : 
                    <div className={classes.singleCourseContainer}>
                        <Link to={{ pathname: '/user', state: state }} className={classes.creator}><AccountBoxIcon className={classes.accountIcon} /></Link>
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
                </div> :
            <div className={classes.singleCourseContainer}>
                <Link to={{ pathname: '/user', state: state }} className={classes.creator}><AccountBoxIcon className={classes.accountIcon} /></Link>
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