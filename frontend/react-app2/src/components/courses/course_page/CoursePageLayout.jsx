import classes from "./CoursePageLayout.module.css";
import { Component } from 'react';
import axios from "axios";
import CommentsLayout from "../../layout/comments/CommentsLayout";
import Raiting from "./Raiting";
import { Link, useLocation, useParams } from 'react-router-dom'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

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
            rating: 0,
            ratingTekst: "",
            course: [],
            creator: "loading",
            creatorId: null
        }
        //console.log("CoursePageLayout pressedCourseID: ", this.state.pressedCourseId)
        this.handleClick = this.handleClick.bind(this);
        //this.handleRating = this.handleRating.bind(this);
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
        axios.get('http://127.0.0.1:8000/api/v1/courses/all_courses/' + this.state.pressedCourseId, {
            auth: {
              username: localStorage.getItem('username'),
              email: localStorage.getItem('email'),
              password: localStorage.getItem('password')
              }
          })
          .then(res => {
          this.setState({
              course: res.data,
              creator: res.data.creator,
              creatorId: res.data.creator.id
          });
          //console.log("creator: ", this.state.creator)
          })
    }

    componentWillUnmount() {
        //console.log("parrent rating in cdm: ", this.state.rating);
        const url1 = 'http://127.0.0.1:8000/api/v1/courses/course/' + this.state.pressedCourseId + '/ratings/'
        if (this.state.rating > 0) axios.post(url1, {
            course: this.state.pressedCourseId,
            rating: this.state.rating,
            content: this.state.ratingTekst
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
            </div>
            <div className={classes.middlePanel}>
                <div className={classes.titles}>
                    <div>
                        <label className={classes.courseTitle}>{this.state.course.title}</label>
                        <Link to={{ pathname: '/user', state: this.state }} className={classes.creator}>{this.state.creator.email}</Link>
                    </div>
                    <label className={classes.chapterTitle}>{this.state.title}</label>
                </div>
                <hr></hr>
                <div className={classes.chapterContent}>
                    {ReactHtmlParser(this.state.currentContent)}
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