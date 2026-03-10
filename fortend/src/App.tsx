import { Toaster } from 'react-hot-toast'
import { Route, BrowserRouter as Router, Routes } from 'react-router'
import './App.css'
import DashboardLayout from './layouts/dashboard.layout'
import StudentDashboardLayout from './layouts/student.dashboard.layout'
import TeacherDashboardLayout from './layouts/teacher.dashboard.layout'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'
import AdminDashboard from './pages/dashboard/admin-dashboard'
import StudentDashboard from './pages/dashboard/student.dashboard'

import ChangePasswordPage from './pages/changePassword/changePasswordPage'

import StudentPage from './pages/student'
import CreateStudent from './pages/student/add.student'
import StudentView from './pages/student/StudentView'
import UpdateStudent from './pages/student/update.student'

import TeacherPage from './pages/teacher'
import CreateTeacher from './pages/teacher/add.teacher'
import TeacherView from './pages/teacher/TeacherView'
import UpdateTeacher from './pages/teacher/update.teacher'

import CoursePage from './pages/course'
import CreateCourse from './pages/course/add.course'
import UpdateCourse from './pages/course/update.course'

import ClassPage from './pages/cclass'
import CreateClass from './pages/cclass/add.class'
import UpdateClass from './pages/cclass/update.class'

import AutoAttendance from './pages/attendance/AutoAttendance'
// import AttendancePage from './pages/attendance'
// import CreateAttendance from './pages/attendance/add.attendance'
// import UpdateAttendance from './pages/attendance/update.attendance'

import ProfilePage from './pages/profilepage'

import TeacherDashboard from './pages/dashboard/teacher.dashboard'
import PageNotFound from './pages/page-not.found'

function App() {

  return (
    <main className='h-full tracking-wider'>

      <Router>
        <Routes>

          <Route path = '/login' element = { <Login /> }/>
          <Route path = '/signup' element = { <Signup /> }/>


          


           <Route path='/' element= { <StudentDashboardLayout /> }>
            <Route path = '/dashboard/student' element = { <StudentDashboard /> }/>
            <Route path='/student-change-password' element= { <ChangePasswordPage /> }/>
            {/* <Route path = '/profile' element = { <ProfilePage /> }/> */}

            <Route path = '*' element = { <PageNotFound /> }/>
          </Route>

          <Route path='/' element= { <TeacherDashboardLayout /> }>
            <Route path = '/dashboard/teacher' element = { <TeacherDashboard /> }/>
            <Route path='/teacher-change-password' element= { <ChangePasswordPage /> }/>
              <Route path='/student' element= { <StudentPage /> }/>
            <Route path='/student/add' element= { <CreateStudent /> }/>
            <Route path='/student/edit/:id' element= { <UpdateStudent /> }/>
            <Route path='/student/view/:id' element={<StudentView />} />

            <Route path = '/profile' element = { <ProfilePage /> }/>
            <Route path='/attendance' element= { <AutoAttendance /> }/>

            <Route path = '*' element = { <PageNotFound /> }/>
          </Route>

          <Route path='/' element= { <DashboardLayout /> }>
            <Route path = '/dashboard/admin' element = { <AdminDashboard /> }/>
            <Route path='/change-password' element= { <ChangePasswordPage /> }/>

            {/* Student */}
            <Route path='/student' element= { <StudentPage /> }/>
            <Route path='/student/add' element= { <CreateStudent /> }/>
            <Route path='/student/edit/:id' element= { <UpdateStudent /> }/>
            <Route path='/student/view/:id' element={<StudentView />} />

            {/* Teacher */}
            <Route path='/teacher' element= { <TeacherPage /> }/>
            <Route path='/teacher/add' element= { <CreateTeacher /> }/>
            <Route path='/teacher/edit/:id' element= { <UpdateTeacher /> }/>
            <Route path='/teacher/view/:id' element={<TeacherView />} />

            {/* Course */}
            <Route path='/course' element= { <CoursePage /> }/>
            <Route path='/course/add' element= { <CreateCourse /> }/>
            <Route path='/course/edit/:id' element= { <UpdateCourse /> }/>

            {/* Class */}
            <Route path='/class' element= { <ClassPage /> }/>
            <Route path='/class/add' element= { <CreateClass /> }/>
            <Route path='/class/edit/:id' element= { <UpdateClass /> }/>

            {/* Attendance */}
            <Route path='/attendance' element= { <AutoAttendance /> }/>
            {/* <Route path='/attendance' element= { <AttendancePage /> }/> */}
            {/* <Route path='/attendance/add' element= { <CreateAttendance /> }/> */}
            {/* <Route path='/attendance/edit/:id' element= { <UpdateAttendance /> }/> */}

            <Route path = '/profile' element = { <ProfilePage /> }/>

            <Route path = '*' element = { <PageNotFound /> }/>
          </Route>
          

          

        </Routes>
      </Router>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />

    </main>
  )
}

export default App
