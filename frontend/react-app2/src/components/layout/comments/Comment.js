import axios from 'axios';
import { useEffect, useState } from 'react';
import classes from './CommentsLayout.module.css';

export default function Comment(props) {

    const [responses, setResponses] = useState(props.responses)
    const [reply, setReply] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(false)
    })

    const url = 'http://127.0.0.1:8000/api/v1/courses/course/chapter/' + props.chapterId + '/comments'

    function handleReply(e) {
        e.preventDefault();
        if (reply !== "") {
            axios.post(url, {
                chapter: props.chapterId,
                content: reply,
                author: {
                    id: localStorage.getItem("UserId"),
                    email: localStorage.getItem("email")
                },
                reply_to: props.commentId
            }, {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
            }})
            setResponses(prevState => [...prevState, {
                chapter: props.chapterId,
                content: reply,
                author: {
                    id: localStorage.getItem("UserId"),
                    email: localStorage.getItem("email")
                },
                reply_to: props.commentId
            }])
            setLoading(true)
        }
    }

    function handleInputChange(e) {
        e.preventDefault();
        setReply(e.target.value)
    }

    return (
        <div className={classes.mainWrapper}>
            <div className={classes.newCommentCard}>
                <a className={classes.email}>{props.creator}</a>
                <hr className={classes.commentHr}></hr>
                <div className={classes.commentContent}>
                    {props.content}
                </div>
                <button onClick={(e) => {handleReply(e)}}>reply</button>
                <input onChange={(e) => {handleInputChange(e)}}></input>
                <div>
                    {loading === false ? responses?.map((item, index) => <div key={index} className={classes.responseContainer}>
                        <a className={classes.email}>{item.author.email}</a>
                        <hr className={classes.commentHr}></hr>
                        <a className={classes.reply}>{item.content}</a></div>) : <a>loading...</a>}
                </div>
            </div>
        </div>
    )
}