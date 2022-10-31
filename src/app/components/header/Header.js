import React from 'react'
import { NavLink } from 'react-router-dom'
import { Dropdown, Icon, Menu } from 'semantic-ui-react'
import { useLocation } from 'react-router-dom'
export default function Header(props) {
  const location=useLocation()
   const openSidebar=(e)=>{
     e.preventDefault();
     props.showSidebar(!props.sidebar)
  }  
  return (
    <>

<div className={`position-fixed w-100 ${location.pathname.startsWith('/postBooking')&&`${props.width <980 && 'pb-5'}`}`}id='mainHeader'>
    <div  className='ui secondary pointing menu py-1 bg-white d-block  w-100'>
    <a href="/" className={`item d-inline-block ${props.width <981 && 'w-50'}`}>
    <img className={`${props.width >980 && 'w-50'} ${props.width>500 ? `${props.width<980 && 'w-25'}`:`w-75`}`} src='https://123minilager.no/wp-content/uploads/2020/03/cropped-123Minilager-Lager-til-leie-1.jpg' alt="123minilager.no"/>
    </a>  
    {
     props.width >980 
       &&
      <div className='right menu d-inline-block float-right'>

   <a  href="https://123minilager.no"className="item fs-7 fw-700 mx-4 navtext py-3 d-inline-block">
    HOME
  </a>
  <NavLink to={'/home'}  className="item fs-7 fw-700 mx-4 navtext py-3 d-inline-block">
  ORDER MINI STOCK
  </NavLink>
  <NavLink to={'/login'} className="item fs-7 fw-700 mx-4 navtext py-3 d-inline-block">
  MY SIDE
  </NavLink>
   </div>

    }
    {
      props.width <980 &&
    <div className='d-inline-block float-right pr-3'>
    <Menu className='min-h-100' compact>
   <Dropdown className='fs-8' text='Menu' simple item  direction='left'>
  <Dropdown.Menu>
  <Dropdown.Item>

   <a  href="https://123minilager.no"className="item fs-7 fw-700 mx-4 navtext">
    HOME
  </a>
    </Dropdown.Item>
    <Dropdown.Item>
  <NavLink to={'/home'}  className="item fs-7 fw-700 mx-4 navtext">
  ORDER MINI STOCK
  </NavLink>
    </Dropdown.Item>
    <Dropdown.Item>
    <NavLink to={'/login'} className="item fs-7 fw-700 mx-4 navtext">
  MY SIDE
  </NavLink>
    </Dropdown.Item>
  </Dropdown.Menu>
   </Dropdown>
  </Menu>
{location.pathname.startsWith('/postBooking') &&  <Icon className='position-fixed fs-4 l-2 t-9' onClick={(e)=>openSidebar(e)} name='bars'/> }
    </div>
    }
   
    </div>
    </div>
    </>
  )
}

