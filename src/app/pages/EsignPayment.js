import React, { useState } from 'react'
import { useEffect } from 'react';
import { json, useNavigate, } from 'react-router-dom';
import PreBookingBreadcrumb from '../components/prebooking breadcrumb/PreBookingBreadcrumb';
import instance from '../services/instance';
import request from '../services/request';
import Helper from "../helper";
import PDFMerger from 'pdf-merger-js/browser';
import ModalComponent from '../components/modal/ModalComponent';
import { Modal, Button, Loader, Placeholder, Segment } from 'semantic-ui-react';
import parse from "html-react-parser";
let helper = new Helper();
let unitDetailRespones = {};
export default function EsignPayment() {
  const [unitdetail, setUnitdetail] = useState();
  let unitid = localStorage.getItem('unitid');
  let userid = localStorage.getItem('userid');
  let leaseProfileIdValue = sessionStorage.getItem('leaseProfileid');
  let insuranceArray = [];
  let merchandiseArray = [];
  let servicesArray = [];
  let taxpecentage
  let getMoveindate = sessionStorage.getItem('moveindate');
  let getRecurringPeriodId = sessionStorage.getItem('invoiceData');
  let getRecurringTypeid = sessionStorage.getItem('recurringData');
  let insuranceDetail = JSON.parse(sessionStorage.getItem('insurancedetail'));
  let merchandiseItem = JSON.parse(sessionStorage.getItem('merchandiseItem'));
  let servicesDetail = JSON.parse(sessionStorage.getItem('servicedetail'));
  let facilityaddress = JSON.parse(sessionStorage.getItem('facilityaddress'));
  let checkPaymentModes = JSON.parse(sessionStorage.getItem('configdata')).paymentModes;
  let promoAppliedsession = sessionStorage.getItem("applypromo");
  let makeSavedCardMandatory = JSON.parse(sessionStorage.getItem('configdata')).culture.isSavedCardsByDefault;
  let tenantInfo = JSON.parse(sessionStorage.getItem('tenantInfo'));
  let desiredMoveOutDate = sessionStorage.getItem("desiredMoveoutDate");
  let BusinessUser = JSON.parse(sessionStorage.getItem('isBussinessUser'));
  let thirtparty = JSON.parse(sessionStorage.getItem('thirdpartyinsurance'));
  const [saveAgreement, setSaveAgreement] = useState();
  const [PaymentModal, setpaymentModal] = useState({ open: false, dimmer: undefined, })
  const [mondelcontent, setModelcontent] = useState(`<div className="ui active centered inline loader"></div>`);
  const [totalAmount, settotalAmount] = useState(0);
  const [paylaterButton, setPaylaterButton] = useState(false);
  const [OpenPaylaterModal, setPayLaterModal] = useState(false);
  const [paymentLoader, setPaymentLoader] = useState(true);
  const [isLoading, setLoader] = useState(false);
  const [businessName, setbusinessName] = useState();
  const [isSignatureVerified, setisSignatureVerified] = useState(false);
  const [saveCard, setSavecard] = useState(true);
  const [autoPayEnabled, setAutopayEnabled] = useState(true);
  const [iFrameResponse, setIframeRespones] = useState(false);
  const [paymentModeId, setpaymentModeId] = useState('');

  if (insuranceDetail !== null && insuranceDetail.length > 0) {

    insuranceDetail.forEach(element => {

      element.insurancePlans ? insuranceArray.push(element.insurancePlans) : insuranceArray = [];


    });

  }

  if (merchandiseItem !== null && merchandiseItem.length > 0) {
    merchandiseItem.forEach((element) => {
      element.merchandise.forEach((element) => {
        if (element.qnty > 0) {
          merchandiseArray.push({ id: element.itemId, quantity: element.qnty })
        }
      })
    })
  }
  if (servicesDetail !== null && servicesDetail.length > 0) {

    servicesDetail.forEach((element) => {
      servicesArray.push(element.servicedId);
    })
  }

  const navigate = useNavigate();
  const [esignMethod, setEsignMethod] = useState(false);
  const esignMethodHandler = () => {
    setEsignMethod(!esignMethod);
  }
  const ThankYou = (e) => {
    e.preventDefault();
    navigate('/preBooking/thankyou')
  }

  const ReceiveIframeResponseForRbn = (event) => {
    if (event.data.message !== null && typeof event.data.message !== 'undefined') {
      const data = JSON.parse(event.data.message);
      setIframeRespones(data);
    }
  };

  useEffect(() => {
    console.log(makeSavedCardMandatory);
    unitInfoDetails();
    getSitedetail();
    const ReceiveIframeResponse = (event) => {
      if (event.data.message !== null && typeof event.data.message !== 'undefined') {
        const data = JSON.parse(event.data.message);
        if (typeof data !== 'undefined' && data !== null && data !== '') {
          onPaymentProcessed(data)
        }
      }
    };


    window.addEventListener("message", ReceiveIframeResponseForRbn);
    window.addEventListener("message", ReceiveIframeResponse);

    return () => window.removeEventListener("message", ReceiveIframeResponse)

  }, [window.removeEventListener("message", ReceiveIframeResponseForRbn)]);

  //get Unit detail
  const unitInfoDetails = () => {
    setLoader(true)
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
            services: servicesArray,
            insurance: insuranceArray,
            merchandise: merchandiseArray
          },
          id: unitid
        }
      ],
      moveInDate: new Date(getMoveindate),
      additionalMonths: 0,
      recurringPeriodId: getRecurringPeriodId,
      recurringTypeId: getRecurringTypeid,
      promocode: promoAppliedsession ? promoAppliedsession : ""
    }
    instance
      .post(request.unit_info_by_id, unitdetailsdata, config)
      .then((response) => {
        const unit_info_data = response.data;
        if (typeof unit_info_data !== "undefined" && unit_info_data !== null && unit_info_data !== "") {
          unitDetailRespones = unit_info_data.result;
          setUnitdetail(unit_info_data.result);
          settotalAmount(unit_info_data.result.grossAmount);
          previewLeaseAgreement(leaseProfileIdValue, unit_info_data.result);
        }
        setLoader(false)

      })
      .catch((error) => {
        console.log(error);
      });

  }

  function getSitedetail() {

    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    instance
      .get(request.getsitedetail, config)
      .then(response => {
        if (response.data.result) {
          setbusinessName(response.data.result.businessName);
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  //preview Leaseagreement
  function previewLeaseAgreement(leaseProfileId, unitinfo) {

    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let data = {
      units: unitinfo,
    }

    instance
      .post(request.lease_agreement + `/${leaseProfileId}`, unitinfo, config)
      .then((response) => {
        if (response.data.result.saveAgreement) {
          setSaveAgreement(response.data.result);

        }else{
          setSaveAgreement([]);

        }

      })
      .catch((error) => {
        console.log(error);
      });

  }

  function onPaymentProcessed(paymentresponse) {
    if (typeof paymentresponse !== 'undefined' && paymentresponse !== null && paymentresponse !== '' && typeof paymentresponse.paymentStatus !== 'undefined' && paymentresponse.paymentStatus !== '' && paymentresponse.paymentStatus !== null && paymentresponse.paymentStatus.toUpperCase() === "SUCCESS") {

      saveMoveinDetails(paymentresponse, leaseProfileIdValue, false)
    }

  }

  const loadPaymentForm = (id, leaseProfileId) => {
    setpaymentModal({ open: true });

    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let paymentFormRequest = {
      chargeableAmount: totalAmount,
      paymentModeId: id
    }
    setpaymentModeId(id);
    instance
      .post(request.movein_paymentform + `/${leaseProfileId}`, paymentFormRequest, config)
      .then((response) => {
        if (response.data.result) {
          setModelcontent(`
        <div className='row'>
        <div className='col-12 col-md-12 mb-3 px-1 min-h-400'>
          <iframe id="iframePreviewLicense"  scrolling="auto" type='application/pdf' loading="lazy" src="${response.data.result}" style="width:100%;height:100%;"></iframe>
        </div>
        </div>`)

          
          setPaymentLoader(false);
        }
        
      })
      .catch((error) => {
        console.log(error);
      });

  }
  const saveMoveinDetails = (cardResponse, leaseprofileid, paylater) => {

    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    unitDetailRespones['userId'] = userid;
    if (typeof cardResponse !== 'undefined' && cardResponse !== null && cardResponse !== '') {
      unitDetailRespones['paymentTransactionResponse'] = cardResponse;
    }
    if (desiredMoveOutDate !== 'null' && desiredMoveOutDate !== null && desiredMoveOutDate !== 'undefined') {
      unitDetailRespones.units[0]['desiredMoveOutDate'] = helper.readDate(new Date(desiredMoveOutDate));
    }
    unitDetailRespones['isBusinessUser'] = BusinessUser;
    unitDetailRespones['payLater'] = paylater;
    unitDetailRespones['saveCard'] = saveCard;
    unitDetailRespones['enableAutopay'] = autoPayEnabled;
    if (paymentModeId !== '') {
      unitDetailRespones['paymentModeId'] = paymentModeId;
    }
    if (thirtparty) {
      insuranceDetail.forEach((element) => {
        unitDetailRespones.units[0]['insuranceInfo'] = element['insuranceInfo'];
      })

    }

    instance
      .post(request.save_move + `/${leaseprofileid}`, unitDetailRespones, config)
      .then((response) => {
        console.log(response);
        if (response.data.isSuccess) {
          sessionStorage.removeItem('leaseProfileid');
          sessionStorage.removeItem('insurancedetail');
          sessionStorage.removeItem('vehicleDetail');
          sessionStorage.removeItem('merchandiseItem');
          navigate('/preBooking/thankyou')
        } else {
          alert('something went wrong')
        }

      })
      .catch((error) => {
        console.log(error);
      });


  }

  const payLater = (value) => {
    setPaylaterButton(true);
    setPayLaterModal(true);

  }
  const changeSavedCard = (e) => {
    if (e.target.checked) {
      setSavecard(true);
    } else {
      setSavecard(false);
      setAutopayEnabled(false);
    }
  }
  const changeAutoPayEnabled = (e) => {
    if (e.target.checked) {
      setAutopayEnabled(true);
      setSavecard(true);
    } else {
      setAutopayEnabled(false);
    }
  }

  const payNow = (value) => {
    setPaylaterButton(false)
  }

  return (
    <>
      {isLoading ? (
        <Loader size='large' active>Loading</Loader>
      ) : (<div>
        <PreBookingBreadcrumb activeStep='1234' />
        <div className="esign">
          <div className="ui container">
            {typeof unitdetail !== 'undefined' && unitdetail !== null ?
              <div className="bg-white card-boxShadow px-2 px-sm-1 py-3 border-radius-10 mb-4">
                {unitdetail.units.map((item) => {
                  let unitTypeName = item.unitInfo.unitType.name;
                  let unitMeasurement = item.unitInfo.unitMeasurement;
                  let measurementType =
                    typeof item.unitInfo.measurementType !== "undefined" &&
                      item.unitInfo.measurementType !== null
                      ? helper.measurementDisplayFormat(item.unitInfo.measurementType)
                      : "";
                  let unitNumber = item.unitInfo.unitNumber;
                  let storageType = item.unitInfo.storageType.name;
                  let location = item.unitInfo.location.name;
                  let building = item.unitInfo.building.name;
                  let amenitiy = item.unitInfo.amenityInfoList;
                  item.unitInfo.taxes !== null && item.unitInfo.taxes.length > 0 && item.unitInfo.taxes.forEach((i) => {
                    taxpecentage = i.value
                  })
                  return <div key='' className="row">
                    <div className="col-lg-3 col-md-3 col-12 px-1">
                      <div className="card-img h-100">
                        {item.unitInfo.imageUrl !== '' && item.unitInfo.imageUrl !== null ?
                          <img className="w-100 h-100 border-radius-10" src={item.unitInfo.imageUrl} alt="Container" />
                          : <img className="w-100 h-100 border-radius-10" src="/assets/images/Minilager-Container.png" alt="Container" />
                        }

                      </div>
                    </div>
                    <div className="col-lg-5 col-md-5 col-12 px-1">
                      <div className="card-desc card-bg-secondary p-2 border-radius-10 mt-sm-2 mb-sm-2">
                        <h2 className="fs-4 fw-700 mb-2">{storageType}-{unitNumber}</h2>
                        <div className="pb-1 d-flex align-items-center"><img src='/assets/images/selfstorage.svg' alt='Self Storage' /><span className='ml-1'>{unitTypeName} - <strong className="fw-700">{unitMeasurement}</strong>({measurementType})</span></div>
                        <div className='d-flex align-items-center'><img src='/assets/images/location-new.svg' alt='Self Storage' /><span className='ml-1'>{building},{location}</span></div>
                        {amenitiy !== null ?
                          <div className='d-flex flex-wrap esign-amenitiy mt-2'>
                            {
                              amenitiy.map(e => {

                                return <div key={e.amenityId} className='d-flex align-items-center my-1 mr-2'>
                                  <img src={e.imageUrl} style={{ width: "15px", height: "15px" }} />
                                  <span className="ml-1">{e.name}</span>
                                </div>

                              })
                            }

                          </div>
                          : ''
                        }
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12 px-1">
                      <div className="card-details">
                        <div className="mb-2">
                          <h6 className="fs-6 fw-400 text-success mb-1">Personal Details</h6>
                          <p className="mb-1">{tenantInfo.firstName} {tenantInfo.lastName}</p>
                          <p className="mb-1">{tenantInfo.email}</p>
                          <p className="mb-1">{tenantInfo.phoneNumber}</p>
                        </div>
                        {facilityaddress !== null && typeof facilityaddress !== 'undefined' ?
                          <div>
                            <h6 className="fs-6 fw-400 text-success mb-1">Facility Address</h6>
                            <p>{facilityaddress.addressLine1} {facilityaddress.city} {facilityaddress.state} <br />{facilityaddress.zipCode}</p>

                          </div>
                          : ""
                        }
                      </div>
                    </div>
                  </div>

                })


                }
              </div>
              : <div className="bg-white card-boxShadow px-2 px-sm-1 py-3 border-radius-10 mb-4 min-h-150">
                <div className="ui active centered inline loader"></div>

              </div>


            }
            <div className='row'>
              <div className='col-12 col-md-7 pr-1 pr-sm-0 mb-3'>
                <div className='bg-white card-boxShadow px-0 py-2 border-radius-15'>
                  <h6 className='card-border-bottom text-dark fw-500 fs-6 px-4 py-2 px-sm-2'>
                    <svg id="E-sign" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 39.948 40.031">
                      <path id="Path_15973" data-name="Path 15973" d="M0,20.026V2.192A1.994,1.994,0,0,1,2.155,0q13.151,0,26.3,0A1.966,1.966,0,0,1,30.664,2.2q.006,5.91,0,11.819c0,.494.143,1.137-.642,1.145-.827.008-.7-.681-.7-1.185-.015-3.754-.008-7.506-.008-11.26,0-.232.067-.513-.038-.687A2.071,2.071,0,0,0,28.6,1.4c-.134-.084-.364-.02-.551-.02H2.587c-1.162,0-1.211.05-1.211,1.236v34.83c0,1.136.055,1.19,1.183,1.19H28.093c1.133,0,1.218-.087,1.22-1.241q0-2.658,0-5.316c0-.232.017-.466.031-.7.027-.436.241-.722.7-.7s.629.32.628.761c-.007,1.445,0,2.891,0,4.336,0,.79.017,1.582-.011,2.372a2.1,2.1,0,0,1-2.112,1.884c-8.79-.041-17.581-.024-26.373-.024A1.983,1.983,0,0,1,0,37.86Q0,28.944,0,20.026Z" transform="translate(0 -0.003)" fill="#328128" />
                      <path id="Path_15974" data-name="Path 15974" d="M131.408,63.064c-.413-.407-1.158-.55-.738-1.285.436-.765.969-.123,1.5-.039.484-.818.936-1.66,1.469-2.445.193-.284.59-.427.88-.652a2.454,2.454,0,0,0,.52-.492,2.047,2.047,0,0,1,2.28-.957,1.873,1.873,0,0,1,1.3,2.638c-.131.449-.4.855-.116,1.379.1.182-.106.572-.246.828-.446.814-.926,1.61-1.385,2.4.041.07.053.123.087.147,1.636,1.117,1.818,1.887.832,3.614-.692,1.213-1.394,2.421-2.094,3.629-.263.456-.558.992-1.176.627-.634-.375-.248-.9,0-1.336.734-1.3,1.494-2.578,2.227-3.875.466-.824.364-1.062-.622-1.471l-1.489,2.571c-1.235,2.136-2.392,4.322-3.727,6.391a64.667,64.667,0,0,1-3.889,5.281c-.33.413-1.028.53-1.554.789a3.528,3.528,0,0,0-.912.487,14.608,14.608,0,0,0-.969,1.19c-.934,1.112-2,.957-2.6-.373-.085-.19-.165-.385-.248-.576-.05.008-.109,0-.126.024a1.475,1.475,0,0,1-1.787.724c-.778-.252-.838-.9-.888-1.576a6.249,6.249,0,0,0-.341-1.729l-1.162,3.443a2.781,2.781,0,0,1-.337.906c-.185.221-.6.471-.8.4a1.026,1.026,0,0,1-.431-.8,3,3,0,0,1,.287-1c.418-1.257.832-2.516,1.262-3.768a1.324,1.324,0,0,1,1.5-1.069c.685.069,1.094.547,1.187,1.41.077.709.14,1.42.215,2.182,1.415-1.275,1.954-1.092,3.075,1.011.41-.5.825-.969,1.179-1.477a.8.8,0,0,0,.024-.631,2.147,2.147,0,0,1,.176-1.874,9.475,9.475,0,0,0,.814-1.772,36.355,36.355,0,0,1,3.6-7.309c1.081-1.848,2.143-3.706,3.22-5.571Zm1.255.642c-1.776,3.075-3.526,6.108-5.3,9.189l2.263,1.312c1.783-3.091,3.534-6.126,5.3-9.193Zm2-3.46c-.45.778-.867,1.5-1.309,2.261l2.267,1.3c.457-.794.87-1.509,1.3-2.257l-2.259-1.3Zm-7.878,13.917c-.176.462-.331.87-.487,1.278a1.362,1.362,0,0,0,.862,1.908c.536-.648,1.078-1.3,1.66-2.008l-2.036-1.178Zm10.372-14.1a4.531,4.531,0,0,0,.176-1.159.706.706,0,0,0-.592-.333,4.711,4.711,0,0,0-.919.755ZM125.165,77.866a4.943,4.943,0,0,0-.158,1.187c.015.134.467.375.6.312a4.378,4.378,0,0,0,.87-.74l-1.31-.761Z" transform="translate(-98.799 -49.134)" fill="#328128" />
                      <path id="Path_15975" data-name="Path 15975" d="M44.265,29.863v1.3h.849q7.45,0,14.9,0a2.218,2.218,0,0,1,.9.073,1.079,1.079,0,0,1,.552.634c.092.418-.213.627-.628.639-.164,0-.326.006-.49.006H43.976c-1.039,0-1.134-.092-1.143-1.1-.006-.653-.011-1.306,0-1.958.017-.766.19-.943.968-.947,2.1-.01,4.2,0,6.295,0q5.037,0,10.073,0a2.145,2.145,0,0,1,.891.092.805.805,0,0,1,.39.618.871.871,0,0,1-.443.59,1.771,1.771,0,0,1-.757.048q-7.554,0-15.109,0h-.877Z" transform="translate(-36.838 -24.522)" fill="#328128" />
                      <path id="Path_15976" data-name="Path 15976" d="M24.717,197.271a5.676,5.676,0,1,1,2.807-10.565,2.4,2.4,0,0,1,.238.145c.355.278.765.568.443,1.087s-.776.327-1.159.081a4.329,4.329,0,0,0-6.666,4.324,4.4,4.4,0,0,0,4.536,3.552,4.3,4.3,0,0,0,4-3.88c.017-.185-.014-.424.09-.54.192-.217.478-.513.7-.492a.841.841,0,0,1,.569.61,6.124,6.124,0,0,1-.262,1.845,5.639,5.639,0,0,1-5.3,3.833Z" transform="translate(-16.309 -159.92)" fill="#328128" />
                      <path id="Path_15977" data-name="Path 15977" d="M84.493,101.3H77.782c-.186,0-.42.063-.548-.024-.257-.176-.629-.432-.634-.663s.373-.48.624-.666c.106-.08.316-.021.48-.021h13.7c.186,0,.422-.06.548.029.239.169.573.427.575.649s-.324.492-.566.655c-.148.1-.407.041-.617.041q-3.426,0-6.852,0Z" transform="translate(-65.887 -85.93)" fill="#328128" />
                      <path id="Path_15978" data-name="Path 15978" d="M40.753,129.926q-3.21,0-6.421,0c-.474,0-.945-.1-.952-.681s.459-.7.936-.7q6.357-.006,12.714,0c.092,0,.185.014.278.022.452.041.765.221.724.737-.038.487-.369.589-.785.592-1.536.011-3.071.032-4.608.046-.628.006-1.257,0-1.887,0Z" transform="translate(-28.711 -110.564)" fill="#328128" />
                      <path id="Path_15979" data-name="Path 15979" d="M64.831,66.77h6.145a1.505,1.505,0,0,1,.685.053.9.9,0,0,1,.459.579.821.821,0,0,1-.411.613,2.12,2.12,0,0,1-.889.1q-6.006.008-12.012,0a1.574,1.574,0,0,1-.752-.073c-.235-.141-.536-.446-.519-.656a.86.86,0,0,1,.594-.587,18.288,18.288,0,0,1,2.092-.034h4.61Z" transform="translate(-49.488 -57.419)" fill="#328128" />
                      <path id="Path_15980" data-name="Path 15980" d="M37.373,153.9H34.3c-.484,0-.931-.112-.913-.7.017-.537.435-.65.9-.649,2.073,0,4.144,0,6.217,0,.452,0,.87.087.869.662,0,.554-.386.687-.853.687H37.374Z" transform="translate(-28.717 -131.215)" fill="#328128" />
                      <path id="Path_15981" data-name="Path 15981" d="M42.479,215.175c.723-.744,1.386-1.431,2.057-2.11.331-.336.726-.608,1.151-.208s.148.817-.169,1.148c-.66.689-1.322,1.38-2.018,2.034a1.317,1.317,0,0,1-2.041,0c-.449-.406-.87-.843-1.289-1.28-.315-.327-.434-.764-.024-1.018a1.269,1.269,0,0,1,.979.067c.257.108.436.407.648.625s.414.434.708.741Z" transform="translate(-34.306 -182.916)" fill="#328128" />
                      <path id="Path_15982" data-name="Path 15982" d="M150.912,130.038c-.743,0-1.487,0-2.231,0-.432,0-.726-.155-.748-.629s.273-.687.694-.689c1.534-.014,3.067-.008,4.6,0a.624.624,0,0,1,.685.706c-.024.452-.336.62-.772.613-.743-.011-1.487,0-2.231,0Z" transform="translate(-127.242 -110.71)" fill="#328128" />
                      <path id="Path_15983" data-name="Path 15983" d="M103.106,152.536c.745,0,1.491-.007,2.235,0,.413.006.745.154.765.629.022.517-.317.7-.761.7q-2.234.019-4.47,0c-.448,0-.787-.193-.769-.7.017-.467.348-.631.764-.636.745-.01,1.491,0,2.235,0Z" transform="translate(-86.105 -131.2)" fill="#328128" />
                    </svg>
                    <span className='veritical-align-text-top ml-1'>Rental Agreement</span>
                  </h6>
                  <div className='p-3 px-sm-1'>
                    {saveAgreement && saveAgreement.previewLease ?
                      saveAgreement.previewLease.map((item) => {
                        return item.leaseFilePath.map((url) => {
                          return < div key="" className='card-bg-secondary w-100 px-2 py-2 mb-6' >
                            <iframe key="" src={url} style={{ width: "100%" }} />
                            <div className="text-center mt-4">
                              <a className="ui button bg-white text-success-dark border-success-dark-1 fs-7 fw-400 text-dark px-5 mr-2 mb-sm-1" href={url} target="_blank" rel="noreferrer" >Preview</a>
                            </div>
                          </div>
                        });
                      }
                      
                      )
                      : 
                      < div key="" className='card-bg-secondary w-100 px-2 py-2 mb-6' >
                            
                            <div className="text-center mt-4">
                             No document found
                            </div>
                          </div>
                      // <Segment raised>
                      //   <Placeholder>
                      //     <Placeholder.Header image>
                      //       <Placeholder.Line />
                      //       <Placeholder.Line />
                      //     </Placeholder.Header>
                      //     <Placeholder.Paragraph>
                      //       <Placeholder.Line length='medium' />
                      //       <Placeholder.Line length='short' />
                      //     </Placeholder.Paragraph>
                      //   </Placeholder></Segment>

                    }
                    <div className='row mt-2'>
                      <div className='col-lg-6 col-md-12 col-sm-12'>
                        <div className='card-border border-radius-5 mr-2 mr-md-0 mb-md-1'>
                          <h6 className='card-bg-secondary p-2 text-success-dark fs-6'>INITIATOR</h6>
                          <div className='py-2 px-1'>
                            <p className='fw-600 fs-6 mb-1'>{businessName}</p>
                            <p>Non Signatory Party</p>
                          </div>
                        </div>
                      </div>
                      <div className='col-lg-6 col-md-12 col-sm-12'>
                        <div className='card-border border-radius-5 ml-2 ml-md-0'>
                          <h6 className='card-bg-secondary p-2 text-success-dark fs-6'>INITIATOR</h6>
                          <div className='py-2 px-1'>
                            <p className='fw-600 fs-6 mb-1'>{tenantInfo.firstName} {tenantInfo.lastName}</p>
                            <p>Non Signatory Party</p>
                          </div>
                        </div>
                      </div>
                      <div className='d-flex mt-2 align-items-start'>
                        <input onClick={esignMethodHandler} type="checkbox" />
                        <label className='ml-1'>I have read and understood the contents of the documents listed and I am ready to sign</label>
                      </div>
                    </div>
                    { esignMethod && <div className='pt-4'>
                      <div className='d-flex justify-content-between flex-wrap bg-primary-light p-1 border-success-dark-1 border-radius-5'>
                        <p className='d-flex align-items-center'><img src='/assets/images/esign.svg' alt='Esign' /><span className='ml-1'>Great! You have successfully signed the documents</span></p>
                        <button className="ui button text-success-dark bg-white card-border fs-7 fw-400 text-dark px-1 mr-2 mt-md-1">View Document</button>
                      </div>
                      <div className={`pt-4 d-flex justify-content-center flex-wrap}`}>

                        {paylaterButton === true ?
                          <button className="ui button bg-white d-flex align-items-center border-radius-5 card-border fs-6 fw-400 text-dark px-5 ml-2 px-md-2 ml-sm-0 mb-sm-1" onClick={(e) => payNow(e)} ><img src='/assets/images/executed-payment.svg' alt='Pay Now' id="paynow" /><span className='ml-1' onClick={(e) => payNow(e)}>Pay Now</span></button>
                          :
                          <button className="ui button bg-success-dark d-flex align-items-center border-radius-5 fs-6 fw-100 text-white px-5 px-md-2 mb-sm-1" onClick={(e) => payNow(e)}><img className='executed-img' src='/assets/images/executed-payment.svg' alt='Pay Now' id="paynow" /><span className='ml-1' onClick={(e) => payNow(e)} >Pay Now</span></button>

                        }
                        {paylaterButton ?
                          <button className="ui button bg-success-dark d-flex align-items-center border-radius-5 card-border fs-6 fw-400 text-white px-5 ml-2 px-md-2 ml-sm-0 mb-sm-1" onClick={(e) => payLater(e)} ><img src='/assets/images/pay.svg' alt='Pay Later' id="paylater" /><span className='ml-1' onClick={(e) => payLater(e)}>Pay Later</span></button>
                          :
                          <button className="ui button bg-white d-flex align-items-center border-radius-5 card-border fs-6 fw-400 text-dark px-5 ml-2 px-md-2 ml-sm-0 mb-sm-1" onClick={(e) => payLater(e)} ><img src='/assets/images/pay.svg' alt='Pay Later' id="paylater" /><span className='ml-1' onClick={(e) => payLater()}>Pay Later</span></button>

                        }


                      </div>
                    </div>}
                  </div>
                  {
                    <div className='mt-1 d-none'>
                      <h5 className='fw-600 text-success-dark pb-2 card-border-bottom px-3'>SELECT E-SIGNATURE METHOD TO SIGN THE DOCUMENTS</h5>
                      <div className='py-4 px-3'>
                        <div className='card-border bank-div border-radius-5 d-flex align-items-center position-relative mb-3'>
                          <div className='bank-img px-2 border-right w-25'>
                            <img className='w-100 h-100' src="/assets/images/bankid.png" alt="Norwegian BankID" />
                          </div>
                          <div className='bank-title pl-3'>
                            <p>Norwegian BankID</p>
                          </div>
                          <img className='bankid-img position-absolute r-2' src="/assets/images/arrow-down.png" alt="Arrow" />
                        </div>
                        <div className='card-border bank-div border-radius-5 d-flex align-items-center position-relative'>
                          <div className='bank-img px-2 border-right w-25'>
                            <img className='w-100 h-100' src="/assets/images/BankNorway.png" alt="Norwegian BankID" />
                          </div>
                          <div className='bank-title pl-3'>
                            <p>Norwegian BankID on Mobile</p>
                          </div>
                          <img className='bankid-img position-absolute r-2' src="/assets/images/arrow-down.png" alt="Arrow" />
                        </div>
                      </div>
                    </div>
                  }
                </div>
                {!paylaterButton &&  esignMethod  ?
                  <div className='bg-white card-boxshadow px-0 py-2 border-radius-15 mb-3 mt-2'>
                    <h6 className='text-dark fw-500 fs-6 px-4 py-2 px-sm-2 card-border-bottom fw-600 text-success-dark'>
                      <span className='veritical-align-text-top ml-1'>CHOOSE PAYMENT TYPE</span></h6>
                    <div className='py-4 px-3'>
                      {checkPaymentModes && checkPaymentModes.length > 0 ?
                        checkPaymentModes.filter(i => i.value !== "PayLater").map((e) => {
                          return <div key={e.id} className='card-border bank-div border-radius-5 d-flex align-items-center position-relative mb-3' onClick={() => loadPaymentForm(e.id, leaseProfileIdValue)}>
                            <div className='bank-img px-2'>
                              {e.value === 'CreditCard' ?
                                <img className='w-100 h-100' src="/assets/images/credit-payment.svg" alt="Credit card" />
                                : <img className='w-100 h-100' src="/assets/images/direct-debit.svg" alt="Debit card" />
                              }
                            </div>
                            <div className='bank-title'>
                              <p>{e.text}</p>
                            </div>
                            <img className='bankid-img position-absolute r-2' src="/assets/images/arrow-down.png" alt="Arrow" />
                          </div>

                        })
                        : ""
                      }
                    </div>
                  </div> : ""


                }

                <div className="text-center mt-4">
                  <button onClick={() => navigate('/preBooking/TenantDetails')} className="ui button bg-white text-success-dark border-success-dark-1 fs-7 fw-400 text-dark px-5 mr-2">BACK</button>
                </div>
              </div>

              <div className='col-12 col-md-5 pl-1 pl-sm-0 mb-3'>
                <div className='bg-white card-boxShadow px-0 py-2 border-radius-15 border-top-success-4'>
                  <div className='row date-div'>
                    <div className='col-lg-6 col-md-12 col-sm-12 mb-1 px-2'>
                      <div className='card-border-primary text-center p-1'>
                        <p>Your move in date</p>
                        <p className='fw-500 text-purple'>{helper.show_date_format2(getMoveindate)}</p>
                      </div>
                    </div>
                    <div className='col-lg-6 col-md-12 col-sm-12 mb-1 px-2'>
                      {unitdetail !== null && typeof unitdetail !== 'undefined' ?
                        <div className='card-border-primary text-center p-1'>
                          <p>Billing Period</p>
                          <p className='fw-500 text-success-dark'>{unitdetail.startsOn} to {unitdetail.endsOn}</p>
                        </div>
                        :
                        <div className="ui active centered inline loader"></div>
                      }
                    </div>
                  </div>
                  <h6 className='text-dark text-center fw-500 fs-6 px-4 pt-2 mb-1 px-sm-2'>Recurring charges</h6>
                  <p className='text-dark text-center px-4 mb-2 px-sm-2'>This will be your recurring charges until you decide to move out.</p>
                  {unitdetail !== null && typeof unitdetail !== 'undefined' ?
                    <div className='mt-2 card-border border-radius-5 py-2 m-2'>
                      <h6 className='fw-600 fs-6 mb-1 px-2'>Total Amount</h6>
                      {unitdetail.rentAmount !== null && unitdetail.rentAmount > 0
                        ? <div className='d-flex justify-content-between dashed-bottom py-1 px-2'>
                          <p>Rent Amount</p>
                          <p>{helper.displayCurrency(unitdetail.rentAmount)}</p>
                        </div>
                        : "loading"
                      }
                      {unitdetail.serviceCharges !== null && unitdetail.serviceCharges > 0 ?
                        <div className='d-flex justify-content-between dashed-bottom py-1 px-2'>
                          <p>Service:</p>
                          <p>{helper.displayCurrency(unitdetail.serviceCharges)}</p>
                        </div>
                        :
                        ""
                      }
                      {unitdetail.insuranceCharges !== null && unitdetail.insuranceCharges > 0 ?
                        <div className='d-flex justify-content-between dashed-bottom py-1 px-2'>
                          <p>Protection Plan:</p>
                          <p>{helper.displayCurrency(unitdetail.insuranceCharges)}</p>
                        </div>
                        : ""
                      }
                      {unitdetail.merchandise !== null && unitdetail.merchandise > 0 ?
                        <div className='d-flex justify-content-between dashed-bottom py-1 px-2'>
                          <p>Merchandise:</p>
                          <p>{helper.displayCurrency(unitdetail.merchandise)}</p>
                        </div>

                        : ""

                      }
                      {
                        unitdetail.taxAmount !== null && unitdetail.taxAmount > 0
                          ?
                          taxpecentage !== null && taxpecentage > 0
                            ?
                            <div className='d-flex justify-content-between py-1 px-2'>
                              <p>{`Tax(${helper.displayPercent(taxpecentage)})`}</p>
                              <p>{helper.displayCurrency(unitdetail.taxAmount)}</p>
                            </div>
                            : <div className='d-flex justify-content-between py-1 px-2'>
                              <p>{`Tax`}</p>
                              <p>{helper.displayCurrency(unitdetail.taxAmount)}</p>
                            </div>

                          :
                          ""
                      }
                      {unitdetail.discount !== null && unitdetail.discount > 0 ?
                        <div className='d-flex justify-content-between  py-1 px-2'>
                          <p>Discount:</p>
                          <p>{helper.displayCurrency(unitdetail.discount)}</p>
                        </div>

                        : ""

                      }{unitdetail.grossAmount !== null && unitdetail.grossAmount > 0
                        ?
                        <div className='d-flex justify-content-between border-top pt-1 px-2'>
                          <p className='fw-600'>Net Amount</p>
                          <p className='fw-600'>{helper.displayCurrency(unitdetail.grossAmount)}</p>
                        </div>

                        :
                        ""
                      }

                    </div>
                    : <div className="ui active centered inline loader"></div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>)}

      {/* Payment Modal */}
      <Modal
        dimmer={PaymentModal.dimmer}
        open={PaymentModal.open}
        closeOnEscape={false}
        closeOnDimmerClick={false}
        onClose={() => setpaymentModal({ open: false })}>
        <Modal.Header className={`bg-success-dark text-white text-center fs-6 py-2 fw-400 position-relative `}>
          <svg onClick={() => setpaymentModal({ open: false })} className='r-3 cursor-pointer position-absolute' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 17.473 17.47">
            <path id="wrong-5" d="M978.609-438.353l-2.052-2.043-4.37-4.366a1.33,1.33,0,0,1-.4-1.425,1.3,1.3,0,0,1,.833-.843,1.3,1.3,0,0,1,1.171.183,3.019,3.019,0,0,1,.353.321q3.009,3,6.009,6.01c.088.088.159.193.254.309.127-.118.217-.2.3-.281l6.156-6.156a1.332,1.332,0,0,1,1.325-.431,1.3,1.3,0,0,1,.927.828,1.3,1.3,0,0,1-.188,1.228,3.412,3.412,0,0,1-.325.35q-3,3.009-6.011,6.009a3.233,3.233,0,0,1-.317.244c.132.14.213.23.3.316q3.052,3.053,6.108,6.1a1.36,1.36,0,0,1,.441,1.387,1.305,1.305,0,0,1-2.205.564c-.59-.568-1.163-1.157-1.74-1.736l-4.487-4.491a2.068,2.068,0,0,1-.183-.248l-.142-.051a1.52,1.52,0,0,1-.191.325q-3.047,3.059-6.1,6.111a1.341,1.341,0,0,1-1.45.419,1.3,1.3,0,0,1-.851-.866,1.3,1.3,0,0,1,.235-1.19,3.215,3.215,0,0,1,.257-.274l6.034-6.033C978.386-438.167,978.484-438.245,978.609-438.353Z" transform="translate(-971.716 447.116)" fill="#fff" />
          </svg>
        </Modal.Header>
        <Modal.Content className=' overflow-y-auto six-storage-loader'>
          {iFrameResponse ?
            makeSavedCardMandatory
              ?
              <div className='d-flex align-items-center justify-content-center error'>
                Note: The Card will be saved for auto payments
              </div>
              : <div>
                <div className='d-flex align-items-center justify-content-center'>
                  <input type="checkbox" id="savedcard" checked={saveCard} onChange={(e) => { changeSavedCard(e) }} />
                  <div className='ml-2'>
                    <p>Save this card for future transaction</p>
                  </div>
                </div>
                <div className='d-flex align-items-center justify-content-center'>
                  <input type="checkbox" id="autopayenabled" checked={autoPayEnabled} onChange={(e) => { changeAutoPayEnabled(e) }} />
                  <div className='ml-2'>
                    <p>Use the saved card for future recurring payments </p>
                  </div>
                </div>
              </div>

            : ""
          }
         {  parse(mondelcontent) }
        
          
        </Modal.Content>
      </Modal>

      {/* pay later modal */}

      <Modal
        centered={false}
        open={OpenPaylaterModal}
        onClose={() => setPayLaterModal(false)}
        onOpen={() => setPayLaterModal(true)}

      >
        <Modal.Header>Confirm Movein </Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to do payLater?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setPayLaterModal(false)} negative>
            No
          </Button>
          <Button onClick={() => saveMoveinDetails('', leaseProfileIdValue, true)} positive>
            Yes
          </Button>
        </Modal.Actions>
      </Modal>

    </>
  )
}
