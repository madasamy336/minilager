import React from 'react'
import { NavLink } from 'react-router-dom'
export default function Header() {
  return (
    <>
    <div>

    <div className='ui secondary pointing menu py-1'>
    <a className="item">
    <img className='w-50' src='https://123minilager.no/wp-content/uploads/2020/03/cropped-123Minilager-Lager-til-leie-1.jpg'/>
    </a>
   <div className='right menu'>

   <a  href="https://123minilager.no"className="item fs-7 fw-700 mx-4 navtext py-3">
    HOME
  </a>
  <NavLink to={'/home'}  className="item fs-7 fw-700 mx-4 navtext py-3">
  ORDER MINI STOCK
  </NavLink>
  <NavLink to={'/login'} className="item fs-7 fw-700 mx-4 navtext py-3">
  MY SIDE
  </NavLink>
   </div>
    </div>
    </div>
    </>
  )
}

