import classes from "./CourseEditlayout.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

export default function EditMiniForm(props) {

    const [content, setContent] = useState(props.inputContent)
    const [id, setId] = useState()

    function handleChange(e) {
        e.preventDefault();
        setContent(e.target.value);
    }

    useEffect(() => {
        setId(props.id)
    }, [])

    const url = 'http://127.0.0.1:8000/api/v1/courses/all_courses/' + props.id
    const url2 = "http://127.0.0.1:8000/api/v1/courses/course/" + props.id + "/chapters/" + props.chId


    function handleClick(e) {
        e.preventDefault();
        props.inputType === "courseTitle" ?
        axios.put(url, {
                title: content,
                category: 1
            }, {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
            }})
        :
        axios.put(url2, {
            title: content,
            course: props.id
        }, {
        auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
        }})
        props.change(Math.random())
    }

    return (
        <div className={classes.miniFormWrapper}>
                <div className={classes.subWrapper}>
                    <label>{props.labelContent}</label>
                    <input value={content} onChange={(e) => {handleChange(e)}}></input>
                </div>
                <button onClick={(e) => {handleClick(e)}}>change</button>
        </div>
    )
}