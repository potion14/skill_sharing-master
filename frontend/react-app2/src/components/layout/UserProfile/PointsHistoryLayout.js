import axios from 'axios';
import { useEffect, useState } from 'react';
import classes from './UserProfileLayout.module.css';

export default function PointsHistoryLayout(props) {

    const [pointsHistory, setPointsHistory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const url = 'http://127.0.0.1:8000/api/v1/my_ratings/';
        const token = localStorage.getItem('token');
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
                loading === false ? <div>
                    {pointsHistory.map((i, index) => 
                    <div key={index}>{i}</div>)}
                </div> : <div>loading..</div>
            }
        </div>
    )
}