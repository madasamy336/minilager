import React, { useState, useEffect } from 'react'
import PreBookingBreadcrumb from '../components/prebooking breadcrumb/PreBookingBreadcrumb'
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import { Grid, Loader, Placeholder, Segment } from "semantic-ui-react";
import { Modal } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import AddOnAccordion from '../components/addonaccordion/AddOnAccordion';
import Pricesummary from '../components/pricesummary/pricesummary';
import { useRef } from 'react';
import AddonCard from '../components/AddonCard/AddonCard';
import instance from '../services/instance';
import request from '../services/request';
import { useSelector, useDispatch } from 'react-redux';
import Helper from "../helper";
import { json } from 'react-router-dom';
let helper = new Helper();
let saveThirdPartyInsuranceDetailsValues = [];
let ownInsuranceArray = [];
let servicesArray = [];
let merchandiseId = [];
let merchandiseItem = [];

export default function AddOn() {
  const childRef = useRef(null);
  const navigate = useNavigate();
  let unitid = localStorage.getItem('unitid');
  let rentDetailsvalue = JSON.parse(sessionStorage.getItem(`rentDetails`));
  let getMoveindate = sessionStorage.getItem('moveindate');
  let getRecurringPeriodId = sessionStorage.getItem('invoiceData');
  let getRecurringTypeid = sessionStorage.getItem('recurringData');
  let insuranceSessionValue = JSON.parse(sessionStorage.getItem('insurancedetail'));
  let serviceSessionValue = JSON.parse(sessionStorage.getItem('servicedetail'));
  let VehicleSessionValue = JSON.parse(sessionStorage.getItem('vehicleDetail'));
  let merchandiseSessionvalue = JSON.parse(sessionStorage.getItem('merchandiseItem'));
  let userid = localStorage.getItem('userid');
  const rentDetails = useSelector(state => state.rentdetail.renDetails);
  const [activePlan, SetactivePlan] = useState('');
  const [addOnsResponse, setAddOnsResponse] = useState(null);
  const [ownInsurance, setOwnInsurance] = useState(false);
  const [isLoading, setLoader] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const ownInsuranceHandler = (e) => {
    SetactivePlan('Own Insurance')
    e.preventDefault()
    setOwnInsurance(true);
  }
  const selectAdminInsurance = (planname, id) => {
    SetactivePlan(planname);
    ownInsuranceArray.push(
      {
        planname: planname,
        unitId: unitid,
        insurancePlans: id
      }
    )

  }

  const serviceSelected = (e) => {
    if (e.target.checked === true) {
      servicesArray.push(e.target.value)
    } else {
      let index = servicesArray.indexOf(e.target.value);
      if (index > -1) {
        servicesArray.splice(index, 1)
      }
    }
  }
  const cancelInsuranceHandler = () => {
    setOwnInsurance(false);
  }
  const [applyDiscountModal, SetApplyDiscountModal] = useState({
    open: false,
    dimmer: undefined,
  })

  useEffect(() => {
    if (rentDetailsvalue === null) {
      FetchAddOns(rentDetails);
    } else {
      FetchAddOns(rentDetailsvalue);
    }
    if (insuranceSessionValue !== null && typeof insuranceSessionValue !== 'undefined') {
      SetactivePlan(insuranceSessionValue[0].planname);
    }
    if (VehicleSessionValue !== null) {
      SetVehicleAccordian(VehicleSessionValue);

    }

    if (merchandiseSessionvalue !== null) {
      merchandiseSessionvalue.forEach((merchandiseItem) => {
        merchandiseItem.merchandise.forEach((item) => {
          let merchandiseValue = document.querySelector(`.merchandise_${item.itemId}`)
          if (merchandiseValue !== null && typeof merchandiseValue !== 'undefined') {
            merchandiseValue.value = item.qnty;
          }
        })

      });
    }





  }, []);

  const navigateTenantDEtails = (e) => {
    setLoader(true)
    e.preventDefault();
    let errorcount = 0;
    if (ownInsurance === true) {
      let policyProvider = document.querySelector('.six-storage-effective-provider-name');
      //provider
      let insuranceValue = {
        provider_name: policeProvide !== '' ? policeProvide : '',
        policy_number: policyNumber !== '' ? policyNumber : '',
        effective_to_date: effectiveToDate !== '' ? effectiveToDate : '',
        effective_from_date: effectiveFromDate !== '' ? effectiveFromDate : ''
      }
      Object.entries(insuranceValue).forEach(([key, value]) => {
        if (value === '') {
          document.querySelector(`.${key}`).classList.remove("d-none");
          errorcount = errorcount + 1;
          return
        } else {
          document.querySelector(`.${key}`).classList.add("d-none");
        }

      });
      if (errorcount === 0) {
        saveThirdPartyInsuranceDetailsValues.push({
          "unitId": unitid,
          "insuranceInfo": {
            "isThirdParty": true,
            "providerName": policeProvide,
            "policyNumber": policyNumber,
            "effectiveFrom": effectiveFromDate,
            "effectiveTill": effectiveToDate

          }

        });
        navigate('/preBooking/TenantDetails')
      }


    } else {
      if (ownInsuranceArray.length !== 0) {
        sessionStorage.setItem('insurancedetail', JSON.stringify(ownInsuranceArray))
        navigate('/preBooking/TenantDetails')

      }
      if (servicesArray.length !== 0) {
        let sessionServices = [];
        servicesArray.forEach((id) => {
          sessionServices.push({ unitId: unitid, servicedId: id })
        })
        sessionStorage.setItem('servicedetail', JSON.stringify(sessionServices))
      }
      if (merchandiseId.length !== 0) {
        merchandiseId.forEach((id) => {
          let merchandisevalue = document.querySelector(`.merchandise_${id}`)
          if (merchandisevalue !== null && typeof merchandisevalue !== 'undefined') {
            setMerchandiseAddcard(unitid, id, merchandisevalue.value);

          }
        })
        sessionStorage.setItem('merchandiseItem', JSON.stringify(merchandiseItem));


      }
      if (vehicleaccordian !== 0) {
        sessionStorage.setItem('vehicleDetail', JSON.stringify(vehicleaccordian));
      }
      if (userid !== null & typeof userid !== 'undefined') {
        navigate('/preBooking/TenantDetails')
      } else {
        navigate('/preBooking/sign-in')
      }

      setLoader(false)

      //
    }


  }

  const setMerchandiseAddcard = (unitId, itemId, count) => {
    let obj = {
      itemId: itemId,
      qnty: parseInt(count),
    };
    let pos = -1;
    if (merchandiseItem.length > 0) {
      pos = merchandiseItem
        .map(function (e) {
          return e.unitId;
        })
        .indexOf(unitId);
    }
    if (pos > -1) {
      let addedMerch = merchandiseItem[pos];
      let addedItemPos = addedMerch.merchandise
        .map(function (e) {
          return e.itemId;
        })
        .indexOf(itemId);
      if (addedItemPos > -1) {
        if (obj.qnty > 0) {
          merchandiseItem[pos].merchandise[addedItemPos].qnty = obj.qnty;
        } else {
          merchandiseItem[pos].merchandise.splice(addedItemPos, 1);
          if (merchandiseItem[pos].merchandise.length <= 0) {
            merchandiseItem.splice(pos, 1);
          }
        }
      } else {
        merchandiseItem[pos].merchandise.push(obj);
      }
    } else {
      if (obj.qnty > 0) {
        merchandiseItem.push({
          unitId: unitId,
          merchandise: [obj]
        });
      }
    }
    if (merchandiseItem.length > 0) {
      pos = merchandiseItem
        .map(function (e) {
          return e.unitId;
        })
        .indexOf(unitId);
    }
  }

  const FetchAddOns = (rentDetails) => {
    setLoader(true)
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let requestbody = {
      unitId: [unitid],
      moveInDate: new Date(getMoveindate),
      additionalMonths: 0,
      recurringPeriodId: getRecurringPeriodId,
      recurringTypeId: getRecurringTypeid,
      isBusinessUser: false



    }
    instance
      .post(request.check_addons, requestbody, config)
      .then(response => {
        if (response.data.result !== null && response.data.result !== 'undefined') {
          ownInsuranceArray = [];
          let preferredStorage = {
            storageTypeId: response.data.result[0].unitInfo.storageType.id,
            locationId: response.data.result[0].unitInfo.location.id,
            unitTypeId: response.data.result[0].unitInfo.unitType.id
          }
          console.log(preferredStorage);
          setAddOnsResponse(response.data.result[0].addOns);
          sessionStorage.setItem('preferredStorage', JSON.stringify(preferredStorage));
          setLoader(false)
          if (serviceSessionValue !== null && typeof serviceSessionValue !== 'undefined') {
            serviceSessionValue.forEach((e) => {
              let servicesChecked = document.getElementById(`services_${e}`);
              if (servicesChecked !== null && typeof servicesChecked !== 'undefined') {
                document.getElementById(`services_${e}`).checked = true
              }
              //
            })
          }
        }
      })
      .catch(error => {
        console.log(error);
      })

  }

  const [vehicleaccordian, SetVehicleAccordian] = useState([]);
  const [vehicleType, setVehicleType] = useState("");
  const [year, setYear] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [vehicleState, setVehicleState] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  //insurance
  const [policeProvide, setPolicyProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [effectiveFromDate, setEffectiveFromDate] = useState("");
  const [effectiveToDate, setEffectiveToDate] = useState("");

  const VehicleFormSubmitHandler = (e) => {
    e.preventDefault();
    SetVehicleAccordian([
      ...vehicleaccordian,
      {
        VehicleType: vehicleType,
        Year: year,
        Brand: brand,
        Model: model,
        Color: color,
        VehicleState: vehicleState,
        RegistrationNo: registrationNo,
        LicenseNo: licenseNo,
        VehicleAccordianLength: vehicleaccordian.length + 1
      }
    ])
    setYear('');
    setBrand('');
    setModel('');
    setColor('');
    setRegistrationNo('');
    setLicenseNo('');
    setVehicleState('');
    setVehicleType('');


  }
  const removeVehicleForm = (index) => {
    const list = [...vehicleaccordian]
    list.splice(index, 1);
    SetVehicleAccordian(list)
  }
  return (
    <>

      <div>
        {isLoading ? (
          <Loader size='large' active>Loading</Loader>
        ) : (
          <div>
            <PreBookingBreadcrumb activeStep='12' />
            <div className='ui container responsive addon-container'>
              <div className='row'>
                <div className='col-12 col-md-7 pr-1 pr-sm-0 mb-3'>
                  <div className='bg-white card-boxshadow px-0 py-2 border-radius-15 mb-3'>
                    <h6 className='text-dark fw-500 fs-6 px-4 py-2 px-sm-2 card-border-bottom'>
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
                      <span className='veritical-align-text-top ml-1'>Insurance</span></h6>
                    {!ownInsurance && (
                      <div className=" p-3 AddonsInsurance">

                        {typeof addOnsResponse !== 'undefined' && addOnsResponse !== null && addOnsResponse.insurance !== 'undefined' && addOnsResponse.insurance !== null ?

                          <div className='row'>
                            {
                              addOnsResponse.insurance.map(item => {
                                return <div key={item.id} className='col-lg-3 col-md-6 col-sm-12 px-1 mb-1'>
                                  <div className={`card changePlanCard cursor-pointer  border-radius-10 text-center p-2 ${activePlan === item.planName && 'active'}`} onClick={(e) => selectAdminInsurance(item.planName, item.id)}>
                                    <p className=' fs-7 fw-500 pb-1 mt-1'>{item.planName}</p>
                                    <h4 className={` fs-6 fw-500 pb-2 ${activePlan === item.planName ? 'text-white' : 'text-success-dark'}`}>{helper.displayCurrency(item.coverage)}</h4>
                                    <span className='fs-8 fw-600 d-block mb-1'>{helper.displayCurrency(item.premium.domestic.netAmount)} Per Month</span>
                                  </div>
                                </div>

                              }

                              )
                            }
                            <div className='col-lg-3 col-md-6 col-sm-12 px-1 mb-1'>
                              <div className={`card changePlanCard cursor-pointer  border-radius-10 text-center p-2  ${activePlan === 'Own Insurance' && 'active'}`} onClick={(e) => ownInsuranceHandler(e)} >
                                <p className=' fs-7 fw-500 pb-1 mt-1'>I HAVE A</p>
                                <h4 className={` fs-6 fw-500 pb-2 ${activePlan === 'Own Insurance' ? 'text-white' : 'text-success-dark'}`}>OWN INSURANCE</h4>

                              </div>
                            </div>

                          </div>



                          : <Grid columns={3} stackable>
                            <Grid.Column>
                              <Segment raised>
                                <Placeholder>
                                  <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                  </Placeholder.Header>
                                </Placeholder>
                              </Segment>
                            </Grid.Column>

                            <Grid.Column>
                              <Segment raised>
                                <Placeholder>
                                  <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                  </Placeholder.Header>
                                </Placeholder>
                              </Segment>
                            </Grid.Column>

                            <Grid.Column>
                              <Segment raised>
                                <Placeholder>
                                  <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                  </Placeholder.Header>
                                </Placeholder>
                              </Segment>
                            </Grid.Column>
                          </Grid>


                        }


                      </div>
                    )}
                    {ownInsurance && (<div className="ui form px-4 px-sm-2">
                      <div className="field w-100 datePicker my-3">
                        <label className='fw-500 fs-7 mb-2'>Policy Provider Name</label>
                        <input placeholder='Policy Provider Name' onChange={(e) => { setPolicyProvider(e.target.value) }} />
                        <p className="error py-1 provider_name d-none">Please Enter Policy Provider Name</p>
                      </div>
                      <div className="field w-100 datePicker my-3">
                        <label className='fw-500 fs-7 mb-2'>Policy Number</label>
                        <input placeholder='Policy Number' onChange={(e) => { setPolicyNumber(e.target.value) }} />
                        <p className="error py-1 policy_number d-none">Please Enter Policy Number</p>
                      </div>
                      <div className="field w-100 datePicker my-3">
                        <label className='fw-500 fs-7 mb-2' >Effective From Date</label>
                        <SemanticDatepicker placeholder='Effective From Date' className='w-100' onChange={(e, item) => setEffectiveFromDate(item.value)} />
                        <p className="error py-1 effective_from_date  d-none">Please Enter Effective From Date</p>
                      </div>
                      <div className="field w-100 datePicker my-3">
                        <label className='fw-500 fs-7 mb-2' >Effective To Date</label>
                        <SemanticDatepicker placeholder='Effective To Date' className='w-100' onChange={(e, item) => setEffectiveToDate(item.value)} />
                        <p className="error py-1 effective_to_date d-none">Please Enter Effective To Date</p>
                      </div>
                      <div className="field w-100 datePicker my-3">
                        <label className='fw-500 fs-7 mb-2'>Document Upload</label>
                        <div className='upload text-center' htmlFor="insuranceUpload">
                          <label className='cursor-pointer py-3 d-flex justify-content-center align-items-center flex-wrap' htmlFor="insuranceUpload"><svg className='w-100' xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 66 65.99">
                            <g id="upload_neww" data-name="upload  neww" transform="translate(0 -0.061)" opacity="0.18">
                              <path id="Path_19750" data-name="Path 19750" d="M-356.118,239.355v40.918a5.079,5.079,0,0,1-.053,1.026,2.362,2.362,0,0,1-2.559,1.862,2.384,2.384,0,0,1-2.1-2.284c-.012-.244,0-.49,0-.736V239.526l-.165-.106c-.163.2-.311.417-.492.6q-5.829,5.835-11.664,11.662a2.351,2.351,0,0,1-4.085-.9,2.379,2.379,0,0,1,.778-2.455q5.034-5.014,10.052-10.04l6.04-6.038a2.388,2.388,0,0,1,3.784,0q8.05,8.042,16.088,16.092c1.459,1.463.984,3.636-.9,4.122a2.366,2.366,0,0,1-2.4-.76q-4.807-4.825-9.629-9.634Z" transform="translate(391.468 -231.26)" />
                              <path id="Path_19751" data-name="Path 19751" d="M-416.15,499.227h-27.83c-3.232,0-5.168-1.935-5.17-5.166v-8.69a2.379,2.379,0,0,1,2.341-2.64,2.374,2.374,0,0,1,2.362,2.612c0,2.849.016,5.7-.012,8.542,0,.516.122.64.638.64q27.649-.02,55.3,0c.6,0,.654-.2.65-.7-.022-2.823-.012-5.646,0-8.465a2.379,2.379,0,0,1,2.362-2.626,2.382,2.382,0,0,1,2.362,2.626v8.762a4.731,4.731,0,0,1-5.083,5.107Z" transform="translate(449.15 -433.176)" />
                            </g>
                          </svg><span className='d-block mt-2'>Upload Document</span>
                          </label>
                          <input id='insuranceUpload' type="file" />
                        </div>
                      </div>
                      <div className='text-center my-4'>
                        <button className="ui button  basic border-success-dark-1 fs-7 fw-400 text-dark px-5 mr-2 mb-sm-1" onClick={cancelInsuranceHandler}>Change</button>
                      </div>
                    </div>)}
                  </div>

                  <div className={`${typeof addOnsResponse !== 'undefined' && addOnsResponse !== null && addOnsResponse.services !== 'undefined' && addOnsResponse.services == null && `d-none`}`}>
                    <div className='bg-white card-boxshadow px-0 py-2 border-radius-15 mb-3'>
                      <h6 className='text-dark fw-500 fs-6 px-4 py-2 px-sm-2 card-border-bottom'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 41.477 41.085">
                          <path id="servicess" d="M5.542,39.707H.989c-.77,0-.979-.206-.979-.964V29.626c0-.772.2-.981.962-.982h4.57c0-.251-.009-.463,0-.674a.674.674,0,0,1,.713-.7q2.743-.014,5.487,0a.675.675,0,0,1,.707.711c.01.187,0,.374,0,.561v.6l1.358-.331V20.346c-.626,0-1.241,0-1.855,0-.779,0-1.07-.465-.726-1.161.838-1.688,1.7-3.364,2.514-5.062a1,1,0,0,1,1.138-.694,2.429,2.429,0,0,0,.32,0c0-.595.035-1.154-.009-1.708a2.257,2.257,0,0,0-.823-1.423,6.18,6.18,0,0,1,.252-9.185,7.9,7.9,0,0,1,1.6-1c.593-.3,1.061.029,1.065.7.007,1.426.009,2.852,0,4.278a.552.552,0,0,0,.3.557c.372.214.728.636,1.091.637s.719-.421,1.092-.634a.546.546,0,0,0,.3-.555c-.013-1.4-.008-2.794-.006-4.192,0-.8.455-1.084,1.189-.758a6.175,6.175,0,0,1,1.926,9.911,3.737,3.737,0,0,0-1,3.369c1.266,0,2.531.032,3.792-.025.268-.013.521-.348.781-.536l-.037-.13c-.331,0-.663,0-.993,0-.563-.009-.812-.257-.816-.824q-.009-1.253,0-2.506c0-.565.255-.809.822-.817.325,0,.651,0,1.081,0-.313-.313-.559-.547-.793-.794A.7.7,0,0,1,26,6.7q.9-.93,1.833-1.833a.707.707,0,0,1,1.13.017c.236.227.459.469.775.8,0-.47-.008-.822,0-1.172a.689.689,0,0,1,.756-.751q1.317-.016,2.635,0a.689.689,0,0,1,.752.755,5.755,5.755,0,0,0,.09,1.1c.219-.235.431-.477.658-.7A.723.723,0,0,1,35.826,4.9q.894.878,1.771,1.772a.716.716,0,0,1-.013,1.163c-.226.234-.459.459-.762.762.447,0,.787-.007,1.127,0a.7.7,0,0,1,.775.777q.014,1.3,0,2.592a.7.7,0,0,1-.775.777c-.34.008-.681,0-1.1,0,.364.391.6.763,1.167.717a.838.838,0,0,1,.637.4c.934,1.8,1.839,3.616,2.735,5.435a.69.69,0,0,1-.677,1.057c-.644.012-1.289,0-1.956,0v7.515a2.064,2.064,0,0,0,.234.075,2.753,2.753,0,0,1,.886,5.117c-1.774,1.04-3.56,2.062-5.342,3.091-2.006,1.158-4.018,2.307-6.016,3.477a5.581,5.581,0,0,1-2.916.785c-3.2-.015-6.395-.022-9.591,0a6.085,6.085,0,0,1-3.069-.721c-.113-.062-.233-.114-.35-.167a.6.6,0,0,0-.133-.01c0,.283.009.565,0,.846a.682.682,0,0,1-.733.73q-2.722.012-5.443,0a.682.682,0,0,1-.733-.73c-.009-.2,0-.4,0-.649Zm6.913-9.14v.507c0,2.059.017,4.119-.013,6.178a.853.853,0,0,0,.576.938,6.26,6.26,0,0,0,2.6.832c3.4-.017,6.8.013,10.2-.025a3.645,3.645,0,0,0,1.688-.422c3.906-2.211,7.786-4.465,11.669-6.716a1.367,1.367,0,0,0,.528-1.9,1.384,1.384,0,0,0-1.885-.49q-3.374,1.924-6.726,3.885a.522.522,0,0,0-.211.366A2.749,2.749,0,0,1,27.3,36.331c-2.668-.7-5.332-1.426-8-2.143-.523-.141-.747-.467-.628-.9.111-.4.474-.567.972-.434q2.229.593,4.458,1.191c1.194.32,2.385.652,3.582.961a1.38,1.38,0,0,0,1.79-1.522,1.455,1.455,0,0,0-1.251-1.2c-3-.8-6-1.611-9-2.41a5.329,5.329,0,0,0-2.626-.335c-1.371.323-2.735.676-4.146,1.029ZM37.345,20.346h-.522c-2.5,0-5.01-.01-7.513.008a.969.969,0,0,1-1.006-.631c-.348-.757-.739-1.494-1.115-2.239-.045-.089-.107-.168-.2-.306V30.512c1.2.426,2.594.389,3.378,1.6a.945.945,0,0,0,.158-.051q3.308-1.908,6.608-3.826a.558.558,0,0,0,.2-.408c.02-.748.009-1.5.009-2.246V20.346Zm-11.77-3.083-.069-.033c-.417.83-.85,1.652-1.243,2.492a.971.971,0,0,1-1.006.631c-2.52-.018-5.04-.008-7.561-.008h-.461v8.087c.173-.039.325-.067.472-.108a5.47,5.47,0,0,1,3.023-.016c1.33.371,2.664.722,4,1.078.939.251,1.88.5,2.847.754V17.262ZM21.443,1.855v.5c0,1.095-.009,2.188,0,3.283a.925.925,0,0,1-.457.863q-.925.595-1.832,1.22a.761.761,0,0,1-.955,0c-.6-.416-1.213-.826-1.832-1.22a.949.949,0,0,1-.464-.9c.016-1.122.007-2.246,0-3.369a3.2,3.2,0,0,0-.036-.331,4.792,4.792,0,0,0-.537,7.405A3.737,3.737,0,0,1,16.6,12.3c-.015.369,0,.737,0,1.1h1.383c0-.636,0-1.24,0-1.843,0-.573.264-.9.707-.887.427.01.672.325.674.877,0,.615,0,1.229,0,1.858h1.383c0-.326.016-.627,0-.925a3.923,3.923,0,0,1,1.322-3.23,4.584,4.584,0,0,0,1.339-4.427,4.711,4.711,0,0,0-1.966-2.969Zm-10.4,37.832V28.677h-4.1V39.687ZM25.16,14.814c-3.387,0-6.685,0-9.983.013a.537.537,0,0,0-.358.28c-.478.918-.936,1.848-1.4,2.776-.171.343-.336.688-.527,1.081h.533c2.809,0,5.618-.053,8.425.029a1.6,1.6,0,0,0,1.816-1.141c.408-1.022.966-1.983,1.491-3.037Zm14.493,4.149c-.068-.162-.111-.281-.166-.393-.566-1.133-1.144-2.258-1.693-3.4a.551.551,0,0,0-.586-.364c-3.125.012-6.251.007-9.376.008-.121,0-.243.013-.417.023.641,1.28,1.266,2.508,1.865,3.748a.582.582,0,0,0,.618.384c3.1-.013,6.193-.008,9.29-.008h.464ZM5.509,38.305V30.061H1.415v8.244H5.509ZM31.122,5.152c0,.514-.012.987,0,1.461a.823.823,0,0,1-.583.854.848.848,0,0,1-1.1-.142c-.33-.362-.677-.705-.978-1.015l-1.038.949c.335.336.638.666.97.963a.89.89,0,0,1,.226,1.156.89.89,0,0,1-.974.6c-.441-.021-.885,0-1.342,0v1.383c.513,0,1,.006,1.487,0a.758.758,0,0,1,.778.5c.294.672.277.789-.248,1.327a3,3,0,0,0-.195.253h3.033a2.917,2.917,0,0,1-2.089-3.172,2.762,2.762,0,0,1,5.442-.139c.3,1.432-.447,2.606-2.106,3.286h3.1c-.136-.145-.224-.256-.327-.345A.831.831,0,0,1,35,11.978a.86.86,0,0,1,.913-.624c.469.02.939,0,1.4,0V9.975c-.507,0-.982-.01-1.456,0a.824.824,0,0,1-.847-.592.843.843,0,0,1,.151-1.092c.362-.326.705-.673,1.065-1.016l-1.01-1.009c-.347.354-.7.691-1.025,1.051a.847.847,0,0,1-1.093.153.825.825,0,0,1-.593-.846c.014-.485,0-.97,0-1.472H31.125Zm.7,4.133A1.38,1.38,0,1,0,33.2,10.667a1.386,1.386,0,0,0-1.369-1.381Z" transform="translate(-0.01 -0.007)" fill="#328128" />
                        </svg>
                        <span className='veritical-align-text-top ml-1'>Services</span></h6>

                      <div className="row services p-3">
                        {typeof addOnsResponse !== 'undefined' && addOnsResponse !== null && typeof addOnsResponse.services !== 'undefined' && addOnsResponse.services !== null ?
                          addOnsResponse.services.map((item) => {
                            if (item.isMandatory == true) {
                              servicesArray.indexOf(item.id) === -1 ? servicesArray.push(item.id) : '';
                            }
                            return <div key={item.id} className='col-lg-6 col-md-6 col-sm-12 px-1 mb-3'>
                              <div className='card card-border-secondary border-radius-10 p-2'>
                                <div className='row'>
                                  <div className='col-lg-8 col-md-8 col-sm-8'>
                                    <div className='d-flex align-items-center'>
                                      {item.isMandatory == true ?
                                        <input type="checkbox" value={item.id} checked disabled /> :
                                        <input type="checkbox" id={`services_${item.id}`} value={item.id} onChange={(e) => { serviceSelected(e) }} />

                                      }
                                      {
                                        serviceSessionValue !== null && serviceSessionValue.forEach((e) => {
                                          let checkbox = document.getElementById(`services_${e.servicedId}`)
                                          if (checkbox !== null) {
                                            checkbox.checked = true
                                          }
                                        })

                                      }

                                      <div className='ml-2'>
                                        <p>{helper.displayCurrency(item.serviceCharge.netAmount)}</p>
                                        <p>{item.serviceName}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='col-lg-4 col-md-4 col-sm-4 text-righ d-none'>
                                    <div className='services-img'>
                                      <img src="/assets/images/services.png" alt="Services" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          })

                          :
                          <Grid rows={1} stackable>
                            <Grid.Column>
                              <Segment raised>
                                <Placeholder>
                                  <Placeholder.Header image>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                  </Placeholder.Header>

                                </Placeholder>
                              </Segment>
                            </Grid.Column>



                          </Grid>
                        }
                      </div>
                    </div>
                  </div>
                  {typeof addOnsResponse !== 'undefined' && addOnsResponse !== null && addOnsResponse.merchandise !== 'undefined' && addOnsResponse.merchandise !== null ?
                    <div className={`bg-white card-boxshadow px-0 py-2 border-radius-15 mb-3 $ `}>
                      <div className='d-flex justify-content-between card-border-bottom'>
                        <h6 className='text-dark fw-500 fs-6 px-4 py-2 px-sm-2'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 38.513 38.4">
                            <g id="vehicle-information" transform="translate(-0.005 0)">
                              <path id="Path_19735" data-name="Path 19735" d="M10.824,55.255h-.6q-3.112,0-6.223,0c-1.2,0-1.59-.4-1.59-1.6v-25.7c0-1.193.393-1.582,1.6-1.584.661,0,1.323,0,1.976,0v-2.4c-.734,0-1.434,0-2.134,0A3.611,3.611,0,0,0,.007,27.834q0,12.976,0,25.952a3.612,3.612,0,0,0,3.852,3.867q3.211.008,6.424,0c.176,0,.352-.014.541-.023V55.255Z" transform="translate(0 -21.561)" fill="#328128" />
                              <path id="Path_19736" data-name="Path 19736" d="M69.1,119.849q-2.007,0-4.013,0c-1.3,0-2.609-.011-3.912.018a1.165,1.165,0,0,0-1.152,1.157,1.2,1.2,0,0,0,1.054,1.205,3.316,3.316,0,0,0,.5.027q7.474,0,14.948,0a2.82,2.82,0,0,0,.695-.069,1.185,1.185,0,0,0-.145-2.309,4.682,4.682,0,0,0-.65-.028q-3.662,0-7.323,0Z" transform="translate(-53.989 -107.819)" fill="#328128" />
                              <path id="Path_19737" data-name="Path 19737" d="M245.925,36.234c0-2.925.048-5.8-.019-8.677a3.336,3.336,0,0,0-2.813-3.219,20.758,20.758,0,0,0-3.177-.03c0,.593,0,1.208,0,1.824,0,.147.013.294.024.5.7,0,1.384,0,2.065,0,1.1,0,1.522.419,1.523,1.509q0,3.764,0,7.528v.565h2.4Z" transform="translate(-215.83 -21.823)" fill="#328128" />
                              <path id="Path_19738" data-name="Path 19738" d="M195.491,3.623c0-.6.01-1.2,0-1.806a1.8,1.8,0,1,0-3.606,0q-.02,1.781,0,3.561a1.8,1.8,0,1,0,3.606,0c.012-.585,0-1.17,0-1.755Z" transform="translate(-172.61 0)" fill="#328128" />
                              <path id="Path_19739" data-name="Path 19739" d="M75.5,3.642c0-.6.007-1.2,0-1.806A1.8,1.8,0,1,0,71.888,1.8q-.029,1.805,0,3.611a1.8,1.8,0,1,0,3.6-.014c.012-.585,0-1.17,0-1.755Z" transform="translate(-64.655)" fill="#328128" />
                              <path id="Path_19740" data-name="Path 19740" d="M120.12,26.685h5.973V24.36H120.12Z" transform="translate(-108.059 -21.915)" fill="#328128" />
                              <path id="Path_19741" data-name="Path 19741" d="M62.986,206.126v0c.6,0,1.2.02,1.806-.005a1.2,1.2,0,1,0-.017-2.392c-1.153-.022-2.308-.02-3.462,0a1.2,1.2,0,0,0-1.295,1.179,1.224,1.224,0,0,0,1.312,1.219c.551.017,1.1,0,1.655,0Z" transform="translate(-53.99 -183.264)" fill="#328128" />
                              <path id="Path_19742" data-name="Path 19742" d="M152.363,185.555c.005,2.826.011,5.566.014,8.3,0,.217-.006.436-.026.651-.094,1.01-.334,1.259-1.332,1.285-.9.023-1.8.015-2.706-.009a.966.966,0,0,1-1.017-.959c-.043-.415-.046-.834-.059-1.252-.009-.266-.118-.374-.4-.374q-5.87.011-11.74,0a.375.375,0,0,0-.437.356c-.109.574-.238,1.144-.359,1.715-.061.291-.214.5-.532.5-1.134.02-2.268.024-3.4.044a.752.752,0,0,1-.813-.719,11.718,11.718,0,0,1-.189-1.84c.005-2.375.048-4.75.076-7.124,0-.183,0-.365,0-.579a9.08,9.08,0,0,0-1.02-.282c-.376-.06-.405-.291-.366-.58a1.994,1.994,0,0,1,2.056-1.851c.451-.007.608-.311.73-.638a29.055,29.055,0,0,0,1.1-3.116,4.609,4.609,0,0,1,3.916-3.586,23.052,23.052,0,0,1,11.5.455,2.81,2.81,0,0,1,1.955,1.849c.5,1.38,1.014,2.758,1.511,4.14.2.559.458.932,1.171.914a1.929,1.929,0,0,1,1.714,1.945.647.647,0,0,1-.34.443A7.542,7.542,0,0,1,152.363,185.555Zm-19.932-2.317a39.465,39.465,0,0,0,16.784,0c-.439-1.389-.855-2.71-1.274-4.031a2.162,2.162,0,0,0-2.3-1.775c-2.541-.086-5.083-.193-7.624-.2a12.642,12.642,0,0,0-2.862.419,1.483,1.483,0,0,0-.921.739c-.644,1.575-1.2,3.186-1.807,4.842Zm1.34,6.216a5.891,5.891,0,0,0,1.215-.2c.283-.111.72-.425.7-.593a1.217,1.217,0,0,0-.607-.808c-.982-.456-2-.843-3.016-1.209-.811-.291-1.234-.013-1.387.838a3.036,3.036,0,0,0-.04.549,1,1,0,0,0,.933,1.153C132.319,189.316,133.087,189.374,133.771,189.454Zm14.527-.014c.607-.084,1.368-.17,2.121-.3a.777.777,0,0,0,.678-.764,5.321,5.321,0,0,0-.067-1.192.644.644,0,0,0-.955-.548c-1.2.439-2.4.906-3.589,1.369-.294.114-.6.312-.464.652a1.114,1.114,0,0,0,.633.59,10.763,10.763,0,0,0,1.643.2Z" transform="translate(-115.184 -157.423)" fill="#328128" />
                              <path id="Path_19743" data-name="Path 19743" d="M10.824,55.26v2.376c-.19.008-.365.023-.541.023q-3.211,0-6.424,0A3.612,3.612,0,0,1,.007,53.79q0-12.975,0-25.951a3.61,3.61,0,0,1,3.85-3.867c.7,0,1.4,0,2.134,0v2.4H4.014c-1.208,0-1.6.39-1.6,1.584v25.7c0,1.2.394,1.6,1.59,1.6q3.112,0,6.223,0h.6Z" transform="translate(0 -21.566)" fill="#328128" />
                              <path id="Path_19744" data-name="Path 19744" d="M69.086,119.858h7.323a4.682,4.682,0,0,1,.65.028A1.185,1.185,0,0,1,77.2,122.2a2.819,2.819,0,0,1-.695.069q-7.474.006-14.948,0a3.325,3.325,0,0,1-.5-.027,1.194,1.194,0,0,1-1.054-1.205,1.163,1.163,0,0,1,1.152-1.157c1.3-.029,2.608-.016,3.912-.018q2.007,0,4.013,0Z" transform="translate(-53.98 -107.828)" fill="#328128" />
                              <path id="Path_19745" data-name="Path 19745" d="M245.93,36.243h-2.4V28.15c0-1.09-.42-1.5-1.523-1.509-.681,0-1.362,0-2.065,0-.01-.206-.023-.352-.024-.5,0-.615,0-1.231,0-1.824a20.758,20.758,0,0,1,3.177.03,3.336,3.336,0,0,1,2.813,3.219c.066,2.875.019,5.751.019,8.677Z" transform="translate(-215.835 -21.832)" fill="#328128" />
                              <path id="Path_19746" data-name="Path 19746" d="M195.491,3.623c0,.585.01,1.17,0,1.755a1.8,1.8,0,1,1-3.606,0q-.02-1.781,0-3.561a1.8,1.8,0,1,1,3.606-.005c.013.6,0,1.2,0,1.806Z" transform="translate(-172.61 0)" fill="#328128" />
                              <path id="Path_19747" data-name="Path 19747" d="M75.506,3.642c0,.585.009,1.17,0,1.755a1.8,1.8,0,1,1-3.6.014q-.032-1.805,0-3.611a1.8,1.8,0,1,1,3.6.036c.009.6,0,1.2,0,1.806Z" transform="translate(-64.666 0)" fill="#328128" />
                              <path id="Path_19748" data-name="Path 19748" d="M120.12,26.685V24.36h5.973v2.325Z" transform="translate(-108.059 -21.915)" fill="#328128" />
                              <path id="Path_19749" data-name="Path 19749" d="M63,206.135c-.552,0-1.1.014-1.655,0a1.225,1.225,0,0,1-1.312-1.219,1.2,1.2,0,0,1,1.295-1.179c1.153-.018,2.308-.02,3.462,0a1.2,1.2,0,1,1,.017,2.392c-.6.025-1.2.005-1.806.005v0Z" transform="translate(-53.999 -183.273)" fill="#328128" />
                            </g>
                          </svg>
                          <span className='veritical-align-text-top ml-1'>Merchandise</span></h6>
                        <div className='text-dark fw-500 fs-6 px-4 py-2 px-sm-2'>
                          <a href="/">                  <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 33.547 31.336">
                            <g id="add-to-cart_1_" data-name="add-to-cart (1)" transform="translate(0.062 -0.009)">
                              <path id="Path_19728" data-name="Path 19728" d="M640.452-514.489H630.419a2.728,2.728,0,0,1,.467,2.233,2.862,2.862,0,0,1-1.318,1.859,2.75,2.75,0,0,1-3.3-.374,2.876,2.876,0,0,1-.383-3.7c-.093-.01-.181-.027-.265-.028-.654,0-1.308.008-1.963,0a2.15,2.15,0,0,1-2.176-1.921,2.12,2.12,0,0,1,1.489-2.327c.834-.291,1.677-.561,2.514-.841.142-.048.28-.1.445-.16l-1.047-3.889-3.7-13.755c-.135-.5-.266-.6-.782-.606h-2.168c-.45,0-.693-.2-.685-.561s.242-.541.67-.543c.781,0,1.563-.006,2.343,0a1.657,1.657,0,0,1,1.647,1.26c.245.874.475,1.751.72,2.656H635.5a8.073,8.073,0,0,0,3.165,7.663,8.12,8.12,0,0,0,8.16,1.327c-.124.986-.242,1.93-.363,2.873-.041.324-.068.654-.132.969a2.759,2.759,0,0,1-2.76,2.26c-2.8.008-5.6.042-8.393-.008a25.473,25.473,0,0,0-9.217,1.525c-.853.308-1.721.578-2.583.862a1.044,1.044,0,0,0-.8.912,1.085,1.085,0,0,0,.241.8,1.084,1.084,0,0,0,.737.391c.15.015.3.008.454.008h18.534a2.718,2.718,0,0,1,2.788,1.85,2.849,2.849,0,0,1-.977,3.219,2.8,2.8,0,0,1-3.353-.084,2.853,2.853,0,0,1-.872-3.247C640.215-514.067,640.33-514.255,640.452-514.489Z" transform="translate(-617.61 541.358)" fill="#328128" />
                              <path id="Path_19729" data-name="Path 19729" d="M828.489-548.606a7.066,7.066,0,0,1-7.234-7.324,7.229,7.229,0,0,1,7.29-7.171,7.231,7.231,0,0,1,7.218,7.21A7.066,7.066,0,0,1,828.489-548.606Zm.584-7.79v-2.7a.576.576,0,0,0-.569-.654c-.341,0-.554.251-.561.663,0,.489,0,.978,0,1.467v1.225h-2.7c-.406,0-.654.226-.654.567s.252.555.662.561c.489,0,.978,0,1.467,0h1.226v2.7c0,.4.226.654.567.654s.555-.253.561-.663c0-.489,0-.978,0-1.467v-1.225h.432c.768,0,1.537.007,2.306,0a.549.549,0,0,0,.515-.856.81.81,0,0,0-.561-.258c-.878-.029-1.761-.014-2.688-.014Z" transform="translate(-802.278 563.11)" fill="#328128" />
                            </g>
                          </svg></a>
                        </div>
                      </div>
                      <div className="row p-3 merchandise">
                        {typeof addOnsResponse !== 'undefined' && addOnsResponse !== null && addOnsResponse.merchandise !== 'undefined' && addOnsResponse.merchandise !== null ?

                          addOnsResponse.merchandise.map(e => {
                            merchandiseId.indexOf(e.id) === -1 ? merchandiseId.push(e.id) : '';
                            return <AddonCard key={e.id} response={e} decrementBy={1} incrementBy={1} />

                          })


                          : ''}

                        {/* // <AddonCard decrementBy={1} incrementBy={1} />
                  // <AddonCard decrementBy={1} incrementBy={1} />
                  // <AddonCard decrementBy={1} incrementBy={1} />
                  // <AddonCard decrementBy={1} incrementBy={1} />
                  // <AddonCard decrementBy={1} incrementBy={1} /> */}
                      </div>
                    </div>
                    : ''
                  }
                  <div className='bg-white card-boxshadow px-0 py-2 border-radius-15 mb-3'>
                    <h6 className='text-dark fw-500 fs-6 px-4 py-2 px-sm-2 card-border-bottom'>
                      <svg
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
                      </svg><span className='veritical-align-text-top ml-1'>Vehicle Details</span></h6>

                    {vehicleaccordian.length < 3 && (
                      <div className="ui form px-4 px-sm-2 vehicledetail">
                        <div className="field w-100 datePicker my-3">
                          <label className='fw-500 fs-7 mb-2'>Vehicle Type</label>
                          <input placeholder='Vehicle Type' value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} />
                        </div>
                        <div className="field w-100 datePicker my-3">
                          <label className='fw-500 fs-7 mb-2'>Year</label>

                          {/* <SemanticDatepicker placeholder='Year' formatOptions="yyyy" type='date' className='w-100' /> */}
                          <input placeholder='Year' className='w-100' value={year} onChange={(e) => setYear(e.target.value)} />
                        </div>
                        <div className="field w-100 datePicker my-3">
                          <label className='fw-500 fs-7 mb-2'>Brand</label>
                          <input placeholder='Brand' value={brand} onChange={(e) => setBrand(e.target.value)} />
                        </div>
                        <div className="field w-100 datePicker my-3">
                          <label className='fw-500 fs-7 mb-2'>Model</label>
                          <input placeholder='Model' value={model} onChange={(e) => setModel(e.target.value)} />
                        </div>
                        <div className="field w-100 datePicker my-3">
                          <label className='fw-500 fs-7 mb-2'>Color</label>
                          <input placeholder='Color' value={color} onChange={(e) => setColor(e.target.value)} />
                        </div>
                        <div className="field w-100 datePicker my-3">
                          <label className='fw-500 fs-7 mb-2'>Vehicle State</label>
                          <input placeholder='Vehicle State' value={vehicleState} onChange={(e) => setVehicleState(e.target.value)} />
                        </div>
                        <div className="field w-100 datePicker my-3">
                          <label className='fw-500 fs-7 mb-2'>Registration No</label>
                          <input placeholder='Registration No' value={registrationNo} onChange={(e) => setRegistrationNo(e.target.value)} />
                        </div>
                        <div className="field w-100 datePicker my-3">
                          <label className='fw-500 fs-7 mb-2'>License No</label>
                          <input placeholder='License No' value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} />
                        </div>
                        <div className={`text-success-dark mb-2 ${(vehicleType === '' && year === '' && brand === '' && color === '' && vehicleState === '' && registrationNo === '' && licenseNo === '') && `d-none`}`}>
                          <a onClick={e => VehicleFormSubmitHandler(e)} href="/" className='text-success fs-7 cursor-pointer'> <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 27.505 27.5">
                            <path id="floating" d="M577.346,2164.47h1.719c.468.061.939.108,1.4.186a13.8,13.8,0,0,1,11.276,11.2c.089.5.142,1.006.211,1.51v1.719c-.04.327-.075.656-.122.981a13.749,13.749,0,1,1-23.4-11.494,13.464,13.464,0,0,1,7.4-3.886C576.337,2164.593,576.843,2164.539,577.346,2164.47Zm2,14.892h4.82a1.14,1.14,0,1,0,.027-2.278c-1.5-.009-3.007,0-4.51,0h-.336v-4.813a1.118,1.118,0,0,0-.693-1.111,1.131,1.131,0,0,0-1.588,1.07c-.01,1.5,0,3.007,0,4.51v.344h-4.806a1.141,1.141,0,1,0-.055,2.28c1.512.011,3.025,0,4.537,0h.323v.364c0,1.477,0,2.953,0,4.43a1.141,1.141,0,1,0,2.28.068c.012-1.5,0-3.007,0-4.51Z" transform="translate(-564.451 -2164.47)" fill="#328128" />
                          </svg>
                            <span className='veritical-align-text-top ml-1 fs-7'>Add more</span></a>
                        </div>
                      </div>
                    )}
                    <div className='addon-accordion-div mt-5'>
                      {vehicleaccordian.map((data, index) => (
                        <AddOnAccordion RemoveFunction={removeVehicleForm} key={index} index={index} VehicleLength={data.VehicleAccordianLength} VehicleType={data.VehicleType} Year={data.Year} Brand={data.Brand} Model={data.Model} Color={data.Color} VehicleState={data.VehicleState} RegistrationNo={data.RegistrationNo} LicenseNo={data.LicenseNo} />
                      ))}
                    </div>
                  </div>
                </div>
                <Pricesummary ref={childRef} movinDate={getMoveindate} />
                <div className='col-12 col-md-5 pl-1 pl-sm-0 mb-3'>
                  <div className='bg-white card-boxshadow px-0 py-2 border-radius-15 border-top-success-4 d-none'>
                    <h6 className='text-success-dark fw-600 fs-6 px-4 pt-2 mb-1  px-sm-2'>Invoice Details</h6>
                    <p className='px-4 mb-2 px-sm-2 fw-400 text-light-gray'>Please see the breakdown below</p>
                    <div className='px-4 px-sm-2'>
                      <div className="py-2 card-border-secondary border-radius-10 mb-2">
                        <div className="content">
                          <p className='text-success-dark mb-1 fw-600 fs-6 px-1'>Unit-#123</p>
                          <div className="text-dark fw-500 mb-2 px-1">Billing Period ( 18-06-2021 to 17-06-2022)</div>
                          <div className='mb-2 d-flex justify-content-between text-light-gray fw-500 px-1'>
                            <span>Storage Unit-5'x10'</span><span>$90</span>
                          </div>
                          <div className='mb-2 card-border-bottom-dashed pb-1 d-flex justify-content-between text-light-gray fw-500 px-1'>
                            <span>NB HST (15%)</span><span >$14.25</span>
                          </div>
                          <p></p>
                          <div className="field w-100 datePicker mt-3 mb-2 px-1">
                            <label className='fs-6 fw-500'>Promo Code</label>
                            <div className='row mt-1'>
                              <div className='col-6'>
                                <p className='d-flex align-items-center'>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24.631 24.637">
                                    <path id="tick" d="M-81.811-487.2h-1.443a1.331,1.331,0,0,0-.186-.04,11.727,11.727,0,0,1-5.374-1.695,12.155,12.155,0,0,1-5.844-8.462c-.086-.461-.129-.931-.192-1.4v-1.443c.015-.085.032-.17.045-.256.076-.529.121-1.067.234-1.59A11.963,11.963,0,0,1-90-509.286a11.957,11.957,0,0,1,10.054-2.258A11.885,11.885,0,0,1-72.774-507a11.977,11.977,0,0,1,2.491,8.722,11.9,11.9,0,0,1-3,6.884,12.1,12.1,0,0,1-7.124,4.007C-80.874-487.306-81.343-487.26-81.811-487.2Zm-2.642-10.284c-.453-.418-.906-.83-1.354-1.238-.679-.621-1.345-1.263-2.053-1.852a1.178,1.178,0,0,0-1.878.633,1.271,1.271,0,0,0,.445,1.314q2,1.812,3.984,3.624a1.231,1.231,0,0,0,1.887-.047q3.828-3.792,7.651-7.589a2.755,2.755,0,0,0,.2-.211,1.23,1.23,0,0,0,.269-1.01,1.23,1.23,0,0,0-.606-.852,1.244,1.244,0,0,0-1.585.286q-3.378,3.372-6.753,6.75c-.061.061-.125.12-.2.192Z" transform="translate(94.85 511.833)" fill="#67c84e" />
                                  </svg>
                                  <span className='ml-1'>MONTH20 applied</span>
                                </p>
                              </div>
                              <div className='col-6 text-right'>
                                <p><span>$14.25</span></p>
                              </div>
                            </div>
                          </div>
                          <div className='row pb-1 mb-2 px-1 card-border-bottom-dashed'>
                            <div className='col-6'>
                              <p className='text-success'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 22 22.938">
                                  <g id="offer" transform="translate(-0.012 -0.021)">
                                    <path id="Path_16041" data-name="Path 16041" d="M11.235,22.959h-.448A2.634,2.634,0,0,1,9.309,22.1c-.338-.348-.7-.674-1.044-1.014a.752.752,0,0,0-.674-.22c-.568.083-1.138.159-1.706.247A2,2,0,0,1,3.47,19.438q-.17-.844-.3-1.7a.893.893,0,0,0-.521-.725c-.507-.252-1.006-.523-1.5-.793a2,2,0,0,1-.9-2.763c.25-.525.5-1.048.768-1.566a.834.834,0,0,0,0-.811C.754,10.572.5,10.055.256,9.537a2.008,2.008,0,0,1,.915-2.793c.506-.272,1.011-.545,1.523-.805a.832.832,0,0,0,.472-.66q.133-.828.283-1.653A2,2,0,0,1,5.8,1.864c.571.065,1.139.151,1.706.244A.844.844,0,0,0,8.3,1.863c.411-.412.834-.814,1.255-1.216a2,2,0,0,1,2.906,0q.648.619,1.288,1.246a.772.772,0,0,0,.695.224c.568-.084,1.137-.163,1.705-.249a2,2,0,0,1,2.4,1.669c.116.569.212,1.144.3,1.719a.864.864,0,0,0,.495.693c.5.25.99.521,1.483.784a2.013,2.013,0,0,1,.919,2.842c-.241.5-.478.995-.73,1.485a.865.865,0,0,0,0,.852c.261.511.511,1.028.758,1.546a2,2,0,0,1-.9,2.764c-.511.278-1.024.553-1.543.815a.834.834,0,0,0-.476.657c-.089.552-.185,1.1-.283,1.653A2.009,2.009,0,0,1,16.2,21.115c-.57-.07-1.139-.153-1.706-.245a.827.827,0,0,0-.774.242c-.332.334-.684.646-1.011.984a2.631,2.631,0,0,1-1.477.862Zm4.851-15.8a.739.739,0,0,0-.72-.693.759.759,0,0,0-.541.275L6.258,15.307a1.225,1.225,0,0,0-.149.166.658.658,0,0,0,.525,1.038.793.793,0,0,0,.6-.306q3.775-3.778,7.552-7.553c.338-.338.684-.667,1.009-1.017a2.8,2.8,0,0,0,.295-.476ZM13.65,12.6A2.423,2.423,0,1,0,16.079,15,2.42,2.42,0,0,0,13.65,12.6ZM8.372,10.382A2.424,2.424,0,1,0,5.944,7.974a2.424,2.424,0,0,0,2.429,2.408Z" transform="translate(0 0)" fill="#67be5c" />
                                    <path id="Path_16042" data-name="Path 16042" d="M224.734,249.857a1.093,1.093,0,0,1-1.106-1.082,1.1,1.1,0,1,1,2.2-.015A1.1,1.1,0,0,1,224.734,249.857Z" transform="translate(-211.069 -233.745)" fill="#67be5c" />
                                    <path id="Path_16043" data-name="Path 16043" d="M131.451,123.107a1.1,1.1,0,1,1-2.2.006,1.1,1.1,0,0,1,2.2-.006Z" transform="translate(-121.987 -115.154)" fill="#67be5c" />
                                  </g>
                                </svg>
                                <span className='veritical-align-text-bottom ml-1 cursor-pointer' onClick={() => SetApplyDiscountModal({ open: true, dimmer: 'blurring' })}>Use Promocode</span></p>
                            </div>
                            <div className='col-6 text-right'>
                              <p className='error cursor-pointer' onClick={() => SetApplyDiscountModal({ open: true, dimmer: 'blurring' })}>Change</p>
                            </div>
                          </div>
                          <div className='fw-600 d-flex justify-content-between px-1'>
                            <span>Total</span><span >$134.25</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className='row'>
                <div className='text-center col-12 my-2'>
                  <button onClick={() => navigate('/preBooking/rentingDetails')} className="ui button  basic border-success-dark-1 fs-7 fw-400 text-dark px-5 mr-2">BACK</button>
                  <button className="ui button bg-success-dark   fs-7 fw-400 text-white px-5" onClick={e => navigateTenantDEtails(e)}>NEXT</button>
                </div>
              </div>
            </div>
          </div>)}

      </div>
      <Modal
        dimmer={applyDiscountModal.dimmer}
        open={applyDiscountModal.open}
        onClose={() => SetApplyDiscountModal({ open: false })}
      >
        <Modal.Header className='bg-success-dark text-white text-center fs-6 py-2 fw-400 position-relative'>PROMO CODES
          <svg onClick={() => SetApplyDiscountModal({ open: false })} className='r-3 cursor-pointer position-absolute' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 17.473 17.47">
            <path id="wrong-5" d="M978.609-438.353l-2.052-2.043-4.37-4.366a1.33,1.33,0,0,1-.4-1.425,1.3,1.3,0,0,1,.833-.843,1.3,1.3,0,0,1,1.171.183,3.019,3.019,0,0,1,.353.321q3.009,3,6.009,6.01c.088.088.159.193.254.309.127-.118.217-.2.3-.281l6.156-6.156a1.332,1.332,0,0,1,1.325-.431,1.3,1.3,0,0,1,.927.828,1.3,1.3,0,0,1-.188,1.228,3.412,3.412,0,0,1-.325.35q-3,3.009-6.011,6.009a3.233,3.233,0,0,1-.317.244c.132.14.213.23.3.316q3.052,3.053,6.108,6.1a1.36,1.36,0,0,1,.441,1.387,1.305,1.305,0,0,1-2.205.564c-.59-.568-1.163-1.157-1.74-1.736l-4.487-4.491a2.068,2.068,0,0,1-.183-.248l-.142-.051a1.52,1.52,0,0,1-.191.325q-3.047,3.059-6.1,6.111a1.341,1.341,0,0,1-1.45.419,1.3,1.3,0,0,1-.851-.866,1.3,1.3,0,0,1,.235-1.19,3.215,3.215,0,0,1,.257-.274l6.034-6.033C978.386-438.167,978.484-438.245,978.609-438.353Z" transform="translate(-971.716 447.116)" fill="#fff" />
          </svg>
        </Modal.Header>
        <Modal.Content className='mh-400 overflow-y-auto'>
          <div className='row'>
            <div className='col-12 col-md-6 mb-3 px-1'>
              <div className='card-border-secondary-dashed p-2 border-radius-10'>
                <div className='row'>
                  <div className='col-sm-12 col-md-9 mb-1'>
                    <h5 className='fw-600 mb-1'>50% OFF 2 MONTHS</h5>
                    <p className='fs-7'>Lorem Ipsum has been the industry's</p>
                  </div>
                  <div className='col-sm-12 col-md-3 d-flex align-items-center justify-content-center'>
                    <button className="ui button text-success bg-white border-success-1  fs-7 fw-400 py-1 px-3">Apply</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </Modal.Content>
      </Modal>
    </>
  )

}
