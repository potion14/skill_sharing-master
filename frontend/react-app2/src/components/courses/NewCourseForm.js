import { useRef, useState } from "react";
import axios from "axios";
import CoCreatorsCombo from './comboboxes/CoCreatorsCombo';

import classes from './NewCourseForm.module.css';



function NewCourseForm() {
    const courseTitleInputRef = useRef();
    const chapterTitleInputRef = useRef();
    const contentInputRef = useRef();
    const [titleSet, SetTitleSetState] = useState(false);
    const [currentCourseId, SetId] = useState();
    const [chapters, SetChapters] = useState({
        list: []
    });
    const [cocreators, setCo] = useState();

    async function submitHandler(event) {
        event.preventDefault();
        if (titleSet === false) {
            const enteredTitle = courseTitleInputRef.current.value;

            const newCourse = {
                title: enteredTitle,
            };

            await axios.post('http://127.0.0.1:8000/api/v1/courses/all_courses', {
                title: newCourse.title,
                category: 1,
                created_at: getCurrentDate(),
                creator: {
                    id: localStorage.getItem("UserId"),
                    email: localStorage.getItem("email"),
                    date_joined: localStorage.getItem("JoinDate"),
                    points: localStorage.getItem("userPoints")
                },
                co_creators: cocreators
            }, {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
            }});
            //console.log(newCourse);

            axios.get('http://127.0.0.1:8000/api/v1/courses/all_courses', {
                auth: {
                    username: localStorage.getItem('username'),
                    email: localStorage.getItem('email'),
                    password: localStorage.getItem('password')
                    }
                })
                .then(res => {
                    SetId(res.data.at(-1).id);
                    //console.log("aktualne id", res.data.at(-1).id)
                })

            document.getElementById("form").reset();
        } 
        else if (titleSet === true) {
            const enteredChapterTitle = chapterTitleInputRef.current.value;
            const enteredContent = contentInputRef.current.value;
            const chapterData = {
                chapterTitle: enteredChapterTitle,
                content: enteredContent,
            };
            const url = "http://127.0.0.1:8000/api/v1/courses/course/" + currentCourseId + "/chapters"
            await axios.post(url, {
                title: chapterData.chapterTitle,
                content: chapterData.content,
                course: currentCourseId
            }, {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
                }});

            await axios.get(url, {
                auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
                }
            })
            .then(res => {
                //console.log("res.data: ", res.data)
                SetChapters({
                    list: res.data
                });
            });
            
            //console.log("chapters: ", chapters.list);
            document.getElementById("form").reset();
        }
        SetTitleSetState(true);
    }

    function setCoCreators(array) {
        console.log("array na samej górze: ", array)
        setCo(array);
    }

    return <div className={classes.wrapper}>
        <div className={classes.leftPanel}>
            <div className={classes.chaptersContainer}>
                <label className={classes.chaptersLabel}>Chapters</label>
                <hr className={classes.chaptersHr}></hr>
                <ul className={classes.chaptersList}>
                    {
                        chapters.list.map((e, index) => <li key={index}>{e.title}</li>)
                    }
                </ul>
            </div>
        </div>
        {
        titleSet === false ?
        <div className={classes.middlePanel}>
            <h1>Add New Course</h1>
            <div className={classes.container}>
                <form className={classes.form} onSubmit={submitHandler} id="form">
                    <div className={classes.control}>
                        <label>Course Title</label>
                        <input type='text' required id='courseTitle' ref={courseTitleInputRef} />
                    </div>
                    <CoCreatorsCombo getData={setCoCreators} />
                    <div className={classes.actions}>
                        <button>Add Course</button>
                    </div>
                </form>
            </div>
        </div> :
        <div className={classes.middlePanel}>
        <h1>Add New Course</h1>
            <div className={classes.container}>
                <form className={classes.form} onSubmit={submitHandler} id="form">  
                    <div className={classes.control}>
                        <label htmlFor='chapterTitle'>Chapter Title</label>
                        <input type='text' required id='chapterTitle' ref={chapterTitleInputRef} />
                    </div>
                    <div className={classes.control}>
                        <label htmlFor='content'>Content</label>
                        <textarea id='content' required rows='3' ref={contentInputRef}></textarea>
                    </div>
                    <div className={classes.actions}>
                        <button>Add Chapter</button>
                    </div>
                </form>
            </div>
        </div>
        }
        <div className={classes.rightPanel}></div>
    </div>
}

function getCurrentDate() {
    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    month < 10 ? month = '0' + month : month = month
    let year = newDate.getFullYear();
    let fullDate = date + '-' + month + '-' + year
    console.log(fullDate);
    //localStorage.setItem("JoinDate", fullDate);
    return fullDate
}

export default NewCourseForm;