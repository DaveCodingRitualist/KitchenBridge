import './Navbar.css'
import React, { useEffect } from 'react';
import { useAdminContext } from '../hooks/useAdminContext';
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext';
import logo from '../assets/kitchen-connect-logo.png'
import { Link } from 'react-router-dom'
const Navbar = () => {
  const { dispatch, admin } = useAdminContext()
  const { logout } = useLogout()
  const { user } = useAuthContext()
  
  const handleClick = () => {
    logout()
  }

  const handleOrders = () => {
    dispatch({type: 'SET_ADMIN', payload: false})
  }
  const handleAdmin = () => {
    dispatch({type: 'SET_ADMIN', payload: true})
  }


  return (
   
      <nav>
      <div className="log" >
        <img className='logo' src={logo} alt='cause effect logo' />
      </div>
      <div className='nav-links'>
         <Link to="/oders" onClick={handleOrders} className={!admin ? 'navlink-active front' : 'front'}>Orders</Link>
         <Link to="/admin" onClick={handleAdmin} className={admin ? 'navlink-active kitchen' : 'kitchen'}>Kitchen Admin</Link>
         <button  onClick={handleClick} className='kitchen'>Log out</button>
      </div>
       <div className='company-name'>{user.companyName}</div>
    </nav>
    
 
    
  );
}

export default Navbar;
