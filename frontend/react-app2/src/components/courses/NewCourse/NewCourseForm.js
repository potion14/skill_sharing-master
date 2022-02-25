import { useRef, useState } from "react";
import axios from "axios";
import CoCreatorsCombo from '../comboboxes/CoCreatorsCombo';
import CategoriesCombo from './CategoriesCombo'
import JoditEditor from "jodit-react";

import classes from './NewCourseForm.module.css';
import Alert from "./Alert";
import CourseVisibilityCombo from "./CourseVisibilityCombo";

function NewCourseForm() {
    const courseTitleInputRef = useRef();
    const chapterTitleInputRef = useRef();
    const contentInputRef = useRef();
    const [titleSet, SetTitleSetState] = useState(false);
    const [currentCourseId, SetId] = useState();
    const [chapters, SetChapters] = useState({
        list: []
    });
    const [cocreators, setCo] = useState([]);
    const [category, setCategory] = useState(0);
    const [subcategory, setSubcategory] = useState(0);
    const [walidator, setWalidator] = useState(false);
    const [visibilityOption, setVisibilityOption] = useState({id: 1, name: 'Everyone'})

    const editor = useRef(null)
	const [content, setContent] = useState('')
	const config = {
		readonly: false,
        width: '60.9rem'
	}

    async function submitHandler(event) {
        event.preventDefault();
        if (titleSet === false) {
            if (category === 0 || subcategory === 0 || visibilityOption ===0) {
                setWalidator(true)
            } else {
            setWalidator(false)
            const enteredTitle = courseTitleInputRef.current.value;

            const newCourse = {
                title: enteredTitle,
            };

            await axios.post('http://127.0.0.1:8000/api/v1/courses/all_courses', {
                title: newCourse.title,
                category: subcategory,
                created_at: getCurrentDate(),
                creator: {
                    id: localStorage.getItem("UserId"),
                    email: localStorage.getItem("email"),
                    date_joined: localStorage.getItem("JoinDate"),
                    points: localStorage.getItem("userPoints")
                },
                visibility: visibilityOption.id,
                visibility_name: visibilityOption.name,
                main_category: category
            }, {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
            }});

            await axios.get('http://127.0.0.1:8000/api/v1/courses/all_courses', {
                auth: {
                    username: localStorage.getItem('username'),
                    email: localStorage.getItem('email'),
                    password: localStorage.getItem('password')
                    }
                })
                .then(res => {
                    SetTitleSetState(true);
                    SetId(res.data.at(-1).id);
                })
            document.getElementById("form").reset();
            }
        } 
        else if (titleSet === true) {
            const enteredChapterTitle = chapterTitleInputRef.current.value;
            const enteredContent = content;
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
                SetChapters({
                    list: res.data
                });
            });
            document.getElementById("form").reset();
        }
    }

    function setCoCreators(array) {
        setCo(array);
    }

    function setCategories(cat, subcat) {
        setCategory(cat)
    }

    function setSubCategories(cat, subcat) {
        setSubcategory(subcat)
    }

    function setVisibility(option) {
        setVisibilityOption(option)
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
                    <CourseVisibilityCombo setOption={setVisibility} />
                    <CategoriesCombo getCategoriesData={setCategories} type='categories' category_selected='0'/>
                    {category !== 0 ? <CategoriesCombo getCategoriesData={setSubCategories} type='subcategories' category_selected={category}/> : null}
                    <div className={classes.actions}>
                        <button>Add Course</button>
                    </div>
                </form>
            </div>
        </div> :
        <div className={classes.middlePanel}>
        <h1>Add New Course Chapter</h1>
            <div className={classes.container}>
                <form className={classes.form} onSubmit={submitHandler} id="form">  
                    <div className={classes.control}>
                        <label htmlFor='chapterTitle'>Chapter Title</label>
                        <input type='text' required id='chapterTitle' ref={chapterTitleInputRef} />
                    </div>
                    <div className={classes.control}>
                        <label htmlFor='content'>Content</label>
                        <JoditEditor
                            ref={editor}
                            value={content}
                            config={config}
                            tabIndex={1} 
                            onBlur={newContent => setContent(newContent)} 
                            onChange={newContent => {}}
                        />
                        <CoCreatorsCombo getData={setCoCreators} existingCoCreators={[]} courseID={currentCourseId}/>
                    </div>
                    <div className={classes.actions}>
                        <button>Add Chapter</button>
                    </div>
                </form>
            </div>
        </div>
        }
        <div className={classes.rightPanel}></div>
        {walidator && <Alert />}
    </div>
}

function getCurrentDate() {
    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    month < 10 ? month = '0' + month : month = month
    let year = newDate.getFullYear();
    let fullDate = date + '-' + month + '-' + year
    return fullDate
}

export default NewCourseForm;