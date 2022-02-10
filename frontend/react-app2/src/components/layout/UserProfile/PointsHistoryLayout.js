import axios from 'axios';
import { useEffect, useState } from 'react';
import classes from './UserProfileLayout.module.css';

export default function PointsHistoryLayout(props) {

    const [pointsHistory, setPointsHistory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const url = 'http://127.0.0.1:8000/api/v1/my_ratings/';
        axios.get(url, {
        auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
            }
        })
        .then(res => {
            setPointsHistory(res.data)
            //console.log("odpowiedź serwera: ", res.data)
            setLoading(false)
        })
    }, [])

    return(
        <div>
            {
                loading === false ? <div className={classes.history}>
                    {pointsHistory.map((i, index) => 
                    <div className={classes.historyCard} key={index}>
                        <span>{i.action}</span>
                        <a>{i.rating}</a>
                        <a>{i.created_at}</a>
                        <hr />
                    </div>)}
                </div> : <div>loading..</div>
            }
        </div>
    )
}