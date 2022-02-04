import classes from './DeleteModal.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Raiting from '../../courses/course_page/Raiting';
import { useHistory } from 'react-router-dom';

export default function SignUpModal(props) {

    const [rating, setRating] = useState(0);
    const [ratingTekst, setRatingTekst] = useState("");

    const history = useHistory();

    function handleClick(e) {
        e.preventDefault();
        props.closeModal(props.cardId, '')
    }

    function handleConfirmation(e) {
        e.preventDefault();
        const url = 'http://127.0.0.1:8000/api/v1/courses/all_courses/' + props.cardId;
        axios.delete(url, {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
            }
        })
        props.closeModal(props.cardId, 'confirm')
    }

    function handleRating(r, rt) {
        setRating(r);
        setRatingTekst(rt)
    }

    function handleSignOut(e) {
        e.preventDefault();
        if (rating === 0 || ratingTekst === "") {
            console.log("error: ", rating, " ", ratingTekst)
        } else {
            const url = 'http://127.0.0.1:8000/api/v1/courses/course/' + props.cardId + '/ratings/'
            axios.post(url, {
                course: props.cardId,
                rating: rating,
                content: ratingTekst
            }, {
                auth: {
                    username: localStorage.getItem('username'),
                    email: localStorage.getItem('email'),
                    password: localStorage.getItem('password')
                }
            })
            props.closeModal(props.cardId, '')
            history.push("/");
        }
    }

    return (
        <div className={classes.backdrop}>
        {
            props.type === 'userProfile' ?
            <div className={classes.modalContainer}>
                <span>Are you sure?</span>
                <button onClick={(e) => {handleConfirmation(e)}}>yes</button>
                <button onClick={(e) => {handleClick(e)}}>back</button>
            </div> : 
            <div className={classes.modalContainer}>
                <span>Leave your feedback before you sign out!</span>
                <Raiting getRating={handleRating}/>
                <button onClick={(e) => {handleSignOut(e)}}>yes</button>
                <button onClick={(e) => {handleClick(e)}}>back</button>
            </div>
        }
        </div>
    )
}