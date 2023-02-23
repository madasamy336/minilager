import React, { Component, useState } from 'react'
import { Accordion } from 'semantic-ui-react'
import { useTranslation } from "react-i18next";

export default function AddOnAccordion(props) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
 function handleClick (e, titleProps) {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  }
   
    return (
      <Accordion className='w-100'>
        <Accordion.Title className='d-flex justify-content-between align-items-center'
          active={activeIndex === 0}
          index={0}
          onClick={()=>handleClick}
        >
          <p>{t("Vehicle Detail")} {props.VehicleLength}</p>
          <div><img src="/assets/images/arrow-down.png" alt="Down" /></div>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
        <div className='row'>
          <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
            <p><span className='fs-7 fw-500 mr-1 mb-2'>{t("Vehicle Type")}:</span>{props.VehicleType}</p>
          </div>

          <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
            <p><span className='fs-7 fw-500 mr-1'>{t("Year")}:</span>{props.vehicleYear}</p>
          </div>

          <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
            <p><span className='fs-7 fw-500 mr-1'>{t("Brand")}:</span>{props.vehicleBrand}</p>
          </div>

          <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
            <p><span className='fs-7 fw-500 mr-1'>{t("Model")}:</span>{props.vehicleModel}</p>
          </div>

          <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
            <p><span className='fs-7 fw-500 mr-1'>{t("Color")}:</span>{props.vehicleColor}</p>
          </div>

          <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
            <p><span className='fs-7 fw-500 mr-1'>{t("Vehicle State")}:</span>{props.vehicleLicenceSate}</p>
          </div>

          <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
            <p><span className='fs-7 fw-500 mr-1'>{t("Registration No")}:</span>{props.vehicleRegNumber}</p>
          </div>

          <div className='col-lg-4 col-md-6 col-sm-12 px-1 mb-2'>
            <p><span className='fs-7 fw-500 mr-1'>{t("License No")}:</span>{props.vehicleLicenceNumber}</p>
          </div>
        </div>
          <div className='text-center'>
            <button onClick={() => props.RemoveFunction(props.index)} className="ui button bg-danger-light fs-7 fw-400 text-white px-5">Remove</button>
          </div>
        </Accordion.Content>
      </Accordion>
    )
  
}