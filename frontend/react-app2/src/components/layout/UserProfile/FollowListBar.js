import axios from 'axios';
import { useEffect, useState } from 'react';
import classes from './UserProfileLayout.module.css';

export default function FollowListBar(props) {

    const [followers, setFollowers] = useState([]);
    const [following_users, setFollowingUsers] = useState([]);

    useEffect(() => {
        const url = 'http://127.0.0.1:8000/api/v1/user/' + props.userId + '/followers';
        const url2 = 'http://127.0.0.1:8000/api/v1/user/' + props.userId + '/following_users';
        axios.get(url, {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
                }
            })
            .then(res => {
                setFollowers(res.data)
                axios.get(url2, {
                    auth: {
                        username: localStorage.getItem('username'),
                        email: localStorage.getItem('email'),
                        password: localStorage.getItem('password')
                        }
                    })
                    .then(res1 => {
                        setFollowingUsers(res1.data)
                    })
            })
    }, [])

    function onCoursesClick(e) {
        e.preventDefault();
        props.getCourses()
    }

    function onFollowersClick(e) {
        e.preventDefault();
        props.getFollowers(followers)
    }

    function onFollowingUsersClick(e) {
        e.preventDefault();
        props.getFollowingUsers(following_users)
    }

    return (
        <div className={classes.FollowListBarContainer}>
            <div>
                <span onClick={(e) => {onCoursesClick(e)}}>Courses amount</span>
                <a>{props.coursesAmount}</a>
            </div>
            <div>
                <span onClick={(e) => {onFollowersClick(e)}}>Followers</span>
                <a>{followers.length}</a>
            </div>
            <div>
                <span onClick={(e) => {onFollowingUsersClick(e)}}>Following</span>
                <a>{following_users.length}</a>
            </div>
        </div>
    )
}