import React, { useState, useEffect } from 'react'
import PreBookingBreadcrumb from '../prebooking breadcrumb/PreBookingBreadcrumb'
import { Dropdown, Modal, Placeholder } from 'semantic-ui-react';
import { json, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 import { useTranslation } from "react-i18next";
import instance from '../../services/instance';
import request from '../../services/request';
import Helper from "../../helper";
import { forwardRef, useImperativeHandle, useRef } from 'react';
let helper = new Helper();
let storageTypeId;
const Pricesummary = forwardRef((props, ref) => {
  let invoiceData = JSON.parse(sessionStorage.getItem("invoiceData"));
  let recurringData = JSON.parse(sessionStorage.getItem("recurringData"));
  let BusinessUser =  JSON.parse(sessionStorage.getItem('isBussinessUser'));
  let promocheck = JSON.parse(sessionStorage.getItem('promoApplied'));
  const { t, i18n } = useTranslation();
  let promoAppliedsession;
  promoAppliedsession = sessionStorage.getItem("applypromo");
  useImperativeHandle(ref, () => ({
    unitInfodetailscall() {
      unitinfodetails();
    }

  }));

  const [PromoDiscount, setPromoDiscount] = useState();
  const [promoValidate, setPromoValidate] = useState('');
  const [validateMsg, setValidateMsg] = useState();
  const [unitInfoDetails, setUnitInfoDetails] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [movinDate, setMovinDate] = useState(new Date());
  const [promoOnchangebutton, setpromoOnchangebutton] = useState();
  const[promcodeError, setpromcodeError] = useState();

  let unitid = localStorage.getItem('unitid');
  const navigate = useNavigate()
  const [applyDiscountModal, SetApplyDiscountModal] = useState({
    open: false,
    dimmer: undefined,
  })


  useEffect(() => {
    unitinfodetails(true);
    let promoCodeGet = sessionStorage.getItem("applypromo");
    setpromoOnchangebutton(promoCodeGet);
  }, []);


  /** Unit Details Page Start **/

  const unitinfodetails = (initialCall) => {
    sessionStorage.setItem("moveindate", props.movinDate);
    if (promoAppliedsession) {
      setPromoValidate(promoAppliedsession);
      // applyCoupon();

    }
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let unitdetailsdata;
    unitdetailsdata = {
      units: [
        {
          commodity: {
            services: [],
            insurance: [],
            merchandise: []
          },
          id: unitid
        }
      ],
      moveInDate: helper.readDate(new Date(props.movinDate)),
      additionalMonths: 0,
      recurringPeriodId: invoiceData,
      recurringTypeId: recurringData,
      promocode: promoAppliedsession ? promoAppliedsession : promoValidate
    }


    instance
      .post(request.unit_info_by_id, unitdetailsdata, config)
      .then((response) => {
        const unit_info_data = response.data;
        if (typeof unit_info_data !== "undefined" && unit_info_data !== null && unit_info_data !== "") {
          const unit_infodetails = response.data.result;
          if (typeof unit_infodetails !== "undefined" && unit_infodetails !== null && unit_infodetails !== "") {
            setTotalAmount(unit_infodetails);
            const units_info = response.data.result.units;
            storageTypeId = units_info[0].unitInfo.storageType.id;
            if (typeof units_info !== "undefined" && units_info !== null && units_info.length > 0) {
              setUnitInfoDetails(units_info);
            }
            if (typeof initialCall !== 'undefined' && initialCall !== null && initialCall !== "" && initialCall === true) {
              promocodeRender();
            }
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });

  }

  /** Unit Details Page End **/

  /** Promo Code Discount Start */

  const promocodeRender = () => {

    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let promodiscountdata;

    promodiscountdata = {
      tenantTypeId: BusinessUser ? 2 : 1,
      unitIds: [unitid],
      period: invoiceData,
      visibility: 0,
      additionalMonths: 0,
      discountType: "PROMO",
      storageTypeId: storageTypeId,
      locationId: ""
    }

    instance

      .post(request.promo_discount, promodiscountdata, config)
      .then((response) => {
        const promodata = response.data;
        if (typeof promodata !== "undefined" && promodata !== null && promodata !== "") {
          const promoDiscounts = response.data.result;
          if (typeof promoDiscounts !== "undefined" && promoDiscounts !== null && promoDiscounts !== "") {
            setPromoDiscount(promoDiscounts);
          }

        }

      })
      .catch((error) => {
        console.log(error);
      });

  }

  /** Promo Code Discount End */
  const autoApplybtn = (promos) => {
    setPromoValidate(promos);
    SetApplyDiscountModal({ open: false });
  }

  const promoOnchange = () => {
    SetApplyDiscountModal({ open: true, dimmer: 'blurring' });
    // document.getElementById("promoInputbox").style.display = 'block';
    sessionStorage.setItem('promoApplied',false);
  }

  /**  Validate Promocode Discount Start **/

  const applyCoupon = () => {
    if(promoValidate.length === 0){

      setpromcodeError(`${t("Please Enter Promocode")}`)
      return

    } else{
      setpromcodeError("")
    }
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let validate_Promocodedata;

    validate_Promocodedata = {
      storageTypeId: storageTypeId,
      locationId: "",
      tenantTypeId: 3,
      promocode: promoValidate,
      period: invoiceData,
      visibility: 1,
      additionalMonths: 0
    }

    instance

      .post(request.validate_promocode, validate_Promocodedata, config)
      .then((response) => {
        const validatePromoMessage = response.data;
        setValidateMsg(validatePromoMessage);
        if (typeof validatePromoMessage !== "undefined" && validatePromoMessage !== null && validatePromoMessage !== "" && validatePromoMessage.returnMessage === "SUCCESS") {
          debugger
          toast.success('Promo Code Applied Successfully', {
            position: "top-right",
            autoClose: 3000,
            duration: 100,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          sessionStorage.setItem('promoApplied',true);

          document.getElementById("promoInputbox").style.display = 'none';

          if (typeof promoValidate !== "undefined" && promoValidate !== null && promoValidate !== "") {
              sessionStorage.setItem('applypromo', promoValidate);
          }

          let promoCodeGet = sessionStorage.getItem("applypromo");
          setpromoOnchangebutton(promoCodeGet);
        
        } else {

          toast.error('Invalid Promo Code', {
            position: "top-right",
            autoClose: 3000,
            duration: 100,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });

        }

      })
      .catch((error) => {
        console.log(error);
      });

    unitinfodetails();
  }


console.log(promoAppliedsession);
  
  /** Validate Promocode Discount End ***/

  return (
    <>
    <ToastContainer/>
      {typeof unitInfoDetails !== "undefined" && unitInfoDetails !== null && unitInfoDetails.length > 0 ?
        unitInfoDetails.map((item) => {
          return (<div key={item.unitInfo.id} className='col-12 col-md-5 pl-1 pl-sm-0 mb-3'>
            <div className='bg-white px-0 py-2 border-radius-15 border-top-success-4 card-boxshadow'>
              <h6 className='text-success-dark fw-600 fs-6 px-4 pt-2 mb-1  px-sm-2'>{t("Invoice Details")}</h6>
              <p className='px-4 mb-2 px-sm-2 fw-400 text-light-gray'>{t("Please see the breakdown below")}</p>
              <div className='px-4  px-sm-2'>
                <div className="py-2 card-border-secondary border-radius-10 mb-2">
                  <div className="content">
                    <p className='text-success-dark mb-1 fw-600 fs-6 px-1'>{item.unitInfo.storageType.name} - {item.unitInfo.unitNumber} ({item.unitInfo.unitMeasurement} {helper.measurementDisplayFormat(item.unitInfo.measurementType)}) </p>
                    <div className="text-dark fw-500 mb-2 px-1">{t("Payment Period")}: ({item.estimation.startsOn} to {item.estimation.endsOn})</div>
                    <div className='mb-2 d-flex px-1 justify-content-between text-light-gray fw-500'>
                      <span>{t("Rent for the payment period")}</span><span>{helper.displayCurrency(item.estimation.rentAmount)}</span>
                    </div>
                    {item.estimation.serviceCharges !== '' && item.estimation.serviceCharges > 0 ? <div className='mb-2 d-flex px-1 justify-content-between text-light-gray fw-500'>
                      <span>{t("Services")}</span><span>{helper.displayCurrency(item.estimation.serviceCharges)}</span>
                    </div> : ""}

                    <div className='mb-2 d-flex px-1 justify-content-between text-light-gray fw-500'>
                      <span>{t("Tax")} {(helper.displayPercent(item.unitInfo.taxPercentage))}</span><span >{helper.displayCurrency(item.estimation.taxAmount)}</span>
                    </div>
                    <div className='mb-2 d-flex px-1 justify-content-between text-light-gray fw-500'>
                      <span>{t("Total rent for the payment period")}</span><span >{helper.displayCurrency(item.estimation.netAmount)}</span>
                    </div>
                    <div className='mb-2 d-flex px-1 justify-content-between text-light-gray fw-500'>
                      <span>{t("Total Due")}</span><span >{helper.displayCurrency(item.estimation.grossAmount)}</span>
                    </div>



                    <div className='mb-2 d-flex px-1 justify-content-between text-light-gray fw-500'>
                      <p className='fs-6 fw-500 text-dark'>{t("Promo Code")}</p>
                    </div>
                    { !promocheck ?
                    <div className="field w-100 px-1 mt-3 mb-2" id ="promoInputbox">
                    <div className='row mt-1'>
                      <div className='col-9 ui input'>
                        <input placeholder={`${t("Enter the code")}`} className='border-bottom-only border-radius-0' value={promoValidate} onChange={e => setPromoValidate(e.target.value)} />
                      </div>
                      <div className='col-3 d-flex align-items-end justify-content-center'>
                        <button className='ui button bg-success-dark fs-8 fw-400 text-white py-1 px-2' onClick={applyCoupon}>{t("Apply")}</button>
                      </div>
                      <p className="error py-1 effective_from_date">{promcodeError}</p>
                    </div>
                  </div>:""

                    }
                    

                    <div className='mb-2 d-flex px-1 justify-content-between text-light-gray fw-500'>
                      <span className='veritical-align-text-bottom cursor-pointer usepromocode' onClick={() => SetApplyDiscountModal({ open: true, dimmer: 'blurring' })}> <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 22 22.938">
                        <g id="offer" transform="translate(-0.012 -0.021)">
                          <path id="Path_16041" data-name="Path 16041" d="M11.235,22.959h-.448A2.634,2.634,0,0,1,9.309,22.1c-.338-.348-.7-.674-1.044-1.014a.752.752,0,0,0-.674-.22c-.568.083-1.138.159-1.706.247A2,2,0,0,1,3.47,19.438q-.17-.844-.3-1.7a.893.893,0,0,0-.521-.725c-.507-.252-1.006-.523-1.5-.793a2,2,0,0,1-.9-2.763c.25-.525.5-1.048.768-1.566a.834.834,0,0,0,0-.811C.754,10.572.5,10.055.256,9.537a2.008,2.008,0,0,1,.915-2.793c.506-.272,1.011-.545,1.523-.805a.832.832,0,0,0,.472-.66q.133-.828.283-1.653A2,2,0,0,1,5.8,1.864c.571.065,1.139.151,1.706.244A.844.844,0,0,0,8.3,1.863c.411-.412.834-.814,1.255-1.216a2,2,0,0,1,2.906,0q.648.619,1.288,1.246a.772.772,0,0,0,.695.224c.568-.084,1.137-.163,1.705-.249a2,2,0,0,1,2.4,1.669c.116.569.212,1.144.3,1.719a.864.864,0,0,0,.495.693c.5.25.99.521,1.483.784a2.013,2.013,0,0,1,.919,2.842c-.241.5-.478.995-.73,1.485a.865.865,0,0,0,0,.852c.261.511.511,1.028.758,1.546a2,2,0,0,1-.9,2.764c-.511.278-1.024.553-1.543.815a.834.834,0,0,0-.476.657c-.089.552-.185,1.1-.283,1.653A2.009,2.009,0,0,1,16.2,21.115c-.57-.07-1.139-.153-1.706-.245a.827.827,0,0,0-.774.242c-.332.334-.684.646-1.011.984a2.631,2.631,0,0,1-1.477.862Zm4.851-15.8a.739.739,0,0,0-.72-.693.759.759,0,0,0-.541.275L6.258,15.307a1.225,1.225,0,0,0-.149.166.658.658,0,0,0,.525,1.038.793.793,0,0,0,.6-.306q3.775-3.778,7.552-7.553c.338-.338.684-.667,1.009-1.017a2.8,2.8,0,0,0,.295-.476ZM13.65,12.6A2.423,2.423,0,1,0,16.079,15,2.42,2.42,0,0,0,13.65,12.6ZM8.372,10.382A2.424,2.424,0,1,0,5.944,7.974a2.424,2.424,0,0,0,2.429,2.408Z" transform="translate(0 0)" fill="#67be5c" />
                          <path id="Path_16042" data-name="Path 16042" d="M224.734,249.857a1.093,1.093,0,0,1-1.106-1.082,1.1,1.1,0,1,1,2.2-.015A1.1,1.1,0,0,1,224.734,249.857Z" transform="translate(-211.069 -233.745)" fill="#67be5c" />
                          <path id="Path_16043" data-name="Path 16043" d="M131.451,123.107a1.1,1.1,0,1,1-2.2.006,1.1,1.1,0,0,1,2.2-.006Z" transform="translate(-121.987 -115.154)" fill="#67be5c" />
                        </g>
                      </svg> {t("Use Promocode")}</span> {typeof promoOnchangebutton !== "undefined" && promoOnchangebutton !== null && promoOnchangebutton !== "" && promoOnchangebutton ? <span className='text-danger text-right cursor-pointer' onClick={() => promoOnchange()}>Change</span> : ""}
                    </div>


                    {typeof promoOnchangebutton !=="undefined" && promoOnchangebutton !==null && promoOnchangebutton !=="" &&  typeof promoValidate !== "undefined" && promoValidate !== null && promoValidate !==""?
                      <p className='d-flex align-items-center px-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24.631 24.637">
                          <path id="tick" d="M-81.811-487.2h-1.443a1.331,1.331,0,0,0-.186-.04,11.727,11.727,0,0,1-5.374-1.695,12.155,12.155,0,0,1-5.844-8.462c-.086-.461-.129-.931-.192-1.4v-1.443c.015-.085.032-.17.045-.256.076-.529.121-1.067.234-1.59A11.963,11.963,0,0,1-90-509.286a11.957,11.957,0,0,1,10.054-2.258A11.885,11.885,0,0,1-72.774-507a11.977,11.977,0,0,1,2.491,8.722,11.9,11.9,0,0,1-3,6.884,12.1,12.1,0,0,1-7.124,4.007C-80.874-487.306-81.343-487.26-81.811-487.2Zm-2.642-10.284c-.453-.418-.906-.83-1.354-1.238-.679-.621-1.345-1.263-2.053-1.852a1.178,1.178,0,0,0-1.878.633,1.271,1.271,0,0,0,.445,1.314q2,1.812,3.984,3.624a1.231,1.231,0,0,0,1.887-.047q3.828-3.792,7.651-7.589a2.755,2.755,0,0,0,.2-.211,1.23,1.23,0,0,0,.269-1.01,1.23,1.23,0,0,0-.606-.852,1.244,1.244,0,0,0-1.585.286q-3.378,3.372-6.753,6.75c-.061.061-.125.12-.2.192Z" transform="translate(94.85 511.833)" fill="#67c84e" />
                        </svg>
                       <div className='d-flex px-1 justify-content-between w-100'> <span>{promoOnchangebutton} applied</span>  <span >{helper.displayCurrency(totalAmount.discount)}</span></div> 
                        
                      </p> : ""
                    }

                    {typeof totalAmount !== "undefined" && totalAmount !== null && typeof totalAmount.netAmount !== "undefined" && totalAmount.netAmount !== null ?
                      <div className='mb-2 mt-3 d-flex px-1 justify-content-between text-light-gray fw-500'>
                        <span>{t("Net Amount")}</span><span >{helper.displayCurrency(totalAmount.netAmount)}</span>
                      </div> : ''}

                    {typeof totalAmount !== "undefined" && totalAmount !== null && typeof totalAmount.discount !== "undefined" && totalAmount.discount !== null && totalAmount.discount > 0 ?
                      <div className='mb-2 d-flex px-1 justify-content-between text-light-gray fw-500'>
                        <span>{t("Discount")}</span><span > - {helper.displayCurrency(totalAmount.discount)}</span>
                      </div> : ''}

                    <div className='fw-700 px-1 d-flex justify-content-between'>
                      <span>{t("Total")}</span><span >{helper.displayCurrency(item.estimation.grossAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>);

        }) :
        <div className='bg-white px-0 py-2 border-radius-15 border-top-success-4 card-boxshadow p-5' style={{ width: "465px", height: "500px" }}>
          <Placeholder fluid className=''>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
            <Placeholder.Paragraph>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
          </Placeholder>
        </div>
        // <div className="ui active pricesummaryLoader centered inline loader"></div>
      }



      <Modal
        dimmer={applyDiscountModal.dimmer}
        open={applyDiscountModal.open}
        onClose={() => SetApplyDiscountModal({ open: false })} >
        <Modal.Header className='bg-success-dark text-white text-center fs-6 py-2 fw-400 position-relative'>{t("PROMO CODES")}

          <svg onClick={() => SetApplyDiscountModal({ open: false })} className='r-3 cursor-pointer position-absolute' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 17.473 17.47">
            <path id="wrong-5" d="M978.609-438.353l-2.052-2.043-4.37-4.366a1.33,1.33,0,0,1-.4-1.425,1.3,1.3,0,0,1,.833-.843,1.3,1.3,0,0,1,1.171.183,3.019,3.019,0,0,1,.353.321q3.009,3,6.009,6.01c.088.088.159.193.254.309.127-.118.217-.2.3-.281l6.156-6.156a1.332,1.332,0,0,1,1.325-.431,1.3,1.3,0,0,1,.927.828,1.3,1.3,0,0,1-.188,1.228,3.412,3.412,0,0,1-.325.35q-3,3.009-6.011,6.009a3.233,3.233,0,0,1-.317.244c.132.14.213.23.3.316q3.052,3.053,6.108,6.1a1.36,1.36,0,0,1,.441,1.387,1.305,1.305,0,0,1-2.205.564c-.59-.568-1.163-1.157-1.74-1.736l-4.487-4.491a2.068,2.068,0,0,1-.183-.248l-.142-.051a1.52,1.52,0,0,1-.191.325q-3.047,3.059-6.1,6.111a1.341,1.341,0,0,1-1.45.419,1.3,1.3,0,0,1-.851-.866,1.3,1.3,0,0,1,.235-1.19,3.215,3.215,0,0,1,.257-.274l6.034-6.033C978.386-438.167,978.484-438.245,978.609-438.353Z" transform="translate(-971.716 447.116)" fill="#fff" />
          </svg>


        </Modal.Header>
        <Modal.Content className='mh-400 overflow-y-auto'>
          <div className='row'>
            {typeof PromoDiscount !== "undefined" && PromoDiscount !== null ?
              PromoDiscount.map((item) => {
                return <div key={item.id} className='col-12 col-md-6 mb-3 px-1'>
                  <div className='card-border-secondary-dashed p-2 border-radius-10'>
                    <div className='row'>
                      <div className='col-sm-12 col-md-9 mb-1'>
                        <h5 className='fw-600 mb-1'>{item.name}</h5>
                        <p className='fs-7'>{item.description}</p>
                      </div>
                      <div className='col-sm-12 col-md-3 d-flex align-items-center justify-content-center'>
                        <button className="ui button text-success bg-white border-success-1  fs-7 fw-400 py-1 px-3" onClick={() => autoApplybtn(item.promotionalDiscount.promoCode)}>Add</button>
                      </div>
                    </div>
                  </div>
                </div>
              }) : <div className='d-flex align-items-center justify-content-center mx-auto'>{t("No Promo Codes Available")} </div>}
          </div>
        </Modal.Content>
      </Modal>
    </>
  )
});


Pricesummary.displayName = "Pricesummary";

export default Pricesummary;


