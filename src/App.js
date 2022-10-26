import { Routes, Route, useLocation } from 'react-router-dom'
import SidebarPostBooking from './app/pages/postbooking/Sidebar';
import Header from './app/components/header/Header';
import PostLoginForm from './app/pages/PostLoginForm';
import RentNow from './app/pages/RentNow'
import Profile from './app/pages/postbooking/profile/Profile';
import MyLeases from './app/pages/postbooking/my leases/MyLeases';
import MYInvoices from './app/pages/postbooking/my invoices/MYInvoices';
import Payment from './app/pages/postbooking/payment/Payment';
import Updatepassword from './app/pages/postbooking/update password/Updatepassword';
import { useEffect, useState } from 'react';
import PostSignupForm from './app/pages/PostSignupForm';
import Units from './app/pages/Units';
import RentingDetails from './app/pages/RentingDetails';
import AddOn from './app/pages/AddOn';
import TenantDetails from './app/pages/TenantDetails';
import EsignPayment from './app/pages/EsignPayment';
import ForgotPassword from './app/pages/ForgotPassword';

function App() {
    const windowWidth = window.innerWidth
    const [mobileWidth, SetmobileWidth] = useState();
    const[sidebar,ShowSidebar]=useState(false)
    const location = useLocation()
    useEffect(() => {
        SetmobileWidth(windowWidth)
    }, [mobileWidth])
    return (
        <>

            <Header width={mobileWidth} sidebar={sidebar}  showSidebar={ShowSidebar} />
            <div className={`ui fluid container ${location.pathname.startsWith('/postBooking') && 'h-100'} `} id='mainContent'>
                <div className={`p-1 ${location.pathname.startsWith('/postBooking') &&'ui segment pushable '}`}>
                    {location.pathname.startsWith('/postBooking') && <SidebarPostBooking width={mobileWidth} sidebar={sidebar} />}
                    
                    <Routes>
                        <Route exact path='/home' element={<RentNow />} />
                        <Route path='/login' element={<PostLoginForm />} />
                        <Route path='/forgotpassword' element={<ForgotPassword />} />
                        <Route path='/signup' element={<PostSignupForm />} />
                        <Route path='/preBooking/units' element={<Units/>} />
                        <Route path='/preBooking/rentingDetails' element={<RentingDetails/>} />
                        <Route path='/preBooking/addOns' element={<AddOn/>} />
                        <Route path='/preBooking/TenantDetails' element={<TenantDetails/>}/>
                        <Route path='/preBooking/esignPayment' element={<EsignPayment/>} />
                    </Routes>
                    <div className={`${location.pathname.startsWith('/postBooking') && `pusher ${mobileWidth>980 && 'pusher-desktop'} `}`}>
                        {/* for postBooking */}
                        <Routes>
                            <Route path='/postBooking/Profile' element={<Profile />} />
                            <Route path='/postBooking/myLeases' element={<MyLeases />} />
                            <Route path='/postBooking/myInvoices' element={<MYInvoices />} />
                            <Route path='/postBooking/payment' element={<Payment />} />
                            <Route path='/postBooking/updatePassword' element={<Updatepassword />} />
                        </Routes>
                    </div>
                </div>
            </div>

        </>
    );
}

export default App;
