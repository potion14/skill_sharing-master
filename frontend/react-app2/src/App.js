import { Route, Switch } from 'react-router-dom';

import HomePage from './pages/HomePage';
import NewCoursePage from './pages/NewCourse';
import Favorites from './pages/Favorites';
import LoginRegister from './pages/LoginRegister';
import Layout from './components/layout/Layout';
import Course from './pages/Course';
import UserProfile from './pages/UserProfile';
import EditCourse from './pages/EditCourse';
import AllCoursesPage from './pages/AllCoursesPage';
import OtherUserProfile from './components/layout/UserProfile/OtherUserProfile'
import { connect } from 'react-redux';
import * as actions from './store/actions/auth';
import { Component } from 'react';

class App extends Component {

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    return <Layout {...this.props}>
    <Switch>
      <Route path='/' exact>
        <HomePage />
      </Route>
      <Route path='/all-courses'>
        <AllCoursesPage />
      </Route>
      <Route path='/new-course'>
        <NewCoursePage />
      </Route>
      <Route path='/user_courses'>
        <Favorites {...this.props}/>
      </Route>
      <Route path='/user-courses/course-edit'>
        <EditCourse />
      </Route>
      <Route path='/login-register'>
        <LoginRegister />
      </Route>
      <Route path='/course'>
        <Course />
      </Route>
      <Route path='/user-profile'>
        <UserProfile />
      </Route>
      <Route path='/user'>
        <OtherUserProfile />
      </Route>
    </Switch>
  </Layout>;
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);