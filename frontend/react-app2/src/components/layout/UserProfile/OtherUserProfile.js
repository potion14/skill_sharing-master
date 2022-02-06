import classes from './UserProfileLayout.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserCoursesList from '../userCourses/UserCoursesList';
import DeleteModal from '../userCourses/DeleteModal';
import PointsHistoryLayout from './PointsHistoryLayout';
import { useLocation } from 'react-router-dom';

function OtherUserProfileLayout(props) {

    const location = useLocation();

    const [courses, setCourses] = useState([]);
    const [user, setUser] = useState('loading')
    const [isLoading, setIsLoading] = useState(true);
    const [cardId, setCardId] = useState(null);
    const [pressedSort, setPS] = useState('none');
    const [modal, setModal] = useState(false);
    const [refresh, setRefresh] = useState();

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
    }, [])

    function getId(id) {
        setCardId(id)
        setModal(true)
        //console.log("id: ", id)
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
                <div className={classes.userCreatedCourses}>
                    <h2>User Created Courses</h2>
                    <div className={classes.cList}>
                    <UserCoursesList courses={courses} IsLoading={isLoading} returnId={getId}
                        pressedSort={pressedSort} buttonContent="zapisz" pressedFilter='none' page='OtherUserPage'/>
                    </div>
                </div>
            </div>
            <div className={classes.rightPanel}>
                <div className={classes.optionsContainer}>
                </div>
            </div>
        </div>
    )
}

export default OtherUserProfileLayout;