import React from "react";
import { useNavigate } from 'react-router-dom';


const SuccessfulMoveIn = () => {
  const navigate = useNavigate();

    const RentNow = (e) => {
        e.preventDefault();
        navigate('/postBooking/Profile');
      }
    return (
        <div className="bg-white border-radius-15 text-center border-top-success-4 card-boxshadow w-35 mx-auto px-2 py-5 mt-5">
            <div className="success-img text-center mb-2">
                <img className="w-75" src="/assets/images/success-movein.svg" alt="Successfully Moved In" />
            </div>
            <h6 className="text-success-dark fs-7 fw-500 mb-1">{t("You have successfully Moved In")}</h6>
            <p className="mb-2">{t("Check your inbox for lease-related information")}</p>
            <button onClick={e=>RentNow(e)} className="ui button bg-success-dark text-white fw-100">{t("Go to Dashboard")}</button>
        </div>
    )
}

export default SuccessfulMoveIn