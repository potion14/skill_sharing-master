import classes from './AllCourses.module.css'
import UserCoursesList from '../userCourses/UserCoursesList'
import { useEffect, useState } from 'react'
import axios from 'axios'
import SignUpModal from './SignUpModal';
import CategoriesList from './CategoriesList';

export default function AllCourses(props) {

    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cardId, setCardId] = useState(null);   
    const [pressedSort, setPS] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [sortFilter, setSortFilter] = useState({
        sort: ['alphabetic', 'likes', 'date-created'],
        filters: ['all', 'categories']
    })
    const [pressedSorting, setPressedSort] = useState(null);
    const [pressedFiltering, setPressedFilter] = useState("all"); // none or category
    const [pressedFilteringId, setPressedFilterId] = useState(null); //subcategory id

    useEffect(() => {
        const url = 'http://127.0.0.1:8000/api/v1/courses/all_courses';
        axios.get(url, {
        auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
            }
        })
        .then(res => {
            console.log("kursy w allcourses: ", res.data)
            console.log("auth: ", localStorage.getItem('username'),
            localStorage.getItem('email'),
            localStorage.getItem('password'))
            setCourses(res.data)
            setIsLoading(false)
        })
    }, [])

    function getId(id) {
        setCardId(id)
        setModalOpen(true)
    }

    function onSortClick(e, value) {
        e.preventDefault()
        setPressedSort(value)
    }

    function onFilterClick(e, value) {
        e.preventDefault()
        setPressedFilter(value)
    }

    return (
    <div className={classes.userCoursesContainer}>
            <div className={classes.leftSide}>
                <div className={classes.filtersContainer}>
                    <span className={classes.filtersTitle}>Sort by</span>
                    <ul className={classes.filtersList}>
                        {
                          sortFilter.sort.map((i, index) => <li key={index} tabIndex={index} onClick={(e) => {onSortClick(e, i)}}>{i}</li>)
                        }
                    </ul>
                </div>
                <div className={classes.differentContainer}>
                    <span className={classes.filtersTitle}>Filter by</span>
                    <ul className={classes.filtersList}>
                        {
                          sortFilter.filters.map((i, index) => <li key={index} tabIndex={index} onClick={(e) => {onFilterClick(e, i)}}>{i}</li>)
                        }
                        <CategoriesList pressedFilter={setPressedFilterId} />
                    </ul>
                </div>
            </div>
            <div className={classes.middleContent}>
                <span className={classes.userCoursesText}>All Courses</span>
                <UserCoursesList courses={courses} IsLoading={isLoading} returnId={getId} pressedFilter={pressedFiltering} pressedFilterId={pressedFilteringId}
                pressedSort={pressedSorting} buttonContent="zapisz" page="AllCourses"/>
            </div>
            <div className={classes.rightSide}></div>
            { modalOpen && <SignUpModal closeModal={setModalOpen} courseId={cardId}/> }
        </div>
    )
}