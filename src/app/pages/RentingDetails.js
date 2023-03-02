import React, { useState, useEffect } from 'react'
import PreBookingBreadcrumb from '../components/prebooking breadcrumb/PreBookingBreadcrumb'
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import { Dropdown, Modal, Radio } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pricesummary from '../components/pricesummary/pricesummary';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from "react-i18next";
import instance from '../services/instance';
import request from '../services/request';
import Helper from "../helper";
import { object } from 'yup';
import { use } from 'i18next';
let helper = new Helper();
let fid;
let Sdetails;
let cusomfieldPhone;
let customFull;
let newArray;
let customInputFieldValue;
let customFieldValue = [];
let customValues;
let recurringTempvalue;


export default function RentingDetails() {
  let unitid = localStorage.getItem('unitid');
  let invoicePeriod = sessionStorage.getItem('invoicePeriodValue');
  let invoiceRecurrValue = sessionStorage.getItem('invoiceRecurringValue');
  let invoiceset = sessionStorage.getItem('invoiceSet');
  let invoicePeriodSet = sessionStorage.getItem('invoicePeriodset');
  let moveindate = sessionStorage.getItem('moveindate');
  let desiredMoveoutDatevalue =sessionStorage.getItem('desiredMoveoutDate');
  const childRef = useRef(null);
  const customFieldRef = useRef([]);
  const today = new Date();
  const maxDate = today.setDate(today.getDate() + 30);
  const {
    register,
    handleSubmit,
    errors
  } = useForm();
  const [TestT, SetCustomS] = useState([]);
  const { t, i18n } = useTranslation();
  const [invoice, setInvoice] = useState();
  const [invoiceDefault, setInvoiceDefault] = useState(invoicePeriod);
  const [recurring, setRecurring] = useState();
  const [checkInvoiceRecurring, setcheckInvoiceRecurring] = useState(false);
  const [movinDate, setMovinDate] = useState(moveindate !== null && typeof moveindate !== 'undefined' ? new Date(moveindate) : new Date());
  const [desiredMoveOutDate, setDesiredMoveOutDate] = useState(desiredMoveoutDatevalue !== 'null'&& desiredMoveoutDatevalue !== null && typeof desiredMoveoutDatevalue != 'undefined'  ? new Date(desiredMoveoutDatevalue) :'' );
  const [customFieldAccess, SetCustomFieldAccess] = useState();
  const [invoiceRecurringDisabled, setInvoiceRecurringDisabled] = useState(false);
  const clientDataconfig = JSON.parse(sessionStorage.getItem("configdata"));
  const recurringDefaultValue = clientDataconfig.recurringTypes[0].recurringTypeId;
  const [recurringvalue, setRecurringValue] = useState(invoiceset ? invoiceRecurrValue : recurringDefaultValue);
  let customFieldId;
  let customfieldValue;
  let customfieldBindingData = JSON.parse(sessionStorage.getItem("customFieldstorage")); 
  useEffect(() => {
    fetchAppConfig();

  }, [])

  const fetchAppConfig = () => {
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    instance
      .get(request.common_config, config)
      .then(response => {
        const configData = response.data.result;
        const culture = response.data.result.culture;
        sessionStorage.setItem('moveinDate', movinDate)
        const invoiceperiodval = configData.invoicePeriods !== null && typeof configData.invoicePeriods !== "undefined" && configData.invoicePeriods.length > 0 ?
          configData.invoicePeriods.map((value) => {
            if (value.preferred) {
              let periodId;
              if (invoicePeriodSet !== null && invoicePeriodSet !== 'null') {
                periodId = Number(invoicePeriod);
              } else {
                periodId = value.invoicePeriodId
              }
              sessionStorage.setItem("invoiceData", (periodId));
             
                setInvoiceDefault(periodId);
                
              

            }
            return {
              key: value.invoicePeriodId,
              text: value.invoicePeriod,
              value: value.invoicePeriodId,
              default: value.preferred,

            }
          }) : "";
        const recurringtype = typeof configData.recurringTypes !== "undefined" && configData.recurringTypes !== null && configData.recurringTypes.length > 0 ?

          configData.recurringTypes.map((item) => {
            return {
              key: item.recurringTypeId,
              text: item.recurringLabel,
              value: item.recurringTypeId,
            }

          }) : "";
        setRecurring(recurringtype);
        setInvoice(invoiceperiodval);



      })
      .catch(error => {
      })


  }
  const PricesummaryData = () => {
    if (clientDataconfig !== null && typeof clientDataconfig !== "undefined") {
      const invoiceperiodval = clientDataconfig.invoicePeriods !== null && typeof clientDataconfig.invoicePeriods !== "undefined" && clientDataconfig.invoicePeriods.length > 0 ?
        clientDataconfig.invoicePeriods.map(item => {
          if (item.preferred) {

            if (invoicePeriod) {
              setInvoiceDefault(Number(invoicePeriod));
            } else {
              setInvoiceDefault(item.invoicePeriodId);
            }
          }
          return {
            key: item.invoicePeriodId,
            text: item.invoicePeriod,
            value: item.invoicePeriodId,
            default: item.preferred,

          }
        }) : '';

      const recurringtype = typeof clientDataconfig.recurringTypes !== "undefined" && clientDataconfig.recurringTypes !== null && clientDataconfig.recurringTypes.length > 0 ?

        clientDataconfig.recurringTypes.map((item) => {
          return {
            key: item.recurringTypeId,
            text: item.recurringLabel,
            value: item.recurringTypeId,
          }

        }) : "";
      setInvoice(invoiceperiodval);
      setRecurring(recurringtype);

    }
  }



  if (typeof invoiceDefault !== "undefined" && invoiceDefault !== null && invoiceDefault !== "") {
    if (invoicePeriodSet) {
      sessionStorage.setItem("invoicePeriodValue", (invoicePeriod));

    } else {
      sessionStorage.setItem("invoicePeriodValue", (invoiceDefault));
    }
  }
  if (typeof recurringDefaultValue !== "undefined" && recurringDefaultValue !== null && recurringDefaultValue !== "") {
    sessionStorage.setItem("invoiceRecurringValue", (recurringvalue));
  }



  useEffect(() => {
    let invoicevalue;
    if (invoicePeriodSet) {
      invoicevalue = invoicePeriod
    } else {
      invoicevalue = invoiceDefault
    }
    if (Number(invoicevalue) >= 1 && Number(invoicevalue) <= 4) {
      let newvalue
      if (recurring !== null && typeof recurring !== 'undefined') {
        newvalue = recurring.filter(i => i.key === 3);
        console.log(newvalue);
        setRecurring(newvalue);
        setRecurringValue(3);
        setInvoiceRecurringDisabled(true);
      }

    }

  }, [invoicePeriod, invoiceDefault])


  const movindateOnchange = (e, item) => {
    setMovinDate(item.value);
    setDesiredMoveOutDate('');
    sessionStorage.setItem('moveinDate', item.value)
    sessionStorage.removeItem('desiredMoveoutDate');
    childRef.current.unitInfodetailscall();
  }

  const DesiredMoveoutDateChange = (e, date) => {
    sessionStorage.setItem('desiredMoveoutDate', date.value)
    setDesiredMoveOutDate(date.value);
  }
  const invoiceOnchange = (e, item) => {
    sessionStorage.setItem("invoicePeriodValue", (item.value));
    sessionStorage.setItem("invoicePeriodset", true);
    recurringTempvalue = recurring
    if (item.value >= 1 && item.value <= 4) {
      let newvalue = recurring.filter(i => i.key === 3);
      setRecurring(newvalue);
      setRecurringValue(3);
      setInvoiceRecurringDisabled(true);

    } else {
      setInvoiceRecurringDisabled(false);
      setRecurring(clientDataconfig.recurringTypes.map((item) => {
        return {
          key: item.recurringTypeId,
          text: item.recurringLabel,
          value: item.recurringTypeId,
        }

      }));
    }

    // childRef.current.unitInforecurringPeriodIdCall(item.value);

  }
  const recurringOnchange = (e, item) => {
    setcheckInvoiceRecurring(true);
    sessionStorage.setItem('invoiceSet', true);
    sessionStorage.setItem("invoiceRecurringValue", (item.value));
    // document.querySelector('.inovice-recurring>.divider.text').innerHTML="text";
    setRecurringValue(item.value)
    //childRef.current.unitInfodetailscall();

  }
  const [inputValue, setInputValue] = useState({})

  const customhandlechange = (e, data, checkfield) => {
    // setInputValue({"id":e.target.id,"":e.target.})
    if (checkfield === 'date') {
      const index = customFieldValue.findIndex(object => {
        return object.fieldId === data.fieldId
      })
      if (index !== -1) {
        customFieldValue[index].value = data.value
      } else {
        customFieldValue.push({ fieldId: data.fieldId, value: helper.readDate(data.value), unitId: unitid, fieldpage: data.fieldpage, typeof: data.type });

      }
      if (data.value === '' && data.required) {
        document.getElementById(`${data.fieldId}`).style.display = "block";

      } else {
        document.getElementById(`${data.fieldId}`).style.display = "none";
      }
    }
    customValues = {
      value: e.target.value,
      unitId: e.target.dataset.unitid,
      fieldId: e.target.dataset.fieldid,
    }
    const index = customFieldValue.findIndex(object => {
      return object.fieldId === e.target.dataset.fieldid
    })
    if (index !== -1) {
      customFieldValue[index].value = e.target.value
    } else {
      if (e.target.dataset.fieldid) {
        customFieldValue.push({ fieldId: e.target.dataset.fieldid, value: e.target.value, unitId: unitid, typeof: e.target.dataset.type, fieldpage: e.target.dataset.fieldpage });
      }

    }


    // SetCustomS({ ...TestT, [e.target.dataset.fieldid]: customValues });


    const fieldId = e.target.dataset.fieldid;
    const checked = e.target.checked;
    const isMandatory = e.target.dataset.required;

    sessionStorage.setItem("fieldid", (fieldId));
    let alphabet = document.getElementById("Alphabet");
    if (e.target.value && e.target.dataset.datatype) {
      let letters = /^[A-Za-z]+$/;

      if (!e.target.value.match(letters)) {
        if (alphabet) {
          document.getElementById("Alphabet").style.display = 'block';
        }

      } else {
        if (alphabet) {
          document.getElementById("Alphabet").style.display = 'none';
        }
      }
    } else {
      if (alphabet) {
        document.getElementById("Alphabet").style.display = 'none';
      }
    }


    if (!checked && isMandatory === "true") {
      let field_getId = document.getElementById(fieldId);
      if (field_getId !== null && typeof field_getId !== 'undefined') {
        field_getId.style.display = 'block';
      }
    }
    else {
      let field_getId = document.getElementById(fieldId);
      if (field_getId !== null && typeof field_getId !== 'undefined') {
        field_getId.style.display = 'none';
      }

    }


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



    // newArray = [];
    // newArray.push({
    //   value: TestT,
    // });

    // let fieldidData = sessionStorage.getItem("fieldid");
    // fid = fieldidData;
    // if (typeof newArray[0].value !== "undefined") {
    //   sessionStorage.setItem("cusomFieldValues", JSON.stringify(newArray));
    // }
    // Sdetails = JSON.parse(sessionStorage.getItem("cusomFieldValues"));
    // console.log(customFieldRef.current)
    checkCustomfieldValue();
    // navigate('/preBooking/addOns');

  }

  useEffect(() => {
    customFieldsSettings();
    //PricesummaryData();
  }, []);

  useEffect(() => {
    if (customfieldBindingData) {
      bindCustomFieldValue();
    }

  }, [customFieldAccess])


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

  const bindCustomFieldValue = () => {
    customfieldBindingData.forEach((item) => {
      let element = document.getElementById(`${item.typeof}_${item.fieldId}`);
      if (item.typeof === 'textbox' && element) {
        element.value = item.value
      } else if (item.typeof === 'checkboxes') {
        let checkboxes = document.getElementsByName(`${item.typeof}_${item.fieldId}`);
        checkboxes.forEach((element) => {
          if (element.defaultValue === item.value) {
            element.checked = true
          }
        });
      } else if (item.typeof === 'radio') {
        let checkboxes = document.getElementsByName(`${item.typeof}_${item.fieldId}`);
        checkboxes.forEach((element) => {
          if (element.defaultValue === item.value) {
            element.checked = true
          }
        });
      } else if (item.typeof === "date") {
        setTimeout(() => {
          if (element) {
            element.value = item.value
          }
        }, 1000)
      }

    })

  }


  const checkCustomfieldValue = () => {
    const customValue = JSON.parse(localStorage.getItem("CustomFieldsSetting"));
    let errorCount = 0;

    if (!customValue || customValue.length === 0) {
      navigate("/preBooking/addOns");
      return;
    }

    const filterUnitSpecificValue = customValue.filter(
      (i) => i.matadata.displayOn === "Unit specific details"
    );

    console.log(filterUnitSpecificValue);

    for (const item of filterUnitSpecificValue) {
      const customValue = document.getElementById(
        `${item.matadata.type}_${item.fieldId}`
      );
      const errorDiv = document.getElementById(`${item.fieldId}`);

      if (!item.matadata.isMandatory) continue;

      if (
        item.matadata.type === "textbox" &&
        customValue.value === ""
      ) {
        errorDiv.style.display = "block";
        errorCount++;
      } else if (
        item.matadata.type === "radio" ||
        item.matadata.type === "checkboxes" ||
        item.matadata.type === "checkbox"
      ) {
        const radioButtons = document.getElementsByName(
          `${item.matadata.type}_${item.fieldId}`
        );
        const hasCheckedButton = Array.from(radioButtons).some(
          (button) => button.checked
        );

        if (!hasCheckedButton) {
          errorDiv.style.display = "block";
          errorCount++;
        }
      } else if (
        item.matadata.type === "textarea" &&
        customValue.value === ""
      ) {
        errorDiv.style.display = "block";
        errorCount++;
      } else if (
        item.matadata.type === "date" &&
        customValue.value === ""
      ) {
        errorDiv.style.display = "block";
        errorCount++;
      }
    }

    if (errorCount === 0) {
      sessionStorage.setItem("customFieldstorage", JSON.stringify(customFieldValue));
      navigate("/preBooking/addOns");
    }
  };

  const handleInputKeyDown = (event) => {
    const pattern = /^[0-9\b]+$/;
    const mathSymbols = /[-+*/^()]/;
    const inputChar = String.fromCharCode(event.keyCode);

    if (!pattern.test(inputChar) || mathSymbols.test(inputChar)) {
      event.preventDefault();
    }
  };
  return (
    <>
      <div>
        <PreBookingBreadcrumb activeStep='1' />
        <form onSubmit={handleSubmit((data) => console.log("=============>", data))}>
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
                  </svg><span className='veritical-align-text-top ml-1'>{t("Renting Details")}</span></h6>
                  <div className="ui form px-4 px-sm-2">
                    <div className="field w-100 datePicker my-3">
                      <label className='fw-500 fs-7 mb-2' >{t("Move-In Date")}</label>
                      <SemanticDatepicker datePickerOnly clearable={false} placeholder='Select date' className='w-100' format='DD.MM.YYYY' clearOnSameDateClick={false} value={movinDate} maxDate={maxDate} onChange={movindateOnchange}
                        filterDate={
                          (date) => {
                            const semanticdate = new Date(date)
                            const now = new Date();
                            now.setDate(now.getDate() - 1);
                            return semanticdate >= now;
                          }}
                        showToday={false} />

                    </div>
                    {typeof invoice !== "undefined" && invoice !== null && invoice.length > 0 ?
                      <div className="field w-100  my-3">
                        <label className='fw-500 fs-7 mb-2'>{t("Invoice Period")}</label>
                        <Dropdown className='invoicePeriod' placeholder='Select Invoice Period' fluid selection options={invoice} value={invoice.value} defaultValue={invoiceDefault} onChange={invoiceOnchange} />
                      </div> : ""}
                    {typeof recurring !== "undefined" && recurring !== null && recurring.length > 0 ?
                      <div className="field w-100  my-3">
                        <label className='fw-500 fs-7 mb-2'>{t("Invoice Recurring")}</label>
                        <Dropdown className='inovice-recurring' placeholder='Select Invoice Recurring' fluid selection disabled={invoiceRecurringDisabled} options={recurring} value={invoiceRecurringDisabled === true ? 3 : recurring.value} defaultValue={invoiceRecurringDisabled === true ? 3 : Number(recurringvalue)} onChange={recurringOnchange} />
                      </div> : ""}
                    <div className="field w-100 datePicker my-3">
                      <label className='fw-500 fs-7 mb-2' >{t("Desired Move Out date")}</label>
                      <SemanticDatepicker format='DD.MM.YYYY' datePickerOnly placeholder='Select date' className='w-100' value={desiredMoveOutDate} filterDate={(date) => {
                        const now = new Date(movinDate);
                        now.setDate(now.getDate() + 1);
                        return date >= now;
                      }} onChange={DesiredMoveoutDateChange} showToday={false} />
                    </div>
                    {typeof customFieldAccess !== "undefined" && customFieldAccess !== null && customFieldAccess !== "" && customFieldAccess.length > 0 ?
                      customFieldAccess.map((item, index) => {
                        {

                          typeof Sdetails !== "undefined" && Sdetails !== null && Sdetails !== "" && Sdetails.length > 0 ?
                            Sdetails.forEach((data) => {
                              cusomfieldPhone = data.value.fid;
                            }) : ""

                        }

                        if (item.matadata.displayOn === "Unit specific details" && item.matadata.type === "textbox" && item.matadata.dataType === "Alphabet") {
                          return <div key={item.fieldId} className="field w-100 my-2 ">
                            <label className='fw-500 fs-7 mb-2'>{item.fieldName} {item.matadata.isMandatory ? <i className="text-danger ">*</i> : ""}
                            </label>
                            <input type='text' id={`${item.matadata.type}_${item.fieldId}`} placeholder={item.fieldName} data-name={item.fieldName} data-fieldid={item.fieldId} data-unitid={unitid} data-required={item.matadata.isMandatory} data-datatype={item.matadata.dataType} data-type={item.matadata.type} data-fieldpage={item.matadata.displayOn} onChange={(e) => customhandlechange(e)} onBlur={(e) => customfleldvalidate(e)} />
                            <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>{t("Required Field")}</div>
                            <div className="text-danger mt-1" id={item.matadata.dataType} style={{ display: 'none' }}>{t("It should allow Alphabet Only")}</div>
                          </div>

                        } else if (item.matadata.displayOn === "Unit specific details" && item.matadata.type === "textbox" && item.matadata.dataType === "Alphanumeric") {
                          return <div key={item.fieldId} className="field w-100 my-2 ">
                            <label className='fw-500 fs-7 mb-2'>{item.fieldName} {item.matadata.isMandatory ? <i className="text-danger ">*</i> : ""}
                            </label>
                            <input type='text' id={`${item.matadata.type}_${item.fieldId}`} placeholder={item.fieldName} value={item.fieldId === customFieldId ? customFieldValue : customInputFieldValue} data-name={item.fieldName} data-fieldid={item.fieldId} data-unitid={unitid} data-required={item.matadata.isMandatory} data-type={item.matadata.type} data-fieldpage={item.matadata.displayOn} onChange={(e) => customhandlechange(e)} onBlur={(e) => customfleldvalidate(e)} />
                            <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>{t("Required Field")}</div>
                          </div>

                        }

                        else if (item.matadata.displayOn === "Unit specific details" && item.matadata.type === "date") {
                          return <div key={item.fieldId} className='row'>
                            <div className="col-12">
                              <div className="field w-100 datePicker my-2">
                                <label className='fw-500 fs-7 mb-2'>{item.fieldName} {item.matadata.isMandatory ? <i className="text-danger ">*</i> : ""}</label>
                                <SemanticDatepicker datePickerOnly format='DD.MM.YYYY' id={`${item.matadata.type}_${item.fieldId}`} placeholder={item.fieldName} className='w-100' data-name={item.fieldName} fieldId={item.fieldId} unitId={unitid} required={item.matadata.isMandatory} fieldpage={item.matadata.displayOn} type={item.matadata.type} onChange={(e, data) => customhandlechange(e, data, "date")} />
                                <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>{t("Required Field")}</div>
                              </div>
                            </div>
                          </div>

                        }

                        else if (item.matadata.displayOn === "Unit specific details" && item.matadata.type === "checkboxes") {
                          return <div key={item.fieldId} className="col-12 my-2">
                            <span id={`${item.matadata.type}_${item.fieldId}`} >{item.fieldName} {item.matadata.isMandatory ? <i className="text-danger ">*</i> : ""}
                              <span className="mx-2">
                                <input id={`${item.matadata.type}_${item.fieldId}`} className="mr-1" type="checkbox" name={`${item.matadata.type}_${item.fieldId}`} data-name={item.fieldName} data-fieldid={item.fieldId} data-unitid={unitid} data-required={item.matadata.isMandatory} data-type={item.matadata.type} value={item.options[0].option} data-fieldpage={item.matadata.displayOn} onChange={(e) => customhandlechange(e)} />
                                <label>{item.options[0].option}</label>
                              </span>
                              <span>
                                <input id={`${item.matadata.type}_${item.fieldId}`} className="mr-1" type="checkbox" name={`${item.matadata.type}_${item.fieldId}`} data-name={item.fieldName} data-fieldid={item.fieldId} data-unitid={unitid} data-required={item.matadata.isMandatory} data-type={item.matadata.type} value={item.options[1].option} data-fieldpage={item.matadata.displayOn} onChange={(e) => customhandlechange(e)} />
                                <label>{item.options[1].option}</label>
                              </span>
                            </span>
                            <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>{t("Required Field")}</div>
                          </div>
                        }
                        else if (item.matadata.displayOn === "Unit specific details" && item.matadata.type === "textarea" && item.matadata.dataType === "Alphabet") {

                          return <div key={item.fieldId} className='row'>
                            <div className="col-12">
                              <div className="field w-100 my-2">
                                <label className='fw-500 fs-7 mb-2'>{item.fieldName} {item.matadata.isMandatory ? <i className="text-danger ">*</i> : ""}</label>
                                <textarea id={`${item.matadata.type}_${item.fieldId}`} placeholder={item.fieldName} data-name={item.fieldName} data-type={item.matadata.type} value={customInputFieldValue} rows="3" data-fieldid={item.fieldId} data-unitid={unitid} data-required={item.matadata.isMandatory} data-fieldpage={item.matadata.displayOn} onChange={(e) => customhandlechange(e)} onBlur={(e) => customfleldvalidate(e)}></textarea>
                                <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>{t("Required Field")}</div>
                              </div>
                            </div>
                          </div>
                        } else if (item.matadata.displayOn === "Unit specific details" && item.matadata.type === "textarea" && item.matadata.dataType === "Digits (0-9)") {
                          return <div key={item.fieldId} className='row'>
                            <div className="col-12">
                              <div className="field w-100 my-2">
                                <label className='fw-500 fs-7 mb-2'>{item.fieldName} {item.matadata.isMandatory ? <i className="text-danger ">*</i> : ""}</label>
                                <textarea onKeyDown={(e) => handleInputKeyDown(e)} id={`${item.matadata.type}_${item.fieldId}`} placeholder={item.fieldName} data-name={item.fieldName} data-type={item.matadata.type} value={customInputFieldValue} rows="3" data-fieldid={item.fieldId} data-unitid={unitid} data-required={item.matadata.isMandatory} data-fieldpage={item.matadata.displayOn} onChange={(e) => customhandlechange(e)} onBlur={(e) => customfleldvalidate(e)}></textarea>
                                <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>{t("Required Field")}</div>
                              </div>
                            </div>
                          </div>
                        }
                        else if (item.matadata.displayOn === "Unit specific details" && item.matadata.type === "checkbox") {

                          return <div key={item.fieldId} className='row mt-2'>
                            <div className="col-12">
                              <span id={`${item.matadata.type}_${item.fieldId}`}>
                                <span className="mx-0">
                                  <input className="mr-1" type="checkbox" name={`${item.matadata.type}_${item.fieldId}`} data-name={item.fieldName} data-fieldid={item.fieldId} data-unitid={unitid} data-required={item.matadata.isMandatory} data-type={item.matadata.type} value={item.fieldName} data-fieldpage={item.matadata.displayOn} onChange={(e) => customhandlechange(e)} onBlur={(e) => customfleldvalidate(e)} />
                                  <label>{item.fieldName}{item.matadata.isMandatory ? <i className="text-danger ">*</i> : ""}</label>
                                </span>
                              </span>
                              <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>{t("Required Field")}</div>
                            </div>
                          </div>

                        } else if (item.matadata.displayOn === "Unit specific details" && item.matadata.type === "textbox" && item.matadata.dataType === "Digits (0-9)") {

                          return <div key={item.fieldId} className="field w-100 my-2 ">
                            <label className='fw-500 fs-7 mb-2'>{item.fieldName} {item.matadata.isMandatory ? <i className="text-danger ">*</i> : ""}
                            </label>
                            <input type='number' onKeyDown={(e) => handleInputKeyDown(e)} id={`${item.matadata.type}_${item.fieldId}`} name={item.fieldId} placeholder={item.fieldName} value={cusomfieldPhone} data-name={item.fieldName} data-fieldid={item.fieldId} data-unitid={unitid} data-required={item.matadata.isMandatory} data-type={item.matadata.type} data-fieldpage={item.matadata.displayOn} onChange={(e) => customhandlechange(e)} onBlur={(e) => customfleldvalidate(e)} />
                            <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>{t("Required Field")}</div>
                          </div>


                        } else if (item.matadata.displayOn === "Unit specific details" && item.matadata.type === "radio") {
                          return <div key={item.fieldId} className="col-12 my-2">
                            <span id={`${item.matadata.type}_${item.fieldId}`}>{item.fieldName}{item.matadata.isMandatory ? <i className="text-danger ">*</i> : ""}
                              <span className="mx-2">
                                <input className="mr-1" id={`${item.matadata.type}_${item.fieldId}`} type="radio" name={`${item.matadata.type}_${item.fieldId}`} data-name={item.fieldName} data-fieldid={item.fieldId} data-unitid={unitid} data-required={item.matadata.isMandatory} data-type={item.matadata.type} value={item.options[0].option} data-fieldpage={item.matadata.displayOn} onChange={(e) => customhandlechange(e)} />
                                <label>{item.options[0].option}</label>
                              </span>
                              <span>
                                <input className="mr-1" id={`${item.matadata.type}_${item.fieldId}`} type="radio" name={`${item.matadata.type}_${item.fieldId}`} data-name={item.fieldName} data-fieldid={item.fieldId} data-unitid={unitid} data-required={item.matadata.isMandatory} data-type={item.matadata.type} value={item.options[1].option} data-fieldpage={item.matadata.displayOn} onChange={(e) => customhandlechange(e)} />
                                <label>{item.options[1].option}</label>
                              </span>
                            </span>
                            <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>{t("Required Field")}</div>
                          </div>
                        }
                      }) : ''}

                  </div>
                </div>

              </div>

              <ToastContainer />

              <Pricesummary ref={childRef} movinDate={movinDate} recurringid={recurringvalue} />

            </div>
            <div className='row'>
              <div className='col-12 text-center my-2'>
                <button onClick={() => navigate('/preBooking/units')} className="ui button  basic border-success-dark-1 fs-7 fw-400 text-dark px-5 mr-2">{t("BACK")}</button>
                <button className="ui button bg-success-dark   fs-7 fw-400 text-white px-5" type="submit" onClick={e => navigateAddon(e)}>{t("NEXT")}</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
