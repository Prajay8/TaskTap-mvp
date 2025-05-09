import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import PostTask from './pages/PostTask';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import MyTasks from './pages/MyTasks';

function App() {
  return (
    <Router>
      <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route
            path="/my-tasks" element={
              <PrivateRoute>
                <MyTasks />
              </PrivateRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/post-task" element={
              <PrivateRoute>
                <PostTask />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
    </Router>
  );
}

export default App;
