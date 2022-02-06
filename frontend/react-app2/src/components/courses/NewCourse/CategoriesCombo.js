import classes from '../comboboxes/Combobox.module.css';
import axios from "axios";
import { useRef, useEffect, useState } from "react";
import CategoriesDropdownListElement from './CategoriesDropdownListElement';
import CategoriesSideListElement from './CategoriesSideListElement';

export default function CategoriesCombo(props) {
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);
    const [selectedCategoryId, setCategoryId] = useState(0);
    const [selectedSubCategoryId, setSubCategoryId] = useState(0);
    const [loading, setLoading] = useState(false);

    const url = 'http://127.0.0.1:8000/api/v1/courses/main_categories'
    const url2 = 'http://127.0.0.1:8000/api/v1/courses/subcategories'

    useEffect(() => {
        axios.get(url, {
            auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
            }
        })
        .then(res => {
            //console.log("categories: ", res.data)
            setCategories(res.data)
            setLoading(false)
        });
        axios.get(url2, {
            auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
            }
        })
        .then(res => {
            //console.log("categories: ", res.data)
            setSubCategories(res.data)
            setLoading(false)
        });
    }, [])
    
    // function getSelectedElement(element, type) {
    //     if (type === 'categories') {
    //         setSelectedCategories(prevState => ([...prevState, element]))
    //         //setIds(prevState => ([...prevState, user.id]))
    //     } else {
    //         setSelectedSubCategories(prevState => ([...prevState, element]))
    //         //setIds(prevState => ([...prevState, user.id]))
    //     }
    // }

    function getSelectedElement(element, type) {
        if (type === 'categories') {
            setSelectedCategories([element])
            setCategoryId(element.id)
        } else {
            setSelectedSubCategories([element])
            setSubCategoryId(element.id)
        }
    }

    // function removeSelectedElement(element, type) {
    //     if (type === 'categories') {
    //         var array = [...selectedCategories]
    //     //var idsarray = [...selectedUsersIds]
    //     var index = array.findIndex(object => object.name === element.name)
    //     if (index !== -1) {
    //         array.splice(index, 1);
    //         setSelectedCategories(array)
    //         // idsarray.splice(index, 1);
    //         // setIds(idsarray)
    //       }
    //     } else {
    //         var array = [...selectedSubCategories]
    //         //var idsarray = [...selectedUsersIds]
    //         var index = array.findIndex(object => object.name === element.name)
    //         if (index !== -1) {
    //             array.splice(index, 1);
    //             setSelectedSubCategories(array)
    //             // idsarray.splice(index, 1);
    //             // setIds(idsarray)
    //         }
    //     }
    // }

    function removeSelectedElement(element, type) {
        if (type === 'categories') {
            setSelectedCategories([])
            setCategoryId(0)
        } else {
            setSelectedSubCategories([])
            setSubCategoryId(0)
        }
    }

    props.getCategoriesData(selectedCategoryId, selectedSubCategoryId);

    if (loading === true) return (<div className={classes.loadingContainer}>
            <div className={classes.loadingImage}/>
        </div>)
    if (loading === false)
    {
        return (
            <div className={classes.CoCreatorsContainer}>
                {props.type === 'categories' ? 
                <div>
                <div className={classes.container}>
                    <div className={classes.accountButtonWrapper} data-dropdown>
                        <button className={classes.profileButton} data-dropdown-button type='button'>Select Main Category</button>
                        <div className={classes.dropdownMenu}>
                            {
                                categories.map((e, index) => <CategoriesDropdownListElement getData={getSelectedElement}
                                key={index} category={e} id={index} type={props.type}></CategoriesDropdownListElement>)
                            }
                        </div>
                    </div>
                </div>
                <div className={classes.container2}>
                    {
                        selectedCategories.map((e, index) => <CategoriesSideListElement remove_data={removeSelectedElement}
                        sub={e} key={index} type={props.type}></CategoriesSideListElement>)
                    }
                </div></div> : 
                <div>
                <div className={classes.container}>
                    <div className={classes.accountButtonWrapper} data-dropdown>
                        <button className={classes.profileButton} data-dropdown-button type='button'>Select SubCategory</button>
                        <div className={classes.dropdownMenu}>
                            {
                                subcategories.map((e, index) => <CategoriesDropdownListElement getData={getSelectedElement}
                                key={index} category={e} id={index} type={props.type}></CategoriesDropdownListElement>)
                            }
                        </div>
                    </div>
                </div>
                <div className={classes.container2}>
                    {
                        selectedSubCategories.map((e, index) => <CategoriesSideListElement remove_data={removeSelectedElement}
                        sub={e} key={index} type={props.type}></CategoriesSideListElement>)
                    }
                </div></div>
                }
            </div>
        )
    }
}