import CoCreatorsCombo from "../../courses/comboboxes/CoCreatorsCombo";
import classes from "./CourseEditlayout.module.css";
import EditMiniForm from "./EditMiniForm";
import { useState, useEffect } from "react";
import axios from "axios";
import CategoriesCombo from '../../courses/NewCourse/CategoriesCombo'
import CourseVisibilityCombo from "../../courses/NewCourse/CourseVisibilityCombo";

export default function EditModal(props) {

    const [coCreators, setCoCreators] = useState([]);
    const [propsCoCre, setPropsCoCre] = useState(props.cocreators)
    const [category, setCategory] = useState(0);
    const [subcategory, setSubcategory] = useState(0);
    const [categoryName, setCategoryName] = useState('loading...');
    const [subcategoryName, setSubcategoryName] = useState('loading...');
    const url = 'http://127.0.0.1:8000/api/v1/courses/all_courses/' + props.id

    function handleClick(e) {
        e.preventDefault()
        props.close(e)
    }

    function recieveSelected(array) {
        setCoCreators(array);
    }

    function detectChange(e) {
        props.detect(e)
    }

    function setCategories(cat, subcat, catName, subcatName) {
        setCategory(cat)
    }

    function setSubCategories(cat, subcat, catName, subcatName) {
        setSubcategory(subcat)
    }

    function setVisibility(option) {
        const url = "http://127.0.0.1:8000/api/v1/courses/all_courses/" + props.id
        axios.put(url, {
            category: subcategory,
            visibility: option.id,
            visibility_name: option.name
        }, {
        auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
        }});
    }

    const url1 = 'http://127.0.0.1:8000/api/v1/courses/main_categories'
    const url2 = 'http://127.0.0.1:8000/api/v1/courses/subcategories'

    useEffect(() => {
        axios.get(url1, {
            auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
            }
        })
        .then(res => {
            axios.get(url2, {
                auth: {
                username: localStorage.getItem('username'),
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password')
                }
            })
            .then(res1 => {
                var index = res.data.findIndex(object => object.id === props.category)
                setCategoryName(res.data[index].name)
                var index1 = res1.data.findIndex(object => object.id === props.subcategory)
                setSubcategoryName(res1.data[index1].name)
            });
        });
    }, [])

    return (
        <div className={classes.backdrop} >
            <div className={classes.modalContainer}>
                <div>
                    {props.cocreator === false ? <EditMiniForm labelContent="Change course title:" id={props.id} inputContent={props.titleC}
                    inputType="courseTitle" change={detectChange}/> : null}
                    <EditMiniForm labelContent="Change current chapter title:" id={props.id} inputContent={props.title}
                    inputType="chapterTitle" chId={props.chId} change={detectChange}/>
                </div>
                <div className={classes.comboWrapper}>
                {props.cocreator === false ? <CourseVisibilityCombo setOption={setVisibility}/> : null}
                <CoCreatorsCombo getData={recieveSelected} existingCoCreators={propsCoCre} courseID={props.id}/>
                <CategoriesCombo getCategoriesData={setCategories} type='categories' category_selected='0'/>
                {category !== 0 ? <CategoriesCombo getCategoriesData={setSubCategories} type='subcategories' category_selected={category}/> : null}
                </div>
                <button onClick={(e) => {handleClick(e)}}>Back</button>
                <div className={classes.currentSelectedCategories}>
                    <span>Selected Main Category</span>
                    <a>{categoryName}</a>
                    <span>Selected Sub Category</span>
                    <a>{subcategoryName}</a>
                </div>
            </div>
        </div>
    )
}