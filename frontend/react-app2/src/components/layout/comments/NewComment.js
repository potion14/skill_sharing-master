import axios from 'axios';
import { useState } from 'react';
import classes from './CommentsLayout.module.css';

export default function NewComment(props) {
    const url = 'http://127.0.0.1:8000/api/v1/courses/course/chapter/' + props.chapterId + '/comments'
    const [commentContent, setCC] = useState("");

    //console.log("chapterId: ", props.chapterId);

    function handleChange(e) {
        e.preventDefault();
        setCC(e.target.value);
        console.log(commentContent)
    }

    function handleClick(e) {
        e.preventDefault();
        if (commentContent !== "") {
            axios.post(url, {
                chapter: props.chapterId,
                content: commentContent,
                author: localStorage.getItem("email")
            }, {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
            }})
        }
        setCC("")
    }

    return (
        <div className={classes.newCommentCard}>
            <textarea className={classes.commentTextarea} onChange={(e) => {handleChange(e)}}>
            </textarea>
            <button onClick={(e) => {handleClick(e)}}>Add Comment</button>
        </div>
    )
}