import axios from 'axios';
import { useEffect, useState } from 'react'
import classes from './AllCourses.module.css'

export default function SubcategoriesList(props) {

    const [subcategories, setsubCategories] = useState([]);

    function onClick(e, subcategory_id) {
        e.preventDefault();
        props.recieveSubId(subcategory_id)
    }

    useEffect(() => {
        const url = 'http://127.0.0.1:8000/api/v1/courses/subcategories';
        axios.get(url, {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
                }
            })
            .then(res => {
                setsubCategories(res.data)
            })
    }, [])

    return (
        <div>{subcategories.map((i, index) => <div key={index} onClick={(e) => {onClick(e, i.id)}}>{props.main_category_id === i.main_category ? i.name : null}</div>)}</div>
    )
}