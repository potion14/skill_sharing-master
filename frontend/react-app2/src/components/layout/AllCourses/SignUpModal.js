import classes from './AllCourses.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function SignUpModal(props) {
    
    const [points, setPoints] = useState(0)
    const [loading, setLoading] = useState(true)
    const [price, setPrice] = useState(1000)
    //const [alert, setAlert] = useState(false)

    function handleClick(e) {
        e.preventDefault();
        props.closeModal()
    }

    function handleConfirmation(e) {
        e.preventDefault();
        const url = 'http://127.0.0.1:8000/api/v1/new_course_participant/';
        axios.post(url, {
                participant: localStorage.getItem("UserId"),
                course: props.courseId
            }, {
                auth: {
                    username: localStorage.getItem('username'),
                    email: localStorage.getItem('email'),
                    password: localStorage.getItem('password')
                }
            }).catch(err => {
                //setAlert(true)
            })
            props.closeModal()
    }

    useEffect(() => {
        const url = 'http://127.0.0.1:8000/api/v1/my_points/';
        
        axios.get(url, {
        auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
            }
        })
        .then(res => {
            setPoints(res.data.user_points);
            console.log("user_points: ", res.data)
        })

        const url2 = 'http://127.0.0.1:8000/api/v1/courses/all_courses/' + props.courseId;
        axios.get(url2, {
        auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
            }
        })
        .then(res => {
            setPrice(res.data.price)
            console.log("caly kurs: ", res.data)
            setLoading(false)
        })
    }, [])

    return (
        <div className={classes.backdrop}>
            <div className={classes.modalContainer}>
                {
                    loading === true ? <div>loading ...</div> : <div>
                        {
                            price > points ? <a>not enough points</a> : <div className={classes.modal}>
                                <h3>Are you sure you want to participate in this course?</h3>
                                <a>Price: {price}</a>
                                <span>Points: {points}</span>
                                <button onClick={(e) => {handleConfirmation(e)}}>yes</button>
                                </div>
                        }
                    </div>
                }
                <button onClick={(e) => {handleClick(e)}}>back</button>
            </div>
        </div>
    )
}