import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
// import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import Navbar from './component/Navbar';
import Orders from './pages/Orders';
import Admin from './pages/admin/Admin';
function App() {
  return (
    <div className="App">
     <Router>
        <Navbar/>
       <Routes>
          <Route
            path='/oders'
            element={<Orders/>}
          />
          <Route
            path='/'
            element={<Orders/>}
          />
          <Route
            path='/admin'
            element={<Admin/>}
          />
       </Routes>
     </Router>
    </div>
  );
}

export default App;
