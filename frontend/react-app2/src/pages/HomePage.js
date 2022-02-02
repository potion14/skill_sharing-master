import MeetupList from "../components/courses/MeetupList";
import Ad from "../components/layout/Ad";
import classes from "./HomePage.module.css"

const DUMMY_DATA = [
    {
      id: 'm1',
      title: 'SQL Course',
      image:
        'https://image.shutterstock.com/image-photo/php-programming-language-on-computer-600w-1915285948.jpg',
      address: 'Sample text',
      description:
        'Learn SQL to gain some experience and mental illness!',
    },
    {
      id: 'm2',
      title: 'React Course',
      image:
        'https://image.shutterstock.com/image-photo/php-programming-language-on-computer-600w-1915285948.jpg',
      address: 'Sample text',
      description:
        'sample data',
    },
    {
      id: 'm3',
      title: 'React Course',
      image:
        'https://image.shutterstock.com/image-photo/php-programming-language-on-computer-600w-1915285948.jpg',
      address: 'Sample text',
      description:
        'sample data again',
    },
    {
      id: 'm4',
      title: 'React Course',
      image:
        'https://image.shutterstock.com/image-photo/php-programming-language-on-computer-600w-1915285948.jpg',
      address: 'Sample text',
      description:
        'You get the point',
    },
  ];


function AllMeetupsPage() {
    return <div>
      <div><Ad /></div>
      <h1>Recently top rated courses</h1>
      <div className={classes.coursesListContainer}>
        <MeetupList courses={DUMMY_DATA} page="HomePage"/>
      </div>
      <hr className={classes.listHr}></hr>
      <h1>Recently added courses</h1>
      <div className={classes.coursesListContainer}><MeetupList courses={DUMMY_DATA} page="HomePage"/></div>
    </div>
}

export default AllMeetupsPage;