import CoursePageLayout from "../components/courses/course_page/CoursePageLayout";
import { useLocation, useParams } from 'react-router-dom'

function Course(props) {

    const location = useLocation()
    const Id = location.state.id

    return (
        <div><CoursePageLayout courseId={Id} {...props}/></div>
    );
}

export default Course;