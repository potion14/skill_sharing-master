import axios from 'axios';
import { useEffect, useState } from 'react';
import classes from '../comboboxes/Combobox.module.css';

export default function CourseVisibilityCombo(props) {
    const [visibilityOptions, setVO] = useState([])
    const [selectedOption, setSelected] = useState('loading')

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/v1/courses/course-visibility', {
            auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
            }}).then(res => {
                setVO(res.data)
                setSelected(res.data[0])
            })
    }, [])

    function handleClick(e, item) {
        e.preventDefault();
        setSelected(item)
        props.setOption(item)
    }

    return (
        <div className={classes.visibilityDropdown}>
            <div className={classes.container}>
                    <div className={classes.accountButtonWrapper} data-dropdown>
                        <button className={classes.profileButton} data-dropdown-button type='button'>Course visibility: {selectedOption.name}</button>
                        <div className={classes.dropdownMenu}>
                            {
                                visibilityOptions.map((item, index) => <div key={index}
                                className={classes.visibilityLisetElement} onClick={(e) => {handleClick(e, item)}}>{item.name}</div>)
                            }
                        </div>
                    </div>
                </div>
        </div>
    )
}