import { useState, useEffect, useRef } from "react";
import classes from "./CourseEditlayout.module.css";
import axios from "axios";
import EditModal from "./EditModal";
import { useHistory } from "react-router-dom";
import JoditEditor from "jodit-react";

function CourseEditLayout(props) {

    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState();
    const [chapters, setChapters] = useState(["loading...", "loading.."]);
    const [title, setTitle] = useState("loading...");
    const [titleC, setTitleC] = useState("loading...");
    const [modalOpen, setModalOpen] = useState(false);
    const [chapterId, setChapterId] = useState();
    const [cocreators, setCoCreators] = useState([])
    const [reload, setReload] = useState()
    const [category, setCategory] = useState(0)
    const [subcategory, setSubCategory] = useState(0)

    const editor = useRef(null)
	const [editContent, setEditContent] = useState('')
	const config = {
		readonly: false,
        width: '60.9rem'
	}

    useEffect(() => {
        const url = 'http://127.0.0.1:8000/api/v1/courses/course/' + props.Id + '/chapters'
        const url2 = 'http://127.0.0.1:8000/api/v1/courses/all_courses/' + props.Id
        axios.get(url, {
          auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
            }
        })
        .then(res => {
            setContent(res.data[0].content);
            setChapters(res.data);
            setTitle(res.data[0].title);
            setChapterId(res.data[0].id)
            //console.log("edit info: ", res.data)
            axios.get(url2, {
                auth: {
                  username: localStorage.getItem('username'),
                  email: localStorage.getItem('email'),
                  password: localStorage.getItem('password')
                  }
              })
              .then(res1 => {
                  setTitleC(res1.data.title);
                  setCoCreators(res1.data.co_creators)
                  setSubCategory(res1.data.category)
                  setCategory(res1.data.main_category)
                  console.log("title: ", props.Title)
                  setLoading(false);
              })
        })
    }, [loading])

    function handleClick(e, index) {
        e.preventDefault();
        //setcurrentPressedChapterId(index);
        setContent(chapters[index].content);
        setTitle(chapters[index].title)
        setChapterId(chapters[index].id)
    }

    function handleChange(e) {
        //e.preventDefault();
        setContent(e);
        //axios.put()
    }

    function editModalClick(e) {
        e.preventDefault();
        setModalOpen(true);
    }

    function closeModal(e) {
        e.preventDefault()
        setModalOpen(false);
        //setReload("reload")
        //history.push("/user-courses/course-edit")
    }

    const url = "http://127.0.0.1:8000/api/v1/courses/course/" + props.Id + "/chapters/" + chapterId

    function handleConfirm(e) {
        e.preventDefault();
        axios.put(url, {
                content: editContent,
                course: props.Id
            }, {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
            }});
    }

    function detectChanges(e) {
        console.log("change detected edit: ", e)
        //setReload(e)
        setLoading(true)
    }

    //console.log("chapters: ", chapters)

    return (
        <div>
            <div className={classes.mainContainer}>
                <div className={classes.leftPanel}>
                    <div className={classes.verticalSeparator}></div>
                    <div className={classes.chaptersContainer}>
                        <label className={classes.chaptersLabel}>Chapters</label>
                        <hr className={classes.chaptersHr}></hr>
                        {
                            loading === true ?
                            <ul className={classes.chaptersList}>
                                <li>loading...</li>
                            </ul> :
                            <ul className={classes.chaptersList}>
                                {chapters.map((t, index) => 
                                <li key={index} onClick={(e) => {handleClick(e, index)}}>{t.title}</li>)}
                            </ul>
                        }
                    </div>
                </div>
                <div className={classes.middlePanel}>
                    <div className={classes.titlePanel}>
                        <div>
                            <label className={classes.chapterTitle}>{titleC}</label>
                            <label className={classes.chapterTitle2}>{title}</label>
                        </div>
                        <button className={classes.modalButton} onClick={(e) => {editModalClick(e)}}>Edit other elements</button>
                    </div>
                    <hr></hr>
                    <div className={classes.chapterContent}>
                        {
                            loading === true ?
                            <a>loading...</a> :
                            <div>
                                <form>
                                <JoditEditor
                                    ref={editor}
                                    value={content}
                                    config={config}
                                    tabIndex={1}
                                    onBlur={newContent => setEditContent(newContent)}
                                    onChange={newContent => {}}
                                />
                                    <button className={classes.confirmButton} onClick={(e) => {handleConfirm(e)}}>confirm</button>
                                </form>
                            </div>
                        }
                    </div>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.verticalSeparatorR}></div>
                </div>
            </div>
            { modalOpen && <EditModal close={(e) => {closeModal(e)}} id={props.Id} chId={chapterId} title={title}
            titleC={titleC} detect={detectChanges} cocreators={cocreators} category={category} subcategory={subcategory}/> }
        </div>
    );
}


// {this.state.chapters.map((t, index) => 
//     <li key={index} onClick={(e) => {this.handleClick(e, index)}}>{t.title}</li>)}

export default CourseEditLayout;