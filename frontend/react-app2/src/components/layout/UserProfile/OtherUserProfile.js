import classes from './UserProfileLayout.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserCoursesList from '../userCourses/UserCoursesList';
import DeleteModal from '../userCourses/DeleteModal';
import PointsHistoryLayout from './PointsHistoryLayout';
import { useLocation } from 'react-router-dom';
import FollowListBar from './FollowListBar';

function OtherUserProfileLayout(props) {

    const location = useLocation();

    const [courses, setCourses] = useState([]);
    const [user, setUser] = useState('loading')
    const [isLoading, setIsLoading] = useState(true);
    const [cardId, setCardId] = useState(null);
    const [pressedSort, setPS] = useState('none');
    const [modal, setModal] = useState(false);
    const [refresh, setRefresh] = useState();
    const [isFollowed, setIsFollowed] = useState("");
    const follow = "Follow";
    const unfollow = "Unfollow";
    const [followers, setFollowers] = useState([]);
    const [following_users, setFollowingUsers] = useState([]);
    const [currentDisplay, setCurrentDisplay] = useState("courses");

    useEffect(() => {
        const url = 'http://127.0.0.1:8000/api/v1/courses/user_courses/' + location.state.creatorId;
        axios.get(url, {
        auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
            }
        })
        .then(res => {
            setCourses(res.data)
            //setIsLoading(false)
        })
        const token = localStorage.getItem('token');
        axios.get('http://127.0.0.1:8000/api/v1/users/' + location.state.creatorId, {
        auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
            }
        })
        .then(res => {
            setUser(res.data)
            setIsLoading(false)
        })

        axios.get('http://127.0.0.1:8000/api/v1/user-follower-info/follower/' + localStorage.getItem("UserId") + '/followed_user/' + location.state.creatorId + '/', {
        auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
            }
        })
        .then(res => {
            res.data.follower_id !== "" ? setIsFollowed(res.data.follower_id) : setIsFollowed("")
            console.log("is followed?: ", isFollowed)
        })
        
    }, [isFollowed])

    function getId(id) {
        setCardId(id)
        setModal(true)
        //console.log("id: ", id)
    }

    function handleFollow(e) {
        e.preventDefault()
        //console.log("me: ", localStorage.getItem("UserId"), " person which i want to follow: ", location.state.creatorId)
        if (isFollowed === "") {axios.post('http://127.0.0.1:8000/api/v1/new_follower/', {
            user: location.state.creatorId,
            follower: localStorage.getItem("UserId")
        }, {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
                }
        })
        .then(res => {
            setUser(res.data)
            setIsLoading(false)
        })} else if (isFollowed !== "") {
            axios.delete('http://127.0.0.1:8000/api/v1/delete-follower/' + isFollowed + '/', {
                auth: {
                    username: localStorage.getItem('username'),
                    email: localStorage.getItem('email'),
                    password: localStorage.getItem('password')
                    }
            })
            setIsFollowed("")
        }
    }

    function handleFollowersList(list) {
        setFollowers(list);
        setCurrentDisplay("followers")
    }

    function handleFollowingUsers(list) {
        setFollowingUsers(list);
        setCurrentDisplay("following_users")
    }

    function handleCoursesClick(signal) {
        setCurrentDisplay("courses")
    }

    return (
        <div className={classes.UserProfileWrapper}>
            <div className={classes.leftPanel}>
            </div>
            <div className={classes.centerPanel}>
                <div className={classes.userPanelHead}>
                    <div className={classes.profilePicture}></div>
                    <div className={classes.infoContainer}>
                        <h2>{user.email}</h2>
                        <div className={classes.otherInfo}>
                            <h2>Email: {user.email}</h2>
                            <h2>Joined: {user.date_joined}</h2>
                        </div>
                    </div>
                    <div className={classes.pointsInfoC}>
                        <h2>Points:</h2>
                        <div className={classes.pointsInfo}>
                            <h2>{user.points}</h2>
                        </div>
                    </div>
                </div>
                <FollowListBar userId={location.state.creatorId} coursesAmount={courses.length}
                    getFollowers={handleFollowersList} getFollowingUsers={handleFollowingUsers} getCourses={handleCoursesClick}/>
                <div className={classes.userCreatedCourses}>
                    <h2>User Created Courses</h2>
                    <div className={classes.cList}>
                        {
                            currentDisplay === "courses" ? <UserCoursesList courses={courses} IsLoading={isLoading} returnId={getId}
                            pressedSort={pressedSort} buttonContent="usuń" pressedFilter='none' page='OtherUserPage'/> : 
                            currentDisplay === "followers" ? <div>{followers.map((e, index) => <div key={index} className={classes.listItem}>
                                <a>Email: {e.email}</a><a>Username: {e.username}</a><a>Points: {e.points}</a></div>)}</div> :
                            <div>{following_users.map((e, index) => <div key={index} className={classes.listItem}>
                                <a>Email: {e.email}</a><a>Username: {e.username}</a><a>Points: {e.points}</a></div>)}</div>
                        }
                    
                    </div>
                </div>
            </div>
            <div className={classes.rightPanel}>
                <div className={classes.optionsContainer}>
                    <h2>Options:</h2>
                    <button onClick={(e) => {handleFollow(e)}}>{isFollowed === "" ? follow : unfollow}</button>
                </div>
            </div>
        </div>
    )
}

export default OtherUserProfileLayout;