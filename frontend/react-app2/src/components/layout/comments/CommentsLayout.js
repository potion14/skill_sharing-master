import classes from './CommentsLayout.module.css';
import NewComment from './NewComment';
import Comment from './Comment';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function CommentsLayout(props) {

    const [comments, setC] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = 'http://127.0.0.1:8000/api/v1/courses/course/chapter/' + props.chapterId + '/comments'

    useEffect(() => {
        axios.get(url, {
        auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
        }}).then(res => {
            setC(res.data)
            setLoading(false)
        });
    }, []) //problematic point (, [])

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