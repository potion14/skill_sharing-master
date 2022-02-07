import classes from './CommentsLayout.module.css';
import NewComment from './NewComment';
import Comment from './Comment';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function CommentsLayout(props) {

    const [comments, setC] = useState([]);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState(props.chapterId);
    const [stop, setStop] = useState(false);
    const url = 'http://127.0.0.1:8000/api/v1/courses/course/chapter/' + props.chapterId + '/comments';
    
    //console.log("chapterId: ", props.chapterId)

    useEffect(() => {
        if (props.chapterId !== id) {
            setId(props.chapterId)
            setC([])
            setStop(false)
            const url = 'http://127.0.0.1:8000/api/v1/courses/course/chapter/' + id + '/comments';
        }
        if (comments.length === 0 && id !== null && stop === false) getData(id)
        console.log("ustawione w commentLayout id: ", id)
        console.log("comments: ", comments)
    }, [getData, id]) //problematic point (, [])

    function getData(id) {
        console.log(url)
        console.log("getData")
        axios.get(url, {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
            }}).then(res => {
                console.log("axios get")
                setC(res.data);
                setLoading(false);
                //setId(null)
                if (comments.length === 0 && id !== null) setStop(true)
                if (comments.length !== 0 && id !== null) setStop(true)
            })
    }

    return (
        <div>
            <div className={classes.mainWrapper}>
                <NewComment chapterId={props.chapterId}/>
            </div>
            <div>
            {
                loading === true ? <a>loading...</a> :
                comments.map(item => <Comment content={item.content} creator={item.author.email} responses={item.replies} chapterId={props.chapterId} commentId={item.id}/>)
            }
            </div>
        </div>
    )
}