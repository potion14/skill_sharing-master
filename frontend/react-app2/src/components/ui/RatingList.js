import { useEffect, useState } from 'react';
import classes from './CourseCard.module.css'

export default function RatingList(props) {

    const [loading, setLoading] = useState(true)

    function handleClick(e) {
        e.preventDefault();
        props.closeModal()
    }

    useEffect(() => {
        console.log("lista ocen: ", props.list)
    })

    return <div className={classes.backdrop}>
        <div className={classes.modalContainer}>
            <div className={classes.RatingList}>
            {props.list.map((i, index) => <div className={classes.ratingListElement} key={index}>
                <div><a>{i.author.email}</a><a>{i.created_at}</a></div>
                <hr></hr>
                <div>
                <a>{i.content}</a>
                <a>{i.rating}</a></div>
                </div>)}
            </div>
            <button onClick={(e) => {handleClick(e)}}>back</button>
        </div>
    </div>
}