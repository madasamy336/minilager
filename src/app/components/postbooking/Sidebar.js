import React, { useState, useEffect } from 'react'
import { useNavigate, NavLink } from 'react-router-dom';
import { Modal, Button } from 'semantic-ui-react';
import { useTranslation } from "react-i18next";

import {
  Menu,
  Sidebar,
} from 'semantic-ui-react'
export default function SidebarPostBooking(props) {

  const Navigate = useNavigate();
  const [isLoading, setLoader] = useState(false);
  const { t, i18n } = useTranslation();
  const [logoutModal, setLogoutModalOpen] = useState({
    open: false,
    dimmer: undefined,
  })
  function logout() {
    setLoader(true)
    const timer = setTimeout(() => {
      console.log('This will run after 1 second!')
      localStorage.clear();
      sessionStorage.removeItem("customFieldstorage");
      sessionStorage.removeItem("MaxValue");
      sessionStorage.removeItem("MinValue");
      sessionStorage.removeItem("preferredStorage");
      sessionStorage.removeItem("facilityaddress");
      sessionStorage.removeItem("moveindate");
      sessionStorage.removeItem("tenantInfo");
      sessionStorage.removeItem("companyDetail");
      sessionStorage.removeItem("isBussinessUser");
      sessionStorage.removeItem("invoiceData");
      sessionStorage.removeItem("recurringData");
      sessionStorage.removeItem("fieldid");
      sessionStorage.removeItem("emergencyDetail");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("tokenExpirationTimestamp");
      sessionStorage.removeItem('rememberPassword');
      sessionStorage.removeItem('username');
      sessionStorage.removeItem('password');
      sessionStorage.removeItem('leaseProfileid');
      sessionStorage.removeItem('invoicePeriodValue');
      sessionStorage.removeItem('insurancedetail');
      sessionStorage.removeItem('servicedetail');
      sessionStorage.removeItem('merchandiseItem');
      sessionStorage.removeItem('invoicePeriodset');
      sessionStorage.removeItem('desiredMoveoutDate');
      setLogoutModalOpen(({
        open: false,
        dimmer: undefined
      }))
      setLoader(false)
      Navigate('/login');
    }, 2000);
    return () => clearTimeout(timer);
  }

  return (
    <>
      <Sidebar id='postBookingSidebar' className={`pt-3 ${props.width < 980 ? 't-9' : 't-10'}`}
        as={Menu}
        animation={props.width > 980 ? 'push' : 'overlay'}
        // icon='labeled'
        inverted
        onHide={() => props.showSidebar(false)}
        vertical
        visible={props.width > 980 ? true :
          props.sidebar

        }
      >
        {
          props.width < 980 &&
          <div className='item disablBefore  position-relative p-0'>
            <svg onClick={() => props.showSidebar(false)} className='r-2 t-n1 cursor-pointer position-absolute' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 17.473 17.47">
              <path id="wrong-5" d="M978.609-438.353l-2.052-2.043-4.37-4.366a1.33,1.33,0,0,1-.4-1.425,1.3,1.3,0,0,1,.833-.843,1.3,1.3,0,0,1,1.171.183,3.019,3.019,0,0,1,.353.321q3.009,3,6.009,6.01c.088.088.159.193.254.309.127-.118.217-.2.3-.281l6.156-6.156a1.332,1.332,0,0,1,1.325-.431,1.3,1.3,0,0,1,.927.828,1.3,1.3,0,0,1-.188,1.228,3.412,3.412,0,0,1-.325.35q-3,3.009-6.011,6.009a3.233,3.233,0,0,1-.317.244c.132.14.213.23.3.316q3.052,3.053,6.108,6.1a1.36,1.36,0,0,1,.441,1.387,1.305,1.305,0,0,1-2.205.564c-.59-.568-1.163-1.157-1.74-1.736l-4.487-4.491a2.068,2.068,0,0,1-.183-.248l-.142-.051a1.52,1.52,0,0,1-.191.325q-3.047,3.059-6.1,6.111a1.341,1.341,0,0,1-1.45.419,1.3,1.3,0,0,1-.851-.866,1.3,1.3,0,0,1,.235-1.19,3.215,3.215,0,0,1,.257-.274l6.034-6.033C978.386-438.167,978.484-438.245,978.609-438.353Z" transform="translate(-971.716 447.116)" fill="#fff" />
            </svg>
          </div>
        }

        <NavLink to={'/postBooking/Profile'} className='item disablBefore fs-7 my-1' >
          <svg className='mr-1' height='12' width='12' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.023 21.404">
            <g fill="none" className='strokeSvg' stroke="#fff" strokeWidth="1" data-name="Group 12" transform="translate(.5 .5)" >
              <path d="M4.908 8.389a4.755 4.755 0 01-1.44-3.474 4.753 4.753 0 011.44-3.475A4.753 4.753 0 018.383 0a4.758 4.758 0 013.474 1.439 4.756 4.756 0 011.44 3.475 4.755 4.755 0 01-1.44 3.475 4.752 4.752 0 01-3.474 1.439 4.758 4.758 0 01-3.475-1.439z"></path>
              <path d="M3.6 20.404a3.623 3.623 0 01-2.594-.948A3.39 3.39 0 010 16.895c0-.41.014-.816.041-1.205a12.144 12.144 0 01.165-1.29 10.232 10.232 0 01.318-1.3 6.369 6.369 0 01.533-1.209 4.529 4.529 0 01.8-1.047 3.534 3.534 0 011.157-.721 3.974 3.974 0 011.473-.267 1.5 1.5 0 01.8.339c.243.158.523.339.832.536a4.755 4.755 0 001.076.474 4.293 4.293 0 001.317.213 4.285 4.285 0 001.316-.212 4.747 4.747 0 001.072-.475c.313-.2.593-.38.832-.536a1.494 1.494 0 01.8-.339 3.981 3.981 0 011.474.267 3.531 3.531 0 011.154.725 4.55 4.55 0 01.8 1.047 6.443 6.443 0 01.54 1.209 10.1 10.1 0 01.317 1.3 12.206 12.206 0 01.165 1.289c.028.389.041.794.041 1.205a3.387 3.387 0 01-1.006 2.558 3.623 3.623 0 01-2.593.946z"
                data-name="Shape"
              ></path>
            </g>
          </svg>
          {t("Profile")}
        </NavLink>
        <NavLink to={'/postBooking/myLeases'} className='item disablBefore fs-7 my-1 '>
          <svg className='mr-1' height='12' width='12' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.754 21.751">
            <g fill="#fff"><path d="M15.847 0a3.476 3.476 0 01.538.162A1.656 1.656 0 0117.4 1.707c.018 1.183.005 2.367 0 3.551a.208.208 0 01-.029.113q-.616.882-1.236 1.761a.234.234 0 01-.04.03v-.128-4.405a1.3 1.3 0 00-1.111-1.309 1.394 1.394 0 00-.232-.013H2.645a1.3 1.3 0 00-1.338 1.337v16.457a1.3 1.3 0 001.343 1.343h12.1a1.3 1.3 0 001.348-1.349v-4.638a.374.374 0 01.064-.2c.4-.58.81-1.157 1.229-1.753 0 .045.01.07.01.1v7.424a1.729 1.729 0 01-1.732 1.728H1.742A1.732 1.732 0 01.02 20.27.665.665 0 000 20.2V1.554c.007-.028.016-.054.021-.084A1.72 1.72 0 011.232.076c.1-.035.214-.052.321-.076z"
              data-name="Path 16033"
            ></path>
              <path d="M514.857 212.77l2.377 1.665-7.266 10.373-2.377-1.664 7.266-10.374zm-.083 1.714l-5.579 7.962.2.139 5.579-7.962-.2-.14zm-4.65 8.6l5.565-7.944-.189-.14-5.565 7.944z" data-name="Path 16034" transform="translate(-496.313 -208.043)" ></path>
              <path d="M137.15 318.565v-1.025h11.306v1.025z" data-name="Path 16035" transform="translate(-134.103 -310.485)" ></path>
              <path d="M137.25 195.236v-1.026h11.3v1.026z" data-name="Path 16036" transform="translate(-134.201 -189.895)" ></path>
              <path d="M148.534 440.81c-.242.344-.473.673-.706 1a.133.133 0 01-.074.036.333.333 0 01-.077 0H137.32v-1.036h11.214z" data-name="Path 16037" transform="translate(-134.269 -431.017)" ></path>
              <path d="M167.835 687.912a1.653 1.653 0 11-1.64-1.653 1.657 1.657 0 011.64 1.653z" data-name="Path 16038" transform="translate(-160.874 -671.013)"></path>
              <path d="M846.281 157.177l-2.37-1.659c.017-.029.03-.054.046-.078.148-.212.293-.426.446-.635a.72.72 0 01.987-.186c.422.28.836.571 1.245.87a.68.68 0 01.172.922c-.161.26-.345.506-.525.766z" data-name="Path 16039" transform="translate(-825.161 -151.066)"></path>
              <path d="M499.98 693.212v-2.552l2.391 1.672-2.391.88z" data-name="Path 16040" transform="translate(-488.872 -675.316)"></path>
            </g>
          </svg>
          {t("My Leases")}
        </NavLink>
        <NavLink to={'/postBooking/myInvoices'} className='item disablBefore fs-7 my-1'>
          <svg className='mr-1' height='12' width='12' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.981 21.707" >
            <g fill="#fff" transform="translate(.03 .008)">
              <path
                d="M-1676.517 146.476v-10.5a.32.32 0 01.523-.282q.513.318 1.01.662a.23.23 0 00.3 0c.3-.207.615-.4.912-.61a.441.441 0 01.58-.007c.284.2.587.38.873.582a.288.288 0 00.4.007c.293-.217.61-.4.91-.61a.4.4 0 01.5 0c.313.215.638.414.951.629a.238.238 0 00.321 0c.31-.22.636-.416.95-.631a.4.4 0 01.5 0c.32.219.651.423.97.642a.212.212 0 00.283 0c.313-.215.638-.413.95-.63a.422.422 0 01.541 0c.305.214.626.4.931.618a.242.242 0 00.321 0c.3-.209.613-.4.911-.61a.43.43 0 01.562-.006c.285.2.588.379.874.58a.3.3 0 00.418.009 9.067 9.067 0 01.915-.6.492.492 0 01.392-.042.442.442 0 01.162.339c.015.692.007 1.385.007 2.077v18.887a.32.32 0 01-.522.283 15.78 15.78 0 01-.971-.64.281.281 0 00-.381 0c-.291.206-.6.387-.892.594a.432.432 0 01-.562 0c-.3-.21-.61-.4-.915-.605a.238.238 0 00-.321 0c-.292.206-.6.385-.892.594a.468.468 0 01-.621 0c-.3-.213-.61-.4-.91-.61a.212.212 0 00-.283 0c-.319.22-.649.423-.969.642a.4.4 0 01-.5 0c-.313-.215-.64-.412-.95-.631a.24.24 0 00-.321 0c-.305.212-.626.4-.931.617a.42.42 0 01-.542 0c-.3-.21-.61-.4-.912-.606a.249.249 0 00-.34-.006c-.3.212-.615.394-.911.606a.442.442 0 01-.581-.007c-.3-.212-.61-.4-.911-.606a.229.229 0 00-.3 0c-.3.212-.614.423-.937.61a.624.624 0 01-.414.078c-.183-.045-.183-.233-.183-.4q.006-5.21.005-10.417zm16.323 9.933v-19.866c-.253.164-.488.3-.7.462a.476.476 0 01-.639.008c-.281-.208-.587-.381-.873-.582a.25.25 0 00-.341-.006c-.291.207-.6.388-.892.6a.455.455 0 01-.6 0c-.3-.214-.61-.4-.911-.607a.223.223 0 00-.3 0c-.312.216-.637.414-.95.629a.413.413 0 01-.523 0c-.312-.216-.638-.413-.949-.631a.23.23 0 00-.3 0c-.319.22-.648.427-.97.643a.389.389 0 01-.484 0c-.308-.21-.626-.406-.931-.618a.265.265 0 00-.36-.008c-.3.213-.613.4-.911.61a.428.428 0 01-.56-.007c-.3-.215-.625-.407-.932-.618a.212.212 0 00-.282 0c-.312.216-.638.413-.95.63a.416.416 0 01-.542 0c-.239-.17-.488-.323-.761-.5v19.872c.26-.17.5-.312.724-.477a.45.45 0 01.6-.007c.277.2.575.371.854.569a.307.307 0 00.418.008c.294-.216.61-.4.911-.607a.385.385 0 01.483 0c.3.209.626.4.931.618a.28.28 0 00.38 0c.3-.214.61-.4.911-.61a.4.4 0 01.522 0c.313.215.637.414.95.631a.227.227 0 00.3 0c.312-.218.637-.414.949-.631a.412.412 0 01.522 0c.313.216.638.413.95.63a.227.227 0 00.3 0c.3-.208.615-.393.911-.607a.456.456 0 01.6 0c.285.2.588.379.872.583a.279.279 0 00.38-.006c.284-.2.59-.377.873-.582a.449.449 0 01.6.007c.214.161.463.302.719.471z"
                data-name="Path 111"
                transform="translate(1676.49 -135.63)"
              ></path>
              <path
                d="M-1625.5 314.8h5.224c.083 0 .188-.026.244.014.1.07.229.174.244.279s-.091.229-.179.3c-.061.052-.188.043-.285.043h-10.548c-.09 0-.209.012-.263-.038-.091-.082-.2-.216-.191-.316s.148-.2.251-.271c.061-.039.163-.013.244-.013z"
                data-name="Path 112"
                transform="translate(1633.982 -303.871)"
              ></path>
              <path
                d="M-1625.656 272.268h5.428a.293.293 0 01.29.3.291.291 0 01-.237.319.9.9 0 01-.226.021h-10.563c-.082 0-.191.012-.244-.033a.593.593 0 01-.212-.309.267.267 0 01.26-.29 1.673 1.673 0 01.228-.006z"
                data-name="Path 113"
                transform="translate(1634.14 -263.942)"
              ></path>
              <path
                d="M-1625.728 229.612h5.429a.3.3 0 01.3.287.3.3 0 01-.248.334 1.054 1.054 0 01-.249.016h-10.562c-.277 0-.435-.126-.427-.33s.153-.309.421-.309z"
                data-name="Path 114"
                transform="translate(1634.201 -223.886)"
              ></path>
              <path
                d="M-1494.466 364.121l.017-.271h.46l.03.294a2.017 2.017 0 011.079.5l-.329.446-.748-.387v1c.134.043.277.087.418.136a.936.936 0 01.759.976 1.06 1.06 0 01-.861.991c-.1.026-.206.041-.319.061l-.023.3h-.465a.528.528 0 00-.013-.187c-.034-.066-.09-.153-.15-.166a2.225 2.225 0 01-1.058-.543l.341-.427.87.458v-.976a.183.183 0 00-.1-.119c-.1-.048-.216-.073-.321-.115a.882.882 0 01-.644-.8 1 1 0 01.555-.993 4.707 4.707 0 01.502-.178zm.494 3.16c.358-.043.549-.223.531-.476-.013-.222-.215-.377-.531-.393zm-.5-2.534a.455.455 0 00-.4.423c-.006.192.122.32.4.39z"
                data-name="Path 115"
                transform="translate(1506.668 -349.941)"
              ></path>
              <path
                d="M-1583.835 186.947h2.532a1.821 1.821 0 01.183 0 .29.29 0 01.285.274.293.293 0 01-.232.343.935.935 0 01-.249.019h-5.086a1.091 1.091 0 01-.2-.008.3.3 0 01-.275-.334.29.29 0 01.31-.3h.228z"
                data-name="Path 116"
                transform="translate(1592.319 -183.821)"
              ></path>
            </g>
          </svg>
          {t("My Invoices")}
        </NavLink>
        <NavLink to={'/postBooking/payment'} className='item disablBefore fs-7 my-1'>
          <svg className='mr-1' height='12' width='12' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24.004 16.009">
            <g fill="#fff" transform="translate(.02 -.02)">
              <path
                d="M-463.988 233.627a6.493 6.493 0 01-.464 1.11 2.425 2.425 0 01-2.165 1.082h-18.725a2.5 2.5 0 01-2.512-1.728 2.961 2.961 0 01-.128-.874q-.012-5.4 0-10.8a2.5 2.5 0 012.6-2.6c1.468-.006 2.937 0 4.406 0h14.341a2.52 2.52 0 012.53 1.742c.048.147.082.3.125.449zm-23-6.8v6.37a1.5 1.5 0 001.608 1.613h18.794a1.5 1.5 0 001.606-1.614v-6.117c0-.081-.007-.163-.012-.251zm.03-1.037h21.944v-1.956h-21.944zm21.981-2.992v-.351a1.5 1.5 0 00-1.616-1.628h-18.793a1.557 1.557 0 00-1.566 1.979z"
                data-name="Path 96"
                transform="translate(487.97 -219.79)"
              ></path>
              <path
                d="M-436.57 411.433h2.833a1.3 1.3 0 01.3.027.47.47 0 01.368.478.471.471 0 01-.376.474 1.252 1.252 0 01-.278.026h-5.69a1.145 1.145 0 01-.3-.033.483.483 0 01-.349-.473.479.479 0 01.355-.467 1.178 1.178 0 01.3-.032q1.422-.002 2.837 0z"
                data-name="Path 97"
                transform="translate(443.042 -399.412)"
              ></path>
              <path
                d="M-436.531 379.616h2.809c.078 0 .157 0 .234.006a.477.477 0 01.448.481.492.492 0 01-.43.5 1.7 1.7 0 01-.234.006h-5.854a.5.5 0 01-.475-.512.487.487 0 01.48-.477c.218-.01.438 0 .656 0z"
                data-name="Path 98"
                transform="translate(443.015 -369.587)"
              ></path>
            </g>
          </svg>
          {t("Payment")}
        </NavLink>
        <NavLink to={'/postBooking/updatePassword'} className='item disablBefore fs-7 my-1'>
          <svg className='mr-1' height='12' width='12' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.646 27.078" >
            <g fill="#fff" opacity="0.58" transform="translate(-31.62)">
              <path
                d="M47.933 9.764h-.441V6.548a6.549 6.549 0 00-13.1 0v3.216h-.441A2.336 2.336 0 0031.62 12.1v12.644a2.336 2.336 0 002.333 2.333h13.98a2.336 2.336 0 002.333-2.333V12.1a2.336 2.336 0 00-2.333-2.336zM36.394 6.548a4.549 4.549 0 019.1 0v3.216h-9.1zm11.872 18.2a.338.338 0 01-.333.333h-13.98a.338.338 0 01-.333-.333V12.1a.338.338 0 01.333-.333h13.98a.338.338 0 01.333.333z"
                data-name="Path 19671"
              ></path>
              <path
                d="M95.047 116.309a1 1 0 00-1 1v3.828a1 1 0 102 0v-3.828a1 1 0 00-1-1z"
                data-name="Path 19672"
                transform="translate(-54.104 -100.802)"
              ></path>
            </g>
          </svg>
          {t("Update Password")}
        </NavLink>
        <a type="button" className='item disablBefore fs-7 my-1' onClick={() => setLogoutModalOpen({ open: true, dimmer: 'blurring' })}>
          <svg className='mr-1' height='12' width='12'
            xmlns="http://www.w3.org/2000/svg"
            data-name="log-out (1)"
            viewBox="0 0 24 24"
          >
            <path
              fill="#fff"
              d="M4.5 8h-4a.5.5 0 010-1h4A1.5 1.5 0 006 5.5v-5a.5.5 0 011 0v5A2.5 2.5 0 014.5 8z"
              transform="translate(9 13)"
            ></path>
            <path
              fill="#fff"
              d="M10.5 1H.5a.5.5 0 010-1h10a.5.5 0 010 1z"
              data-name="Path"
              transform="translate(13 10)"
            ></path>
            <path
              fill="#fff"
              d="M7.362 23.891l-5.99-2A2 2 0 010 20V2a2 2 0 012-2 1.87 1.87 0 01.639.11l5.99 2A2 2 0 0110 4v18a2 2 0 01-2 2 1.905 1.905 0 01-.638-.109z"
            ></path>
            <path
              fill="#fff"
              d="M14 8a.5.5 0 01-.5-.5v-5A1.5 1.5 0 0012 1H.5a.5.5 0 010-1H12a2.5 2.5 0 012.5 2.5v5a.5.5 0 01-.5.5z"
              data-name="Path"
              transform="translate(1.5)"
            ></path>
            <path
              fill="#fff"
              d="M.5 9a.5.5 0 01-.354-.853L3.792 4.5.146.853A.5.5 0 01.853.146l4 4a.5.5 0 010 .707l-4 4A.5.5 0 01.5 9z"
              data-name="Path"
              transform="translate(19 6.002)"
            ></path>
          </svg>
          {t("Log Out")}
        </a>
      </Sidebar>

      <Modal
        size="mini"
        dimmer={logoutModal.dimmer}
        open={logoutModal.open}
        onClose={() => setLogoutModalOpen({ open: false })}
      >
        <Modal.Header className='bg-success-dark text-white text-center fs-6 py-2 fw-400 position-relative'>{t("Logout Confirmation")}
         {!isLoading && <svg onClick={() => setLogoutModalOpen({ open: false })} className='r-3 cursor-pointer position-absolute' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 17.473 17.47">
            <path id="wrong-5" d="M978.609-438.353l-2.052-2.043-4.37-4.366a1.33,1.33,0,0,1-.4-1.425,1.3,1.3,0,0,1,.833-.843,1.3,1.3,0,0,1,1.171.183,3.019,3.019,0,0,1,.353.321q3.009,3,6.009,6.01c.088.088.159.193.254.309.127-.118.217-.2.3-.281l6.156-6.156a1.332,1.332,0,0,1,1.325-.431,1.3,1.3,0,0,1,.927.828,1.3,1.3,0,0,1-.188,1.228,3.412,3.412,0,0,1-.325.35q-3,3.009-6.011,6.009a3.233,3.233,0,0,1-.317.244c.132.14.213.23.3.316q3.052,3.053,6.108,6.1a1.36,1.36,0,0,1,.441,1.387,1.305,1.305,0,0,1-2.205.564c-.59-.568-1.163-1.157-1.74-1.736l-4.487-4.491a2.068,2.068,0,0,1-.183-.248l-.142-.051a1.52,1.52,0,0,1-.191.325q-3.047,3.059-6.1,6.111a1.341,1.341,0,0,1-1.45.419,1.3,1.3,0,0,1-.851-.866,1.3,1.3,0,0,1,.235-1.19,3.215,3.215,0,0,1,.257-.274l6.034-6.033C978.386-438.167,978.484-438.245,978.609-438.353Z" transform="translate(-971.716 447.116)" fill="#fff" />
          </svg>}
        </Modal.Header>
        <Modal.Content className='mh-200 overflow-y-auto'>
          <div className='row'>
            <h5 className=''>{t("Are you sure you want to logout?")}</h5>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setLogoutModalOpen({ open: false })} disabled={isLoading} negative>
            {t("No")}
          </Button>
          <Button onClick={() => logout()} disabled={isLoading} loading={isLoading} positive>
            {t("Yes")}
          </Button>
        </Modal.Actions>
      </Modal>

    </>
  )
}

