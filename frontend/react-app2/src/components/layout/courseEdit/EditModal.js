import CoCreatorsCombo from "../../courses/comboboxes/CoCreatorsCombo";
import classes from "./CourseEditlayout.module.css";
import EditMiniForm from "./EditMiniForm";
import { useState } from "react";
import axios from "axios";

export default function EditModal(props) {

    const [coCreators, setCoCreators] = useState();
    const url = 'http://127.0.0.1:8000/api/v1/courses/all_courses/' + props.id

    function handleClick(e) {
        e.preventDefault()
        props.close(e)
    }


    console.log("coCreators: ", coCreators)

    function recieveSelected(array) {
        setCoCreators(array);
        axios.put(url, {
            co_creators: coCreators,
            category: 1
        }, {
        auth: {
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            password: localStorage.getItem('password')
        }});
    }

    return (
        <div className={classes.backdrop} >
            <div className={classes.modalContainer}>
                <div>
                    <EditMiniForm labelContent="Change course title:" id={props.id} inputContent={props.titleC} inputType="courseTitle"/>
                    <EditMiniForm labelContent="Change current chapter title:" id={props.id} inputContent={props.title} inputType="chapterTitle" chId={props.chId}/>
                    <EditMiniForm labelContent="Change category: ?"/>
                    <ul>
                    </ul>
                    <a>tu będzie lista cocreatorsów aktualnych - lista</a>
                </div>
                <div className={classes.comboWrapper}>
                <CoCreatorsCombo getData={recieveSelected} />
                </div>
                <button onClick={(e) => {handleClick(e)}}>Back</button>
            </div>
        </div>
    )
}