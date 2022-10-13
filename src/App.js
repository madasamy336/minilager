import { Routes, Route, useLocation } from 'react-router-dom'
import SidebarPostBooking from './app/components/postbooking/Sidebar';
import Header from './app/components/header/Header';
import PostLoginForm from './app/pages/PostLoginForm';
import RentNow from './app/pages/RentNow'
import Profile from './app/components/postbooking/profile/Profile';
import MyLeases from './app/components/postbooking/my leases/MyLeases';
import MYInvoices from './app/components/postbooking/my invoices/MYInvoices';
import Payment from './app/components/postbooking/payment/Payment';
import Updatepassword from './app/components/postbooking/update password/Updatepassword';
import { useEffect, useState } from 'react';
import PostSignupForm from './app/pages/PostSignupForm';


function App() {
    const windowWidth = window.innerWidth
    const [mobileWidth, SetmobileWidth] = useState();
    const location = useLocation()
    useEffect(() => {
        SetmobileWidth(windowWidth)
    }, [windowWidth])
    return (
        <>

            <Header />
            <div className='ui fluid container h-100 '>
                <div className='ui segment pushable overflow-y-auto'>
                    {location.pathname.startsWith('/postBooking') && <SidebarPostBooking />}

                    <Routes>
                        <Route exact path='/home' element={<RentNow />} />
                        <Route path='/login' element={<PostLoginForm />} />
                        <Route path='/signup' element={<PostSignupForm />} />
                    </Routes>
                    <div className="pusher pusher-desktop">
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
