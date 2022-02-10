import classes from './UserProfileLayout.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserCoursesList from '../userCourses/UserCoursesList';
import DeleteModal from '../userCourses/DeleteModal';
import PointsHistoryLayout from './PointsHistoryLayout';
import FollowListBar from './FollowListBar';

function UserProfileLayout() {

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cardId, setCardId] = useState(null);
    const [pressedSort, setPS] = useState('none');
    const [modal, setModal] = useState(false);
    const [refresh, setRefresh] = useState();
    const [followers, setFollowers] = useState([]);
    const [following_users, setFollowingUsers] = useState([]);
    const [currentDisplay, setCurrentDisplay] = useState("courses");

    useEffect(() => {
        const url = 'http://127.0.0.1:8000/api/v1/courses/user_courses/' + localStorage.getItem('UserId');
        axios.get(url, {
        auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
            }
        })
        .then(res => {
            setCourses(res.data)
            setIsLoading(false)
        })
    }, [])

    function getId(id) {
        setCardId(id)
        setModal(true)
        //console.log("id: ", id)
    }

    function onCloseModal(id, buttonType) {
        if (buttonType === 'confirm')
        {
            setModal(false)
            const array = [...courses]
            const index = array.findIndex(item => item.id === id)
            if (index !== -1) {
                array.splice(index, 1)
                setCourses(array)
            }
        } else setModal(false)
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
                        <h2>{localStorage.getItem("username")}</h2>
                        <div className={classes.otherInfo}>
                            <h2>Email: {localStorage.getItem("email")}</h2>
                            <h2>Joined: {localStorage.getItem("JoinDate")}</h2>
                        </div>
                    </div>
                    <div className={classes.pointsInfoC}>
                        <h2>Points:</h2>
                        <div className={classes.pointsInfo}>
                            <h2>{localStorage.getItem("userPoints")}</h2>
                        </div>
                    </div>
                </div>
                <FollowListBar userId={localStorage.getItem('UserId')} coursesAmount={courses.length}
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
                    <span className={classes.uphTitle}>User points history</span>
                    <hr/>
                    <PointsHistoryLayout />
                </div>
            </div>
            {modal && <DeleteModal type="userProfile" cardId={cardId} closeModal={onCloseModal}/>}
        </div>
    )
}

export default UserProfileLayout;