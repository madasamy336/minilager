import { Routes, Route, useLocation } from 'react-router-dom'
import SidebarPostBooking from './app/components/postbooking/Sidebar';
import Header from './app/components/header/Header';
import PostLoginForm from './app/pages/PostLoginForm';
import RentNow from './app/pages/RentNow'
import Profile from './app/pages/postbooking/profile/Profile';
import MyLeases from './app/pages/postbooking/my leases/MyLeases';
import MYInvoices from './app/pages/postbooking/my invoices/MYInvoices';
import Payment from './app/pages/postbooking/payment/Payment';
import Updatepassword from './app/pages/postbooking/update password/Updatepassword';
import { useEffect, useState,React } from 'react';
import PostSignupForm from './app/pages/PostSignupForm';
import Units from './app/pages/Units';
import RentingDetails from './app/pages/RentingDetails';
import AddOn from './app/pages/AddOn';
import TenantDetails from './app/pages/TenantDetails';
import EsignPayment from './app/pages/EsignPayment';
import ForgotPassword from './app/pages/ForgotPassword';
import SuccessfulMoveIn from './app/pages/SuccessfulMoveIn';
import { useSelector, useDispatch } from 'react-redux';
// import { useTranslation } from "react-i18next";
import { fetchAppConfig } from '../src/app/redux/actions/appConfig/appConfigAction';

function App() {
    const loading = useSelector(state => state.appConfig.loading)
    const error = useSelector(state => state.appConfig.error)
    const countries = useSelector(state => state.appConfig.countries);
    const dispatch = useDispatch()
    // useEffect(() => {
    //     dispatch(fetchAppConfig())
    // }, [])

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
            {location.pathname.startsWith('/postBooking') && <SidebarPostBooking width={mobileWidth} sidebar={sidebar} showSidebar={ShowSidebar}/>}
                <div className={` pusher  ${location.pathname.startsWith('/postBooking') && `${mobileWidth>980 ? 'pusher-desktop ':'pt-120'}`} `} id='mainContent'>      
                    <Routes>
                        <Route exact path='/' element={<RentNow />} />
                        <Route exact path='/home' element={<RentNow />} />
                        <Route path='/login' element={<PostLoginForm callingfrom="postbooking" />} />
                        <Route path='/preBooking/sign-in' element={<PostLoginForm callingfrom='prebooking'  />} />
                        <Route path='/forgotpassword' element={<ForgotPassword />} />
                        <Route path='/signup' element={<PostSignupForm />} />
                        <Route path='/preBooking/units' element={<Units />} />
                        <Route path='/preBooking/rentingDetails' element={<RentingDetails />} />
                        <Route path='/preBooking/addOns' element={<AddOn />} />
                        <Route path='/preBooking/TenantDetails' element={<TenantDetails />} />
                        <Route path='/preBooking/esignPayment' element={<EsignPayment />} />
                        <Route path='/preBooking/thankyou' element={<SuccessfulMoveIn />} />

                        <Route path='/postBooking/Profile' element={<Profile />} />
                        <Route path='/postBooking/myLeases' element={<MyLeases />} />
                        <Route path='/postBooking/myInvoices' element={<MYInvoices />} />
                        <Route path='/postBooking/payment' element={<Payment />} />
                        <Route path='/postBooking/updatePassword' element={<Updatepassword />} />
                    </Routes>
                </div>

        </>
    );
}

export default App;
