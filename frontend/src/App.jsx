import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
// import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import Navbar from './component/Navbar';
import Orders from './pages/Orders';
import Admin from './pages/admin/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useAuthContext } from './hooks/useAuthContext';
function App() {
  const { user } = useAuthContext()
  return (
    <div className="App">
     <Router>
        {user && <Navbar/>}
       <Routes>
          <Route
            path='/oders'
            element={user ? <Orders/> : <Navigate to='/login' />}
          />
          <Route
            path='/'
            element={user ? <Orders/> : <Navigate to='/login' />}
          />
          <Route
            path='/admin'
            element={user ? <Admin/> : <Navigate to='/login' />}
          />
          <Route
            path='/login'
            element={!user ? <Login/> : <Navigate to='/' />}
          />
          <Route
            path='/signup'
            element={!user ? <Signup/> : <Navigate to='/' />}
          />
          <Route
            path='*'
            element={!user ? <Login/> : <Navigate to='/' />}
          />
       </Routes>
     </Router>
    </div>
  );
}


export default App;
