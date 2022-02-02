import axios from 'axios';
import { useEffect, useState } from 'react'
import classes from './AllCourses.module.css'
import SubcategoriesList from './SubcategoriesList';

export default function CategoriesList(props) {

    const [categories, setCategories] = useState([]);
    const [pressedSub, setPressedSub] = useState(props.pressedFilter)

    useEffect(() => {
        const url = 'http://127.0.0.1:8000/api/v1/courses/main_categories';
        axios.get(url, {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
                }
            })
            .then(res => {
                setCategories(res.data)
            })
    }, [])

    return (
        <div>{categories.map((i, index) => <div key={index}>{i.name}<SubcategoriesList main_category_id={i.id} recieveSubId={setPressedSub}/></div>)}</div>
    )
}