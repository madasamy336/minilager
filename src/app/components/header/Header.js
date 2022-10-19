import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from "react-i18next";
export default function Header() {
  const { t, i18n } = useTranslation();
  const changeLanguageHandler = (e) => {
    const languageValue = e.target.value
    i18n.changeLanguage(languageValue);
  }
  return (
    <> 
    <div>
    <select className="custom-select" style={{width: 200}} onChange={changeLanguageHandler}>
        <option value="en" >English</option>
        <option value="nn" >Norwegian</option>
      </select>
    <div className='ui secondary pointing menu py-1 bg-white'>
    <a href="/" className="item">
    <img className='w-50' src='https://123minilager.no/wp-content/uploads/2020/03/cropped-123Minilager-Lager-til-leie-1.jpg' alt="123minilager.no"/>
    </a>
   <div className='right menu'>

   <a  href="https://123minilager.no"className="item fs-7 fw-700 mx-4 navtext py-3">
     {t('HOME')}
  </a>
  <NavLink to={'/home'}  className="item fs-7 fw-700 mx-4 navtext py-3">
   {t('ORDER MINI STOCK')}
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

