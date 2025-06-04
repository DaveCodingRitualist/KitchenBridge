import './Navbar.css'
import React from 'react';
import { useAdminContext } from '../hooks/useAdminContext';

import logo from '../assets/kitchen-connect-logo.png'
import { Link } from 'react-router-dom'
const Navbar = () => {
  const { dispatch, admin } = useAdminContext()

  const handleOrders = () => {
    dispatch({type: 'SET_ADMIN', payload: false})
  }
  const handleAdmin = () => {
    dispatch({type: 'SET_ADMIN', payload: true})
  }
  return (
    <nav>
      <div className="log" >
        <Link to='/'><img className='logo' src={logo} alt='cause effect logo' /></Link>
      </div>
      <div className='nav-links'>
         <Link to="/oders" onClick={handleOrders} className='front'>Orders</Link>
         <Link to="/admin" onClick={handleAdmin} className='kitchen'>Kitchen Admin</Link>
      </div>
    </nav>
  );
}

export default Navbar;
