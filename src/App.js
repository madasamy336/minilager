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
import Units from './app/pages/Units';
import RentingDetails from './app/pages/RentingDetails';
import AddOn from './app/pages/AddOn';
import TenantDetails from './app/pages/TenantDetails';
import EsignPayment from './app/pages/EsignPayment';
import { useSelector, useDispatch } from 'react-redux';

import { fetchAppConfig } from '../src/app/redux/actions/appConfig/appConfigAction';

function App() {

    const loading = useSelector(state => state.appConfig.loading)
    const error = useSelector(state => state.appConfig.error)
    const countries = useSelector(state => state.appConfig.countries)
    const dispatch = useDispatch()

    console.log({ loading }, { error }, { countries });

    useEffect(() => {
        dispatch(fetchAppConfig())
    }, [])

    const windowWidth = window.innerWidth
    const [mobileWidth, SetmobileWidth] = useState();
    const location = useLocation()
    useEffect(() => {
        SetmobileWidth(windowWidth)
    }, [windowWidth])
    return (
        <>

            <Header />
            <div className={`ui fluid container ${location.pathname.startsWith('/postBooking') && 'h-100'} `} id='mainContent'>
                <div className={location.pathname.startsWith('/postBooking') && 'ui segment pushable '}>
                    {location.pathname.startsWith('/postBooking') && <SidebarPostBooking />}

                    <Routes>
                        <Route exact path='/home' element={<RentNow />} />
                        <Route path='/login' element={<PostLoginForm />} />
                        <Route path='/signup' element={<PostSignupForm />} />
                        <Route path='/preBooking/units' element={<Units />} />
                        <Route path='/preBooking/rentingDetails' element={<RentingDetails />} />
                        <Route path='/preBooking/addOns' element={<AddOn />} />
                        <Route path='/preBooking/TenantDetails' element={<TenantDetails />} />
                        <Route path='/preBooking/esignPayment' element={<EsignPayment />} />
                    </Routes>
                    <div className={location.pathname.startsWith('/postBooking') && 'pusher pusher-desktop'}>
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
