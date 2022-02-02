import { useState, useEffect } from "react";
import classes from "./CourseEditlayout.module.css";
import axios from "axios";
import EditModal from "./EditModal";

function CourseEditLayout(props) {

    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState();
    const [chapters, setChapters] = useState(["loading...", "loading.."]);
    const [title, setTitle] = useState("loading...");
    const [titleC, setTitleC] = useState("loading...");
    const [modalOpen, setModalOpen] = useState(false);
    const [chapterId, setChapterId] = useState();
    
    //const [currentPressedChapterId, setcurrentPressedChapterId] = useState(0);

    useEffect(() => {
        const url = 'http://127.0.0.1:8000/api/v1/courses/course/' + props.Id + '/chapters'
        axios.get(url, {
          auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
            }
        })
        .then(res => {
            console.log("edit info: ", res.data)
            setContent(res.data[0].content);
            setChapters(res.data);
            setTitle(res.data[0].title);
            setTitleC(props.Title);
            setChapterId(res.data[0].id)
            console.log("chapters wewnatrz useEffect: ", chapters)
            //console.log("chaptery w kliknietym kursie: ", this.state.chapters)
        })
        setLoading(false);
    }, [])

    // console.log("CHAPTERS ", chapters)
    // console.log("CHAPTERid ", chapters[0].id)
    // console.log("CHAPTERidstate ", chapterId)

    function handleClick(e, index) {
        e.preventDefault();
        //setcurrentPressedChapterId(index);
        setContent(chapters[index].content);
        setTitle(chapters[index].title)
        setChapterId(chapters[index].id)
    }

    function handleChange(e) {
        e.preventDefault();
        setContent(e.target.value);
        //axios.put()
    }

    function editModalClick(e) {
        e.preventDefault();
        setModalOpen(true);
    }

    function closeModal(e) {
        e.preventDefault()
        setModalOpen(false);
    }

    const url = "http://127.0.0.1:8000/api/v1/courses/course/" + props.Id + "/chapters/" + chapterId

    function handleConfirm(e) {
        e.preventDefault();
        axios.put(url, {
                content: content,
                course: props.Id
            }, {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
            }});
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
                            <label className={classes.chapterTitle}>- {title}</label>
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
                                    <textarea value={content} className={classes.contentInput} onChange={(e) => handleChange(e)}></textarea>
                                    <button onClick={(e) => {handleConfirm(e)}}>potwierdz</button>
                                </form>
                            </div>
                        }
                    </div>
                </div>
                <div className={classes.rightPanel}>
                    <div className={classes.verticalSeparatorR}></div>
                </div>
            </div>
            { modalOpen && <EditModal close={(e) => {closeModal(e)}} id={props.Id} chId={chapterId} title={title} titleC={titleC}/> }
        </div>
    );
}


// {this.state.chapters.map((t, index) => 
//     <li key={index} onClick={(e) => {this.handleClick(e, index)}}>{t.title}</li>)}

export default CourseEditLayout;