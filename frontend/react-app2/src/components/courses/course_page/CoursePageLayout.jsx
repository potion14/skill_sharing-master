import classes from "./CoursePageLayout.module.css";
import { Component } from 'react';
import axios from "axios";
import CommentsLayout from "../../layout/comments/CommentsLayout";
import Raiting from "./Raiting";

class CoursePageLayout extends Component {

    constructor(props) {
        super(props)
        this.state = {
            chapters: [],
            currentContent: null,
            pressedId: null,
            title: null,
            pressedCourseId: props.courseId,
            chapterId: null,
            rating: 0
        }
        console.log("CoursePageLayout pressedCourseID: ", this.state.pressedCourseId)
        this.handleClick = this.handleClick.bind(this);
        this.handleRating = this.handleRating.bind(this);
    }

    handleClick(e, id) {
        e.preventDefault()
        this.setState({pressedId: id, currentContent: this.state.chapters[id].content, title: this.state.chapters[id].title, chapterId: this.state.chapters[id].id})
        console.log("chapter: ", this.state.chapterId)
        //this.setState({pressedId: id})
        //console.log("id: ", id)
        //console.log("content: ", this.state.chapters[2].content)
        //console.log("pressedId: ", this.state.pressedId)
    }

    componentDidMount() {
        const url = 'http://127.0.0.1:8000/api/v1/courses/course/' + this.state.pressedCourseId + '/chapters'
        axios.get(url, {
          auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
            }
        })
        .then(res => {
        this.setState({
            chapters: res.data,
            currentContent: res.data[0].content,
            //pressedId: 1,
            title: res.data[0].title,
            chapterId: res.data[0].id
        });
        //console.log("chaptery w kliknietym kursie: ", this.state.chapters)
        //console.log("chapter: ", this.state.chapterId)
        })
        //localStorage.removeItem("pressedCourseID");
    }

    componentWillUnmount() {
        //console.log("parrent rating in cdm: ", this.state.rating);
        const url1 = 'http://127.0.0.1:8000/api/v1/courses/course/' + this.state.pressedCourseId + '/ratings/'
        if (this.state.rating > 0) axios.post(url1, {
            course: this.state.pressedCourseId,
            rating: this.state.rating
        }, {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
            }
        }).catch(err => {
            //setAlert(true)
        })
    }

    handleRating(r) {
        //console.log("parrent rating: ", r);
        this.setState({rating: r});
    }

    render() {
        return (
        <div className={classes.mainContainer}>
            <div className={classes.leftPanel}>
                <div className={classes.verticalSeparator}></div>
                <div className={classes.chaptersContainer}>
                    <label className={classes.chaptersLabel}>Chapters</label>
                    <hr className={classes.chaptersHr}></hr>
                    <ul className={classes.chaptersList}>
                        {this.state.chapters.map((t, index) => 
                            <li key={index} onClick={(e) => {this.handleClick(e, index)}}>{t.title}</li>)}
                    </ul>
                </div>
                <Raiting getRating={this.handleRating} />
            </div>
            <div className={classes.middlePanel}>
                <label className={classes.chapterTitle}>{this.state.title}</label>
                <hr></hr>
                <div className={classes.chapterContent}>
                    {this.state.currentContent}
                </div>
                <CommentsLayout chapterId={this.state.chapterId} />
            </div>
            <div className={classes.rightPanel}>
                <div className={classes.verticalSeparatorR}></div>
            </div>
        </div>
        );
    }
}

export default CoursePageLayout;