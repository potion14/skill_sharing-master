import CourseEditLayout from "../components/layout/courseEdit/CourseEditLayout";
import { useLocation, useParams } from 'react-router-dom'

function EditCourse(props) {

    const location = useLocation()
    const Id = location.state.id

    //console.log("params: ", params.Id)
    //console.log("location: ", location)

    return (
        <div><CourseEditLayout Title={location.state.title} Id={Id} {...props}></CourseEditLayout></div>
    );
}

export default EditCourse;