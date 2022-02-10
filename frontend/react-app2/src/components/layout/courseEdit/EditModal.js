import CoCreatorsCombo from "../../courses/comboboxes/CoCreatorsCombo";
import classes from "./CourseEditlayout.module.css";
import EditMiniForm from "./EditMiniForm";
import { useState } from "react";
import axios from "axios";
import CategoriesCombo from '../../courses/NewCourse/CategoriesCombo'

export default function EditModal(props) {

    const [coCreators, setCoCreators] = useState([]);
    const [propsCoCre, setPropsCoCre] = useState(props.cocreators)
    const [category, setCategory] = useState(0);
    const [subcategory, setSubcategory] = useState(0);
    const url = 'http://127.0.0.1:8000/api/v1/courses/all_courses/' + props.id

    function handleClick(e) {
        e.preventDefault()
        props.close(e)
    }

    console.log("coCreators: ", propsCoCre)

    function recieveSelected(array) {
        setCoCreators(array);
        // axios.put(url, {
        //     category: 1
        // }, {
        // auth: {
        //     username: localStorage.getItem('username'),
        //     email: localStorage.getItem('email'),
        //     password: localStorage.getItem('password')
        // }});
        // if (coCreators !== []){propsCoCre.forEach(element => {
        //     const url1 = 'http://127.0.0.1:8000/api/v1/delete-co-creator/' + element.id
        //     axios.delete(url1, {
        //         auth: {
        //             username: localStorage.getItem('username'),
        //             email: localStorage.getItem('email'),
        //             password: localStorage.getItem('password')
        //         }
        //     })
        // });}
        // coCreators.forEach(element => {
        //     axios.post('http://127.0.0.1:8000/api/v1/new_course_co_creator/', {
        //                     course: props.id,
        //                     co_creator: element.id,
        //                     is_active: true
        //                 }, {
        //                 auth: {
        //                     username: localStorage.getItem('username'),
        //                     email: localStorage.getItem('email'),
        //                     password: localStorage.getItem('password')
        //                 }});
        // });
    }

    function detectChange(e) {
        console.log("change detected editmodal: ", e)
        props.detect(e)
    }

    function setCategories(cat, subcat) {
        setCategory(cat)
    }

    function setSubCategories(cat, subcat) {
        setSubcategory(subcat)
    }

    return (
        <div className={classes.backdrop} >
            <div className={classes.modalContainer}>
                <div>
                    <EditMiniForm labelContent="Change course title:" id={props.id} inputContent={props.titleC}
                    inputType="courseTitle" change={detectChange}/>
                    <EditMiniForm labelContent="Change current chapter title:" id={props.id} inputContent={props.title}
                    inputType="chapterTitle" chId={props.chId} change={detectChange}/>
                </div>
                <div className={classes.comboWrapper}>
                <CoCreatorsCombo getData={recieveSelected} existingCoCreators={propsCoCre} courseID={props.id}/>
                <CategoriesCombo getCategoriesData={setCategories} type='categories' category_selected='0'/>
                {category !== 0 ? <CategoriesCombo getCategoriesData={setSubCategories} type='subcategories' category_selected={category}/> : null}
                </div>
                <button onClick={(e) => {handleClick(e)}}>Back</button>
            </div>
        </div>
    )
}