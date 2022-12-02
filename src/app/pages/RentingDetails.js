import React, { useState, useEffect } from 'react'
import PreBookingBreadcrumb from '../components/prebooking breadcrumb/PreBookingBreadcrumb'
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import { Dropdown, Modal } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pricesummary from '../components/pricesummary/pricesummary';
import {forwardRef, useImperativeHandle, useRef} from 'react';
// import { useTranslation } from "react-i18next";
import instance from '../services/instance';
import request from '../services/request';
import Helper from "../helper";
let helper = new Helper();




let customValues;
let unitid = localStorage.getItem('unitid');
export default function RentingDetails() {
  const childRef = useRef(null);
  const [invoice, setInvoice] = useState();
  const [invoiceDefault, setInvoiceDefault] = useState();
  const [recurring, setRecurring] = useState();
  const [movinDate, setMovinDate] = useState(new Date());
  const [customFieldAccess, SetCustomFieldAccess] = useState();
  const [customFieldsData, setCustomFieldsData] = useState([]);
  const clientDataconfig = JSON.parse(sessionStorage.getItem("configdata"));
  const recurringDefaultValue = clientDataconfig.recurringTypes[0].recurringTypeId;
  const PricesummaryData = () => {
    if (clientDataconfig !== null && typeof clientDataconfig !== "undefined") {
      const invoiceperiodval = clientDataconfig.invoicePeriods !== null && typeof clientDataconfig.invoicePeriods !== "undefined" && clientDataconfig.invoicePeriods.length > 0 ?
        clientDataconfig.invoicePeriods.map(item => {
          if(item.preferred){
            setInvoiceDefault(item.invoicePeriodId);
          }
          return {
            key: item.invoicePeriodId,
            text: item.invoicePeriod,
            value: item.invoicePeriodId,
            default:item.preferred,

          }
        }) : '';

      const recurringtype = typeof clientDataconfig.recurringTypes !== "undefined" && clientDataconfig.recurringTypes !== null && clientDataconfig.recurringTypes.length > 0 ?

        clientDataconfig.recurringTypes.map((item) => {
          return {
            key: item.recurringTypeId,
            text: item.recurringType,
            value: item.recurringTypeId,
          }

        }) : "";
      setInvoice(invoiceperiodval);
      setRecurring(recurringtype);

    }
  }

  if(typeof invoiceDefault!=="undefined" && invoiceDefault!== null && invoiceDefault !==""){
    sessionStorage.setItem("invoiceData", (invoiceDefault));
  }
  if(typeof recurringDefaultValue!=="undefined" && recurringDefaultValue!== null && recurringDefaultValue !==""){
    sessionStorage.setItem("recurringData", (recurringDefaultValue));
  }
 

  const movindateOnchange = (e, item) => {
   console.log(helper.readDate(item.value));
    console.log(item.value)
    setMovinDate(item.value);
    childRef.current.unitInfodetailscall();
  }
  const invoiceOnchange = (e, item) => {
    sessionStorage.setItem("invoiceData", (item.value));
    childRef.current.unitInfodetailscall();
    
  }
  const recurringOnchange = (e, item) => {
    sessionStorage.setItem("recurringData", (item.value));
    childRef.current.unitInfodetailscall();
    
  }

  const customhandlechange = (e) => {
    customValues = {
      value: e.target.value,
      checked: e.target.checked,
      unitId: e.target.dataset.unitid,
      fieldId: e.target.dataset.fieldid,

    }

    setCustomFieldsData([...customFieldsData, customValues]);

  }


  const customfleldvalidate = (e) => {
    const fieldId = e.target.dataset.fieldid;
    const value = e.target.value;
    const isMandatory = e.target.dataset.required;
    if (!value && isMandatory === "true") {
      document.getElementById(fieldId).style.display = 'block';
    } else if (!value && isMandatory === "false") {
      document.getElementById(fieldId).style.display = 'none';
    } else {
      document.getElementById(fieldId).style.display = 'none';
    }
  }

  const navigate = useNavigate()
  const [applyDiscountModal, SetApplyDiscountModal] = useState({
    open: false,
    dimmer: undefined,
  })


  const navigateAddon = (e) => {
    e.preventDefault();
    localStorage.setItem("customFieldValues", JSON.stringify(customFieldsData));
    navigate('/preBooking/addOns')

  }

  useEffect(() => {
    customFieldsSettings();
    PricesummaryData();
  }, []);

  const customFieldsSettings = () => {
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    instance
      .get(request.custom_Fields, config)
      .then((response) => {
        const custom_fields = response.data;
        if (typeof custom_fields !== "undefined" && custom_fields !== null && custom_fields !== "") {
          const custom_field_result = response.data.result;
          if (typeof custom_field_result !== "undefined" && custom_field_result !== null && custom_field_result !== "") {
            SetCustomFieldAccess(custom_field_result);
            localStorage.setItem("CustomFieldsSetting", JSON.stringify(custom_field_result));
          }
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  /** Promo Code Discount End */

 


  return (
    <>
      <div>
        <PreBookingBreadcrumb activeStep='1' />
        <div className='ui container responsive'>
          <div className='row'>
            <div className='col-12 col-md-7 pr-1 pr-sm-0 mb-3'>
              <div className='bg-white px-0 py-2 border-radius-15 card-boxshadow'>
                <h6 className='text-dark fw-500 fs-6 px-4 pb-2 px-sm-2 card-border-bottom'><svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 39.333 39.248"
                >
                  <g fill="#328128" data-name="Tenant Details" transform="translate(.05)">
                    <path
                      d="M42.311 38h.614a11.61 11.61 0 011.043.622q4.108 3.053 8.2 6.123c.077.057.162.1.307.195v-3.918a.972.972 0 011.107-1.105h3.339c.955 0 1.255.3 1.255 1.263 0 2.541.007 5.082-.008 7.622a.774.774 0 00.373.717c.648.456 1.257.969 1.912 1.412a3.812 3.812 0 011.831 2.474v.689l-.084.291a2.883 2.883 0 01-2.329 2.274 8.343 8.343 0 01-1.695-.019v17.488c0 .2 0 .41-.015.614a2.635 2.635 0 01-2.654 2.5q-12.883.01-25.768-.008a2.733 2.733 0 01-1.15-.264 2.639 2.639 0 01-1.53-2.61q.009-8.661 0-17.324v-.5l-.329.09a2.856 2.856 0 01-3.262-1.262 7.936 7.936 0 01-.518-1.264v-.689a3.967 3.967 0 011.8-2.452Q32.905 44.9 41.023 38.8c.405-.3.858-.533 1.288-.8zm.268 38.022h12.673a1.48 1.48 0 001.691-1.692q0-9.141.005-18.282a.634.634 0 00-.28-.575q-6.814-5.107-13.612-10.241a.618.618 0 00-.877 0q-6.8 5.131-13.612 10.241a.632.632 0 00-.28.574q.009 9.142.005 18.282a1.478 1.478 0 001.691 1.692zM59.242 55.59l.045-.093a1.731 1.731 0 001.689-1.3 1.667 1.667 0 00-.732-1.865l-17.1-12.8c-.518-.387-.518-.386-1.016-.013l-9.585 7.169q-3.783 2.826-7.561 5.656a1.659 1.659 0 00-.756 1.685 1.707 1.707 0 002.788 1.095q4.223-3.161 8.435-6.336l6.042-4.542a1.646 1.646 0 012.269 0c.216.161.43.323.644.484q6.882 5.17 13.769 10.337a6.473 6.473 0 001.069.523zM53.7 41.157v.452c0 1.137.041 2.276-.016 3.409a1.4 1.4 0 00.7 1.41c.861.564 1.662 1.219 2.535 1.87v-7.141z"
                      data-name="Path 15970"
                      transform="translate(-23 -38)"
                    ></path>
                    <path
                      d="M197.934 311.061h-.266l-.034-.007a2.151 2.151 0 01-.991-.307 2.244 2.244 0 01-1.077-1.56c-.015-.085-.024-.172-.035-.258v-.265a.348.348 0 01.008-.047c.014-.1.023-.2.043-.294a2.269 2.269 0 113.923 1.969 2.229 2.229 0 01-1.313.738c-.086.011-.173.019-.258.031zm-.487-1.9l-.249-.228c-.126-.114-.248-.232-.379-.341a.217.217 0 00-.346.117.236.236 0 00.082.243l.734.668a.227.227 0 00.348-.009l1.41-1.4a.444.444 0 00.037-.039.226.226 0 00-.029-.318.2.2 0 00-.034-.025.23.23 0 00-.293.053l-1.245 1.245-.037.035z"
                      data-name="Path 15971"
                      transform="translate(-177.906 -279.022)"
                    ></path>
                    <path
                      d="M145 202.189c.059.03.111.057.164.081a8.479 8.479 0 015.153 6.759 15.238 15.238 0 01.085 2.1.816.816 0 01-.731.79 1.727 1.727 0 01-.262.015h-15.266a.88.88 0 01-.988-.768 9.347 9.347 0 01.666-4.317 8.608 8.608 0 014.571-4.584c.043-.018.087-.035.13-.055.01 0 .017-.019.035-.041a5.125 5.125 0 01-1.946-4.366 5.018 5.018 0 011.689-3.54 5.193 5.193 0 116.7 7.927zm3.7 8.009a6.738 6.738 0 00-3.443-5.94 6.6 6.6 0 00-7.6.419 6.671 6.671 0 00-2.8 5.518zm-3.477-12.098a3.446 3.446 0 10-1 2.454 3.45 3.45 0 001-2.454z"
                      data-name="Path 15972"
                      transform="translate(-121.901 -177.054)"
                    ></path>
                  </g>
                </svg><span className='veritical-align-text-top ml-1'>Renting Details</span></h6>
                <div className="ui form px-4 px-sm-2">
                  <div className="field w-100 datePicker my-3">
                    <label className='fw-500 fs-7 mb-2' >Move-In Date</label>
                    <SemanticDatepicker placeholder='Select date' className='w-100' value={movinDate}   onChange={movindateOnchange} />
                  </div>
                  {typeof invoice !== "undefined" && invoice !== null && invoice.length > 0 ?
                    <div className="field w-100  my-3">
                      <label className='fw-500 fs-7 mb-2'>Invoice Period</label>
                      <Dropdown placeholder='Select Invoice Period' clearable fluid search selection options={invoice} value={invoice.value} defaultValue={invoiceDefault}  onChange={invoiceOnchange} />
                    </div> : ""}
                  {typeof recurring !== "undefined" && recurring !== null && recurring.length > 0 ?
                    <div className="field w-100  my-3">
                      <label className='fw-500 fs-7 mb-2'>Invoice Recurring</label>
                      <Dropdown placeholder='Select Invoice Recurring' clearable fluid search selection options={recurring} value={recurring.value} defaultValue={recurringDefaultValue} onChange={recurringOnchange} />
                    </div> : ""}
                  <div className="field w-100 datePicker my-3">
                    <label className='fw-500 fs-7 mb-2' >Desired Move Out date</label>
                    <SemanticDatepicker placeholder='Select date' className='w-100' />
                  </div>

                  {typeof customFieldAccess !== "undefined" && customFieldAccess !== null && customFieldAccess !== "" && customFieldAccess.length > 0 ?
                    customFieldAccess.map((item, index) => {
                      if (item.matadata.displayOn === "Unit specific details" && item.matadata.type === "textbox") {

                        return <div key={item.fieldId} className="field w-100 my-2 ">
                          <label className='fw-500 fs-7 mb-2'>{item.fieldName}
                          </label>
                          <input type='text' placeholder={item.fieldName} value={customFieldsData.forEach((data) => {
                            if (data.fieldId === item.fieldId) {
                              return data.value;
                            }
                          })} data-fieldId={item.fieldId} data-unitId={unitid} data-required={item.matadata.isMandatory} onChange={(e) => customhandlechange(e)} onBlur={(e) => customfleldvalidate(e)} />
                          <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>Required Field</div>
                        </div>

                      }

                      else if (item.matadata.displayOn === "Unit specific details" && item.matadata.type === "date") {

                        return <div key={item.fieldId} className='row'>
                          <div className="col-12">
                            <div className="field w-100 datePicker my-2">
                              <label className='fw-500 fs-7 mb-2'>{item.fieldName}</label>
                              <SemanticDatepicker placeholder={item.fieldName} className='w-100' value={customFieldsData.forEach((data)=>{
                                if(data.fieldId === item.fieldId){
                                 return data.value;
                                }
                              })}  data-fieldId ={item.fieldId} data-unitId ={unitid} data-required ={item.matadata.isMandatory} onChange={(e) => customhandlechange(e)} />
                           
                            <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>Required Field</div>
                            </div>
                          </div>
                        </div>

                      } 

                      else if (item.matadata.displayOn === "Unit specific details" && item.matadata.type === "checkboxes") {
                        return <div key={item.fieldId} className="col-12  col-md-6 my-2">
                          <span>{item.fieldName}
                            <span className="mx-2">
                              <input className="mr-1" type="checkbox" data-fieldId ={item.fieldId} data-unitId ={unitid} data-required ={item.matadata.isMandatory} value ={customFieldsData.forEach((data)=>{
                                if(data.fieldId === item.fieldId){
                                  return data.value;
                                }
                              })} onChange={(e) => customhandlechange(e)} />
                              <label>{item.options[0].option}</label>
                            </span>
                            <span>
                              <input className="mr-1" type="checkbox" data-fieldId ={item.fieldId} data-unitId={unitid} data-required = {item.matadata.isMandatory} value={customFieldsData.forEach((data)=>{
                                if(data.fieldId === item.fieldId){
                                  return data.value;
                                }
                              })}  onChange={(e) => customhandlechange(e)} />
                              <label>{item.options[1].option}</label>
                            </span>
                          </span>
                        </div>
                      } 

                      else if (item.matadata.displayOn === "Unit specific details" && item.matadata.type === "textarea") {

                        return <div key={item.fieldId} className='row'>
                          <div className="col-12">
                            <div className="field w-100 my-2">
                              <label className='fw-500 fs-7 mb-2'>{item.fieldName}</label>
                              <textarea placeholder={item.fieldName} rows="3" value={customFieldsData.forEach((data)=>{
                                if(data.fieldId === item.fieldId){
                                  return data.value;
                                }
                              })}  data-fieldId ={item.fieldId} data-unitId={unitid} data-required = {item.matadata.isMandatory} onChange={(e) => customhandlechange(e)} onBlur={(e) => customfleldvalidate(e)}></textarea>
                             <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>Required Field</div>
                            </div>
                          </div>
                        </div>
                      } 


                      // else if(item.matadata.displayOn === "Unit specific details" && item.matadata.type === "checkbox"){

                      //   return <div key={item.fieldId} className='row mt-2'>    
                      //   <div className="col-12">
                      //   <span>
                      //     <span className="mx-0">
                      //       <input className="mr-1" type="checkbox" />
                      //       <label>{item.fieldName}</label>
                      //     </span>
                      //   </span>
                      // </div>
                      // </div>

                      // }

                    }) : ''}

                </div>
              </div>

            </div>

            <ToastContainer />

            <Pricesummary ref={childRef} movinDate={movinDate} />

          </div>
          <div className='row'>
            <div className='col-12 text-center my-2'>
              <button onClick={() => navigate('/preBooking/units')} className="ui button  basic border-success-dark-1 fs-7 fw-400 text-dark px-5 mr-2">BACK</button>
              <button className="ui button bg-success-dark   fs-7 fw-400 text-white px-5" onClick={e => navigateAddon(e)}>NEXT</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
