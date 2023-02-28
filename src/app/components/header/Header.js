import React from "react";
import { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom'
import { useTranslation } from "react-i18next";
import { Dropdown, Icon, Menu } from 'semantic-ui-react'
import { useLocation } from 'react-router-dom'
export default function Header(props) {
  const location = useLocation()
  const storedLanguage = localStorage.getItem('selectedLanguage');
  const [selectedLanguage, setSelectedLanguage] = useState(storedLanguage || 'nn');
  const openSidebar = (e) => {
    e.preventDefault();
    props.showSidebar(!props.sidebar)
  }
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage)
  }, [selectedLanguage])

  const handleLanguageChange = (e_, data) => {
    localStorage.setItem('selectedLanguage', data.value);
    setSelectedLanguage(data.value);
    i18n.changeLanguage(data.value)
  };

  const Languages = [

    { key: 'nn', text: 'Norwegian', value: 'nn' }
    ,

    { key: 'en', text: 'English', value: 'en' },

  ]
  return (
    <>

      <div className={`position-fixed w-100 ${location.pathname.startsWith('/postBooking') && `${props.width < 980 && 'pb-5'}`}`} id='mainHeader'>

        <div className='ui secondary pointing menu py-1 bg-white d-block  w-100'>
          <a href="/" className={`item d-inline-block ${props.width < 981 && 'w-50'}`}>
            <img className={`${props.width > 980 && 'w-50'} ${props.width > 500 ? `${props.width < 980 && 'w-25'}` : `w-75`}`} src='https://123minilager.no/wp-content/uploads/2020/03/cropped-123Minilager-Lager-til-leie-1.jpg' alt="123minilager.no" />
          </a>
          {
            props.width > 980
            &&
            <div className='right menu d-inline-block float-right'>

              <a href="https://123minilager.no" className="item fs-7 fw-700 mx-4 navtext py-3 d-inline-block">
                {t('HOME')}
              </a>
              <NavLink to={'/home'} className="item fs-7 fw-700 mx-4 navtext py-3 d-inline-block">
                {t('ORDER MINI STOCK')}
              </NavLink>
              <NavLink to={!localStorage.getItem('userid') ? '/login' : '/postBooking/Profile'} className="item fs-7 fw-700 mx-4 navtext py-3 d-inline-block">
                {t("MY SIDE")}
              </NavLink>
              <Dropdown defaultValue={selectedLanguage} className='mr-3' onChange={(e, data) => handleLanguageChange(e, data)} placeholder='Choose Language' selection options={Languages} />

            </div>

          }
          {
            props.width < 980 &&
            <div className='d-inline-block pt-1 float-right pr-2'>
              <Dropdown defaultValue={selectedLanguage} className='fs-8 min-width-5 mr-1' onChange={(e, data) => handleLanguageChange(e, data)} placeholder='Choose Language' selection options={Languages} />
              <Menu className='min-h-100' compact>
                <Dropdown className='fs-8' text='Menu' simple item direction='left'>
                  <Dropdown.Menu>
                    <Dropdown.Item>

                      <a href="https://123minilager.no" className="item fs-7 fw-700 mx-4 navtext">
                        {t('HOME')}
                      </a>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <NavLink to={'/home'} className="item fs-7 fw-700 mx-4 navtext">
                        {t('ORDER MINI STOCK')}
                      </NavLink>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <NavLink to={'/login'} className="item fs-7 fw-700 mx-4 navtext">
                        {t("MY SIDE")}
                      </NavLink>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Menu>
              {/* <Dropdown placeholder='State' search selection  options={Languages} /> */}

              {location.pathname.startsWith('/postBooking') && <Icon className='position-fixed fs-4 l-2 t-9' onClick={(e) => openSidebar(e)} name='bars' />}
            </div>
          }

        </div>
      </div>
    </>
  )
}