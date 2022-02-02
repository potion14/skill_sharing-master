import classes from './UserProfileLayout.module.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import UserCoursesList from './userCourses/UserCoursesList';

function UserProfileLayout() {

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cardId, setCardId] = useState(null);
    const [pressedSort, setPS] = useState('none');

    useEffect(() => {
        const url = 'http://127.0.0.1:8000/api/v1/courses/user_courses/' + localStorage.getItem('UserId');
        const token = localStorage.getItem('token');
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
        console.log("id: ", id)
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
                <div className={classes.userCreatedCourses}>
                    <h2>User Created Courses</h2>
                    <div className={classes.cList}>
                    <UserCoursesList courses={courses} IsLoading={isLoading} returnId={getId} pressedSort={pressedSort} buttonContent="usun" pressedFilter='none'/>
                    </div>
                </div>
            </div>
            <div className={classes.rightPanel}>
                <div className={classes.optionsContainer}>
                    some options
                </div>
            </div>
        </div>
    )
}

export default UserProfileLayout;