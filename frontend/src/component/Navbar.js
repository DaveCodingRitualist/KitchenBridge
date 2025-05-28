import './Navbar.css'
import React from 'react';

import logo from '../assets/Logo.svg'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <nav>
      <div className="log">
        <img src={logo} alt='cause effect logo' />
      </div>
      <div className='nav-links'>
         <Link to="/oders" className='front'>Orders</Link>
         <Link to="/admin" className='kitchen'>Kitchen Admin</Link>
      </div>
    </nav>
  );
}

export default Navbar;
