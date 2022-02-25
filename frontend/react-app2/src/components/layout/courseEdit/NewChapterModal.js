import classes from "./CourseEditlayout.module.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import JoditEditor from "jodit-react";

export default function NewChapterModal(props) {

    const [title, setTitle] = useState()

    const editor = useRef(null)
	const [content, setEditContent] = useState('')
	const config = {
		readonly: false,
        width: '60.9rem'
	}

    const url = "http://127.0.0.1:8000/api/v1/courses/course/" + props.courseId + "/chapters"

    function onInputChange(e) {
        e.preventDefault();
        setTitle(e.target.value);
    }

    function handleConfirm(e) {
        e.preventDefault()
        axios.post(url, {
            title: title,
            content: content,
            course: props.courseId
        }, {
        auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
        }});
        props.add(content, title)
    }

    function handleCancel(e) {
        e.preventDefault()
        props.close()
    }

    return (
        <div className={classes.backdrop} >
            <div className={classes.modalNewChapter}>
                <h1>Create New Chapter</h1>
                <input placeholder="Chapter title" onChange={(e) => {onInputChange(e)}}></input>
                <div className={classes.chapterContent}>
                    <div>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            config={config}
                            tabIndex={1}
                            onBlur={newContent => setEditContent(newContent)}
                            onChange={newContent => {}}
                        />
                        <button className={classes.confirmButton} onClick={(e) => {handleConfirm(e)}}>confirm</button>
                        <button className={classes.confirmButton} onClick={(e) => {handleCancel(e)}}>cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}