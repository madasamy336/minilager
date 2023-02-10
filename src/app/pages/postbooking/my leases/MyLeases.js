import React from "react";
import { useEffect, useState } from "react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import { Menu, Modal, Tab, Loader, Placeholder, TextArea, Button } from "semantic-ui-react";
import InsuranceTabContent from "../../../components/postbooking/myleasestabs/InsuranceTabContent";
import MerchandiseTabContent from "../../../components/postbooking/myleasestabs/MerchandiseTabContent";
import ServicesTabContent from "../../../components/postbooking/myleasestabs/ServicesTabContent";
import instance from '../../../services/instance';
import request from '../../../services/request';
import Helper from "../../../helper";
import { useTranslation } from "react-i18next";

const helper = new Helper()
export default function MyLeases() {
  const { t, i18n } = useTranslation();
  const lease_document = sessionStorage.getItem('lease_document') || ""

  const [activeUnit, setactive] = useState('');
  const [ScheduleMoveOutMOdal, SetScheduleMoveOutModal] = useState({
    open: false,
    dimmer: undefined,
  })
  const [cancelScheduleMoveOutMOdal, CancelScheduleMoveOutMOdal] = useState({
    open: false,
    dimmer: undefined,
  })

  const [scheduleMoveOutDate, SetScheduleMoveOutDate] = useState({
    date: null,
    reason: "",
  })

  const [cancelscheduleMoveOut, CancelScheduleMoveOut] = useState({
    date: "",
    reason: "",
  })

  const [leaseResponse, setLeaseResponse] = useState([]);
  const [leaseInfoById, setLeaseInfoById] = useState([]);
  const [selectedUnitLeasedocument, setselectedUnitLeasedocument] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [bindScheduledMovedDate, setBindScheduledMovedDate] = useState(new Date());
  const [scheduleMoveOutDateValue, setScheduleMoveOutDateValue] = useState(new Date());

  const [isLoading, setLoading] = useState(true);
  const [isButtonLoading, setButtonLoading] = useState(false);

  const panes = [
    {
      menuItem: 'Insurance',
      render: () => <Tab.Pane attached={false}><InsuranceTabContent /></Tab.Pane>,
    },
    {
      menuItem: 'Services',
      render: () => <Tab.Pane attached={false}><ServicesTabContent /></Tab.Pane>,
    },
    {
      menuItem: 'Merchandise',
      render: () => <Tab.Pane attached={false}><MerchandiseTabContent /></Tab.Pane>,
    },
  ]
  const [ScheduleMovedOut, SetScheduleMovedOut] = useState(false)
  // const [scheduleMoveOutDate, SetScheduleMoveOutDate] = useState('')
  // const ScheduleMOveOut = (e) => {
  //   e.preventDefault();
  //   SetScheduleMovedOut(true);
  //   SetScheduleMoveOutModal(({
  //     open: false,
  //   }))
  // }

  const ScheduleMOveOut = () => {
    SetScheduleMoveOutModal({ open: true, dimmer: 'blurring' });
  }

  const CancelScheduleMOveOut = (scheduledDate) => {
    console.log(scheduledDate);
    setBindScheduledMovedDate(new Date(scheduledDate));
    CancelScheduleMoveOut({
      reason: ''
    })
    CancelScheduleMoveOutMOdal(({
      open: true,
    }))
  }
  // setLoading(true);

  useEffect(() => {
    fetchLeaseDetails();
  }, []);

  function fetchLeaseDetails() {
    let requestbody = {}
    let config = {
      headers: {
        "Content-Type": "application/json"
      }
    }
    let userId = localStorage.getItem('userid');

    instance.post(request.lease_search + "/" + userId, requestbody, config)
      .then(response => {
        return response;
      })
      .then(data => {
        const leases = data.data;
        if (typeof leases !== 'undefined' && leases !== null && leases !== '' && leases.isSuccess === true) {
          setLeaseResponse(leases.result);
          localStorage.setItem("leases", JSON.stringify(leases.result));
          if (leases?.result && leases.result.length > 0) {
            let loadDefaultUnit = leases.result.filter(x => x.unitInfo.id === leases.result[0].unitInfo.id);
            console.log("loadDefaultUnit", loadDefaultUnit);
            console.log("setactive", leases.result[0].unitInfo.id);
            setLeaseInfoById(loadDefaultUnit);
            setactive(leases.result[0].unitInfo.id);
            SetScheduleMoveOutDate({ ...scheduleMoveOutDate, ["date"]: leases.result[0].leaseInfo.moveOutScheduledOn })
            sixStorageLeaseagreement(leases.result[0].leaseInfo.id)
          } else {
            setLeaseInfoById([]);
          }
          setLoading(false);
        }
      }).catch(err => {
        console.log(err)
      })
  }

  function sixStorageLoadUnitsFirst() {
    // setLoading(true);
    console.log(leaseResponse);
    if (typeof leaseResponse !== 'undefined' && leaseResponse !== null && leaseResponse !== '' && leaseResponse.length > 0) {
      setactive(leaseResponse[0].unitInfo.id);
      // let firstUnitsDetails = leaseResponse[0].unitInfo.id;

      let loadDefaultUnit = leaseResponse.filter(x => x.unitInfo.id === leaseResponse[0].unitInfo.id);
      console.log("loadDefaultUnit", loadDefaultUnit);
      setLeaseInfoById(loadDefaultUnit);
      // setLoading(false);
      // setLeaseHaveValue(true)
    }
    // else {
    // setLeaseHaveValue(false)
    // }
  }

  function addScheduleMOveOutDate(data) {
    setButtonLoading(true)
    if(scheduleMoveOutDate.reason.length === 0){
      setErrorMessage(t("Please Enter Reason"));
      setButtonLoading(false)
      return

    }
    setErrorMessage('');
    // console.log(leaseId)
    let config = {
      headers: {
        "Content-Type": "application/json"
      }
    }
    let userId = localStorage.getItem('userid');
    const requestbody = {
      unitNumber: data.unitInfo.unitNumber,
      scheduleDate: scheduleMoveOutDateValue,
      reason: scheduleMoveOutDate.reason,
      tenantId: userId
    }
    console.log(requestbody)
    instance.post(request.move_out + data.leaseInfo.id, requestbody, config)
      .then(response => {
        return response;
      })
      .then(data => {
        const res = data.data;
        console.log("sixStorageScheduleMoveOut", res);
        if (res.isSuccess !== false && res.isSuccess === true && res.returnCode === 'SUCCESS') {
          setTimeout(function () {
            SetScheduleMoveOutModal(({
              open: false,
            }))
            SetScheduleMoveOutDate({
              reason: ''
            })
            CancelScheduleMoveOut({
              reason: ''
            })
            fetchLeaseDetails()
            setButtonLoading(false);
          }, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
  }

  function cancelScheduleMOveOutDate(data) {
    setButtonLoading(true);
    if(scheduleMoveOutDate.reason.length === 0){
      setErrorMessage(t("Please Enter Reason"));
      setButtonLoading(false)
      return

    }
    setErrorMessage("");
    console.log(data);
    console.log(bindScheduledMovedDate);
    // console.log(leaseId)
    let config = {
      headers: {
        "Content-Type": "application/json"
      }
    }
    let userId = localStorage.getItem('userid');
    const requestbody = {
      unitNumber: data.unitInfo.unitNumber,
      scheduleDate: bindScheduledMovedDate,
      reason: scheduleMoveOutDate.reason,
      tenantId: userId
    }
    console.log(requestbody)
    instance.post(request.cancel_move_out + data.leaseInfo.id + `/${userId}`, requestbody, config)
      .then(response => {
        return response;
      })
      .then(data => {
        const res = data.data;
        console.log("sixStorageScheduleMoveOut", res);
        if (res.isSuccess !== false && res.isSuccess === true && res.returnCode === 'SUCCESS') {
          setTimeout(function () {
            CancelScheduleMoveOutMOdal(({
              open: false,
            }))
            CancelScheduleMoveOut({
              reason: ''
            })
            fetchLeaseDetails()
            setButtonLoading(false);
          }, 2000)
        }
      }).catch(err => {
        console.log(err)
      })
  }

  function sixStorageViewLeaseInfo(lease) {
    let showUnitLeasevalue = leaseResponse.filter(x => x.unitInfo.id === lease.unitInfo.id);
    console.log(showUnitLeasevalue[0].unitInfo.unitNumber)
    setactive(showUnitLeasevalue[0].unitInfo.id);
    setLeaseInfoById(showUnitLeasevalue);
    sixStorageLeaseagreement(showUnitLeasevalue[0].leaseInfo.id);
  }

  function sixStorageLeaseagreement(contract_id) {
    console.log("Trigger");
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let userId = localStorage.getItem('userid');
    const data = {
      "contractId": contract_id,
      "tenantId": userId
    }
    instance.post(request.lease_documents, data, config)
      .then(response => {
        console.log("response", response);
        return response;
      }).then(data => {
        console.log("data", data);
        if (typeof data !== 'undefined' || data !== null) {
          if (data.status == 200 && data.data.isSuccess == true) {
            data.data.result.map(val => {
              // if (val.documentName === 'Leaseagreement') {
                setselectedUnitLeasedocument(val.documentPath);
                console.log(val.documentPath);
                sessionStorage.setItem('lease_document', val.documentPath)
                console.log("Sets");
              // }
            })
          } else {
            setselectedUnitLeasedocument("No Record Found");
            sessionStorage.setItem('lease_document', 'No Record Found')
          }
        }
      }).catch(err => {
        console.log(err);
      })
  }


  // Open Pdf File to New Tab and Download
  const download = (path) => {
    const anchor = document.createElement('a');
    anchor.href = path;
    anchor.download = "Rental Agreement";
    anchor.target = "_blank"
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  function sixStorageChangeReason(e) {
    console.log(e.target.value)
  }

  function handleChange(_e, data) {
    console.log(data);
    SetScheduleMoveOutDate({ ...scheduleMoveOutDate, [data.name]: data.value })
  }



  return isLoading ? (
    <Loader size='large' active>Loading</Loader>
  ) : (
    <div className="mx-2 mx-sm-1">
      {typeof leaseResponse !== 'undefined' && leaseResponse !== null && leaseResponse !== '' && leaseResponse.length > 0 ?
        <Menu secondary className="myLeaseUnitMenu overflow-x-auto pb-1">
          {leaseResponse.map((lease, i) => (
            <Menu.Item className="py-1 px-4"
              key={i}
              name={lease.unitInfo.unitNumber}
              active={activeUnit == lease.unitInfo.id}
              onClick={() => sixStorageViewLeaseInfo(lease)}
            />
          ))}
        </Menu> : ""}
      {typeof leaseInfoById !== 'undefined' && leaseInfoById !== null && leaseInfoById !== "" && leaseInfoById.length > 0 ? (
        <div className="bg-white card-boxShadow border-radius-15  mb-2">
          <div className="row dashed-bottom px-4 py-1 px-sm-2">
            <div className="col-6">
              <h6 className="fs-6 fw-500 pt-1"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 21.698 27.198">
                <path id="building-svgrepo-com_1_" data-name="building-svgrepo-com (1)" d="M39.106,27.2h0L29,27.179H18.18a.386.386,0,0,1-.386-.386V9.412a.386.386,0,0,1,.386-.386h5.395V.386A.386.386,0,0,1,23.962,0H39.106a.386.386,0,0,1,.386.386V26.812a.386.386,0,0,1-.386.386Zm-9.722-.791,9.336.018V.773H24.348V9.025H29a.386.386,0,0,1,.386.386Zm-10.817,0H28.611V9.8H18.567Zm8.852-2.51H24.362a.386.386,0,0,1-.386-.386V21.721a.386.386,0,0,1,.386-.386h3.057a.386.386,0,0,1,.386.386V23.51A.386.386,0,0,1,27.419,23.9Zm-2.67-.773h2.284V22.108H24.749Zm-1.932.773H19.76a.386.386,0,0,1-.386-.386V21.721a.386.386,0,0,1,.386-.386h3.057a.386.386,0,0,1,.386.386V23.51A.386.386,0,0,1,22.816,23.9Zm-2.67-.773H22.43V22.108H20.146ZM36.48,23.7H35a.386.386,0,0,1-.386-.386V21.706A.386.386,0,0,1,35,21.319H36.48a.386.386,0,0,1,.386.386v1.606A.386.386,0,0,1,36.48,23.7Zm-1.091-.773h.705v-.833h-.705Zm-3.171.773H30.741a.386.386,0,0,1-.386-.386V21.706a.386.386,0,0,1,.386-.386h1.478a.386.386,0,0,1,.386.386v1.606A.386.386,0,0,1,32.218,23.7Zm-1.091-.773h.705v-.833h-.705ZM27.419,20.4H24.362a.386.386,0,0,1-.386-.386V18.226a.386.386,0,0,1,.386-.386h3.057a.386.386,0,0,1,.386.386v1.789A.386.386,0,0,1,27.419,20.4Zm-2.67-.773h2.284V18.612H24.749Zm-1.932.773H19.76a.386.386,0,0,1-.386-.386V18.226a.386.386,0,0,1,.386-.386h3.057a.386.386,0,0,1,.386.386v1.789A.386.386,0,0,1,22.816,20.4Zm-2.67-.773H22.43V18.612H20.146Zm16.334.22H35a.386.386,0,0,1-.386-.386V17.856A.386.386,0,0,1,35,17.47H36.48a.386.386,0,0,1,.386.386v1.606A.386.386,0,0,1,36.48,19.848Zm-1.091-.773h.705v-.833h-.705Zm-3.171.773H30.741a.386.386,0,0,1-.386-.386V17.856a.386.386,0,0,1,.386-.386h1.478a.386.386,0,0,1,.386.386v1.606A.386.386,0,0,1,32.218,19.848Zm-1.091-.773h.705v-.833h-.705Zm-3.708-2.17H24.362a.386.386,0,0,1-.386-.386V14.731a.386.386,0,0,1,.386-.386h3.057a.386.386,0,0,1,.386.386V16.52A.386.386,0,0,1,27.419,16.906Zm-2.67-.773h2.284V15.117H24.749Zm-1.932.773H19.76a.386.386,0,0,1-.386-.386V14.731a.386.386,0,0,1,.386-.386h3.057a.386.386,0,0,1,.386.386V16.52A.386.386,0,0,1,22.816,16.906Zm-2.67-.773H22.43V15.117H20.146ZM36.48,16H35a.386.386,0,0,1-.386-.386V14.007A.386.386,0,0,1,35,13.62H36.48a.386.386,0,0,1,.386.386v1.606A.386.386,0,0,1,36.48,16Zm-1.091-.773h.705v-.833h-.705ZM32.218,16H30.741a.386.386,0,0,1-.386-.386V14.007a.386.386,0,0,1,.386-.386h1.478a.386.386,0,0,1,.386.386v1.606A.386.386,0,0,1,32.218,16Zm-1.091-.773h.705v-.833h-.705Zm-3.708-1.815H24.362a.386.386,0,0,1-.386-.386V11.236a.386.386,0,0,1,.386-.386h3.057a.386.386,0,0,1,.386.386v1.789A.386.386,0,0,1,27.419,13.411Zm-2.67-.773h2.284V11.622H24.749Zm-1.932.773H19.76a.386.386,0,0,1-.386-.386V11.236a.386.386,0,0,1,.386-.386h3.057a.386.386,0,0,1,.386.386v1.789A.386.386,0,0,1,22.816,13.411Zm-2.67-.773H22.43V11.622H20.146Zm16.334-.489H35a.386.386,0,0,1-.386-.386V10.157A.386.386,0,0,1,35,9.771H36.48a.386.386,0,0,1,.386.386v1.606A.386.386,0,0,1,36.48,12.149Zm-1.091-.773h.705v-.833h-.705Zm-3.171.773H30.741a.386.386,0,0,1-.386-.386V10.157a.386.386,0,0,1,.386-.386h1.478a.386.386,0,0,1,.386.386v1.606A.386.386,0,0,1,32.218,12.149Zm-1.091-.773h.705v-.833h-.705ZM36.48,8.3H35a.386.386,0,0,1-.386-.386V6.307A.386.386,0,0,1,35,5.921H36.48a.386.386,0,0,1,.386.386V7.913A.386.386,0,0,1,36.48,8.3Zm-1.091-.773h.705V6.694h-.705ZM32.218,8.3H30.741a.386.386,0,0,1-.386-.386V6.307a.386.386,0,0,1,.386-.386h1.478a.386.386,0,0,1,.386.386V7.913A.386.386,0,0,1,32.218,8.3Zm-1.091-.773h.705V6.694h-.705ZM27.956,8.3H26.479a.386.386,0,0,1-.386-.386V6.307a.386.386,0,0,1,.386-.386h1.478a.386.386,0,0,1,.386.386V7.913A.386.386,0,0,1,27.956,8.3Zm-1.091-.773h.705V6.694h-.705ZM36.48,4.45H35a.386.386,0,0,1-.386-.386V2.458A.386.386,0,0,1,35,2.071H36.48a.386.386,0,0,1,.386.386V4.064A.386.386,0,0,1,36.48,4.45Zm-1.091-.773h.705V2.844h-.705Zm-3.171.773H30.741a.386.386,0,0,1-.386-.386V2.458a.386.386,0,0,1,.386-.386h1.478a.386.386,0,0,1,.386.386V4.064A.386.386,0,0,1,32.218,4.45Zm-1.091-.773h.705V2.844h-.705Zm-3.171.773H26.479a.386.386,0,0,1-.386-.386V2.458a.386.386,0,0,1,.386-.386h1.478a.386.386,0,0,1,.386.386V4.064A.386.386,0,0,1,27.956,4.45Zm-1.091-.773h.705V2.844h-.705Z" transform="translate(-17.794)" fill="#328128" />
              </svg>
                <span className="veritical-align-text-top ml-1">{t("Unit Details")}</span></h6>
            </div>
          </div>
          {leaseInfoById[0].leaseInfo.moveOutScheduledOn == null || typeof leaseInfoById[0].leaseInfo.moveOutScheduledOn == 'undefined' || leaseInfoById[0].leaseInfo.moveOutScheduledOn == '' || leaseInfoById[0].leaseInfo.moveOutScheduledOn.length == 0 ?
            <div className="col-6 text-right" >
              <button onClick={() => ScheduleMOveOut()} className="ui button basic box-shadow-none border-success-dark-light-1 fs-7 fw-400  px-1 m-2">
                <img height="16" width="16" src="/assets/images/calendar.svg" alt="calendar" />
                <span className="text-success ml-1 veritical-align-text-top fw-600" >{t("Schedule Move-Out")}</span></button>
            </div> :
            <div className="col-12 col-md-6 text-right" >
              <span className="text-secondary fw-500">{t("Schedule Move-Out date")}:<span className="mx-1 text-success">{leaseInfoById[0].leaseInfo.moveOutScheduledOn}</span></span>
              <button className="ui button bg-success-dark cancel-shecdule-btn fs-7 fw-400 text-white px-3 py-1 m-2" onClick={e => CancelScheduleMOveOut(leaseInfoById[0].leaseInfo.moveOutScheduledOn)}>Cancel</button>
            </div>
          }
          <div className="py-4 px-3">
            <div className="row">
              <div className="col-lg-5 col-md-5 col-12 px-1">
                <div className='card-img border-radius-15 text-center p-2 unitDetails-card-image'>
                  <img height='190' width='190' src='/assets/images/units.png' alt='Units' />
                </div>
              </div>
              <div className="col-lg-7 col-md-7 col-12 px-1">
                <div className="card-desc  p-2 border-radius-10 mt-sm-2 mb-sm-2">
                  <div className=""> <h2 className="fs-3 fw-600 mb-3 d-inline-block mr-1  ">#{leaseInfoById[0].unitInfo.unitNumber}</h2>
                    {leaseInfoById[0].unitInfo.dueAmount > 0 ? (<span className={`danger-label-leases veritical-align-super py-1 px-2 fw-500`}>
                      {t("Poor Standing")}
                    </span>) :
                      <span className={`success-label-leases veritical-align-super py-1 px-2 fw-500`}>
                        {t("Good Standing")}
                      </span>}
                    {/* {leaseInfoById[0].leaseInfo.gateStatus.descreption == 'Denied' && <span className={`danger-label-leases veritical-align-super py-1 px-2 fw-500`}>
                      {t("Access Denied")}
                    </span>}
                    {leaseInfoById[0].leaseInfo.gateStatus.descreption == 'Active' && <span className={`success-label-leases veritical-align-super py-1 px-2 fw-500`}>
                      {t("Active")}
                    </span>}
                    {leaseInfoById[0].leaseInfo.gateStatus.descreption == 'Overlocked' && <span className={`danger-label-leases veritical-align-super py-1 px-2 fw-500`}>
                      {t("Overlocked")}
                    </span>} */}
                  </div>
                  <div className="pb-1 mb-1 d-flex align-items-center"><img width='18' height='18' src='/assets/images/selfstorage.svg' alt='Self Storage' /><span className='ml-1'>{leaseInfoById[0].unitInfo.storageType.name} - <strong className="fw-700"> {helper.displayMeasurementSize(leaseInfoById[0].unitInfo.unitMeasurement, leaseInfoById[0].unitInfo.measurementType)} </strong> ({leaseInfoById[0].unitInfo.unitType.name})</span></div>
                  <div className='d-flex align-items-center'><img width='18' height='18' src='/assets/images/location-new.svg' alt='Self Storage' /><span className='ml-1'>{leaseInfoById[0].unitInfo.building.name}, {leaseInfoById[0].unitInfo.location.name}</span></div>
                  {leaseInfoById[0].unitInfo.amenityInfoList !== "undefined" && leaseInfoById[0].unitInfo.amenityInfoList !== null && leaseInfoById[0].unitInfo.amenityInfoList.length > 0 ? (<div className='d-flex flex-wrap esign-amenitiy mt-2'>
                    {leaseInfoById[0].unitInfo.amenityInfoList.map((amenities, i) => {
                      return <div className='d-flex align-items-center my-2 mr-2' key={i}>
                        <img src={amenities.imageUrl} style={{ width: 15, height: 15 }} />
                        <span className="ml-1">{amenities.name}</span>
                      </div>
                    })}
                  </div>) : ""}
                </div>
              </div>

            </div>
          </div>
        </div>
      ) : `${t("No records found")}`}

      {/* <div className="bg-white card-boxShadow border-radius-15  mb-2">
        <div className=" dashed-bottom px-4 py-1 px-sm-2">

          <h6 className="fs-6 fw-500 pt-1"><svg id="select_product" data-name="select product" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 31.305 31.48">
            <path id="Path_392" data-name="Path 392" d="M655.7-1327.392h-9.21c-.6,0-.756-.152-.756-.752q0-7.113.007-14.227a1.539,1.539,0,0,1,.15-.656c.632-1.295,1.289-2.577,1.926-3.87a.686.686,0,0,1,.69-.434q7.193.01,14.387,0a.689.689,0,0,1,.693.431c.635,1.293,1.291,2.576,1.926,3.87a1.474,1.474,0,0,1,.147.624q.013,7.146.006,14.292c0,.557-.165.721-.722.721Zm2.622-14.681v5.626c0,.591-.35.806-.885.543-.509-.25-1.01-.517-1.525-.754a.559.559,0,0,0-.413,0c-.505.231-1,.492-1.5.738-.588.289-.924.077-.924-.584v-5.557H646.8v13.6h17.787v-13.611Zm-5.126-1.072q.386-1.552.771-3.1a.445.445,0,0,0-.094-.03c-1.671,0-3.342-.006-5.014.005a.4.4,0,0,0-.277.2c-.224.412-.425.837-.634,1.256l-.831,1.664Zm11.09.007c-.5-.991-.974-1.932-1.434-2.883a.4.4,0,0,0-.423-.263c-1.576.01-3.146.005-4.719.006-.088,0-.17.009-.284.017.263,1.051.525,2.086.78,3.12Zm-10.143,1.074v4.9c.417-.207.811-.387,1.191-.594a.713.713,0,0,1,.741,0c.381.205.773.387,1.182.589v-4.892Zm.136-1.075h2.843l-.779-3.119h-1.286Z" transform="translate(-644.844 1347.33)" fill="#328128" />
            <path id="Path_393" data-name="Path 393" d="M657.474-1106.249c0-.3-.006-.568,0-.839a.52.52,0,0,1,.569-.573q2.047-.01,4.1,0a.525.525,0,0,1,.576.568c.005.142,0,.283,0,.479h3.5c.519,0,.7.175.7.679v7.047c0,.488-.183.666-.678.667h-3.518c0,.175.006.334,0,.492a.517.517,0,0,1-.557.553q-2.064.011-4.128,0a.517.517,0,0,1-.556-.554c-.005-.109,0-.218,0-.327v-.35c-.263.126-.5.223-.714.35a2.907,2.907,0,0,1-1.534.37c-2.774-.016-5.549,0-8.323-.019a2.247,2.247,0,0,1-1.051-.273c-3.035-1.728-6.055-3.48-9.078-5.228a2.107,2.107,0,0,1-1.061-2.526,2.087,2.087,0,0,1,3.065-1.157c1.6.9,3.179,1.828,4.767,2.744.1.058.208.115.332.184a2.564,2.564,0,0,1,1.623-.969c2.6-.684,5.2-1.4,7.81-2.075a2.235,2.235,0,0,1,.995-.007c.949.2,1.886.457,2.828.69C657.232-1106.3,657.338-1106.279,657.474-1106.249Zm0,1.093c-1.176-.293-2.317-.585-3.462-.858a1.136,1.136,0,0,0-.514.03c-.687.175-1.369.364-2.054.548l-6.065,1.628a1.024,1.024,0,0,0-.822.832,1.047,1.047,0,0,0,1.4,1.184q3.05-.814,6.1-1.633a.519.519,0,0,1,.7.345.515.515,0,0,1-.052.414.513.513,0,0,1-.341.239c-2.116.571-4.227,1.163-6.353,1.688a2.044,2.044,0,0,1-2.49-1.944.441.441,0,0,0-.27-.425c-.76-.429-1.513-.876-2.269-1.307-.907-.525-1.813-1.051-2.723-1.568a1.023,1.023,0,0,0-1.171.064.972.972,0,0,0-.394,1.04,1.107,1.107,0,0,0,.609.766q4.525,2.606,9.047,5.213a1.317,1.317,0,0,0,.62.149c2.741.009,5.482,0,8.224.011a2.132,2.132,0,0,0,1.124-.263c.367-.213.9-.307,1.086-.618s.07-.844.071-1.279C657.476-1102.311,657.474-1103.719,657.474-1105.155Zm4.181-1.436h-3.107v8.353h3.107Zm1.087,1.04v6.254h3.11v-6.254Z" transform="translate(-635.609 1128.651)" fill="#328128" />
          </svg>
            <span className="veritical-align-super ml-1">Add Ons</span></h6>
        </div>
        <div className="py-1 px-3">
          <Tab className="MyleasesTab" menu={{ secondary: true, pointing: true }} panes={panes} />
        </div>
      </div> */}
      <div className="bg-white card-boxShadow border-radius-15  mb-2">
        <div className=" dashed-bottom px-4 py-1 px-sm-2">

          <h6 className="fs-6 fw-500 pt-1">
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
            <span className="veritical-align-super ml-1">{t("Rental Agreement")}</span></h6>
        </div>
        <div className="py-1 px-3">
          {selectedUnitLeasedocument !== "No Record Found" ?
            <div className='bg-layout'>
              <div className=' overflow-auto'>
                <div className="rentalAgreementContainer">
                  {/* for document preview */}
                  {selectedUnitLeasedocument !== "No Record Found" ? <iframe src={selectedUnitLeasedocument} width="100%" height="900px"></iframe> : <div className='text-center'> {t("No Record Found")}</div>}
                </div>
              </div>
              <div className='text-center'>
                <button className="ui button basic box-shadow-none border-success-dark-light-1 fs-8 px-2 py-1 my-2" onClick={() => download(selectedUnitLeasedocument)}>{t("Preview to Download")}</button>
              </div>

            </div> :
            <div className='bg-layout'>
              <div className='text-center'>
                <div className=' overflow-auto'>
                  <div className="rentalAgreementContainer d-flex justify-content-center align-items-center">
                    <div className='text-center'> {t("No Record Found")}</div>
                  </div>
                </div>

              </div>

            </div>


          }

        </div>
      </div>
      <Modal
        dimmer={ScheduleMoveOutMOdal.dimmer}
        open={ScheduleMoveOutMOdal.open}
        size='tiny'
        onClose={() => SetScheduleMoveOutModal({ open: false })}
      >
        <Modal.Header className='bg-success-dark text-white text-center fs-6 py-2 fw-400 position-relative'>Schedule Move-Out

          {!isButtonLoading && <svg onClick={() => SetScheduleMoveOutModal({ open: false })} className='r-3 cursor-pointer position-absolute' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 17.473 17.47">
            <path id="wrong-5" d="M978.609-438.353l-2.052-2.043-4.37-4.366a1.33,1.33,0,0,1-.4-1.425,1.3,1.3,0,0,1,.833-.843,1.3,1.3,0,0,1,1.171.183,3.019,3.019,0,0,1,.353.321q3.009,3,6.009,6.01c.088.088.159.193.254.309.127-.118.217-.2.3-.281l6.156-6.156a1.332,1.332,0,0,1,1.325-.431,1.3,1.3,0,0,1,.927.828,1.3,1.3,0,0,1-.188,1.228,3.412,3.412,0,0,1-.325.35q-3,3.009-6.011,6.009a3.233,3.233,0,0,1-.317.244c.132.14.213.23.3.316q3.052,3.053,6.108,6.1a1.36,1.36,0,0,1,.441,1.387,1.305,1.305,0,0,1-2.205.564c-.59-.568-1.163-1.157-1.74-1.736l-4.487-4.491a2.068,2.068,0,0,1-.183-.248l-.142-.051a1.52,1.52,0,0,1-.191.325q-3.047,3.059-6.1,6.111a1.341,1.341,0,0,1-1.45.419,1.3,1.3,0,0,1-.851-.866,1.3,1.3,0,0,1,.235-1.19,3.215,3.215,0,0,1,.257-.274l6.034-6.033C978.386-438.167,978.484-438.245,978.609-438.353Z" transform="translate(-971.716 447.116)" fill="#fff" />
          </svg>}
        </Modal.Header>
        <Modal.Content className=' p-1'>
          <div className="ui form px-4 px-sm-2">
            <div className="field w-100 datePicker my-3">
              <label className='fw-500 fs-7 mb-1' >{t("Schedule Move-Out Date")}</label>
              <SemanticDatepicker datePickerOnly disabled={isButtonLoading} showToday={true} value={scheduleMoveOutDateValue} name="date" onChange={(e, { name, value }) => SetScheduleMoveOutDate(name, value)} placeholder='Select date' className='w-100' />
            </div>
            <div className="field w-100  my-3">
              <label className='fw-500 fs-7 mb-1' >{t("Reason")} <i className="text-danger">*</i></label>
              <TextArea disabled={isButtonLoading} placeholder='Please tell us reason' name="reason" value={scheduleMoveOutDate.reason} onChange={(e, data) => handleChange(e, data)} />
              <div className="text-danger">{errorMessage} </div>
            </div>
            <div className='text-center my-6'>
              <Button className="ui button bg-success-dark fs-7 fw-400 text-white px-3 py-1" disabled={isButtonLoading} loading={isButtonLoading} onClick={() => addScheduleMOveOutDate(leaseInfoById[0])}>Schedule</Button>
            </div>
          </div>
        </Modal.Content>
      </Modal>

      <Modal
        dimmer={cancelScheduleMoveOutMOdal.dimmer}
        open={cancelScheduleMoveOutMOdal.open}
        size='tiny'
        onClose={() => CancelScheduleMoveOutMOdal({ open: false })}
      >
        <Modal.Header className='bg-success-dark text-white text-center fs-6 py-2 fw-400 position-relative'>Cancel Schedule Move-Out

          {!isButtonLoading && <svg onClick={() => CancelScheduleMoveOutMOdal({ open: false })} className='r-3 cursor-pointer position-absolute' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 17.473 17.47">
            <path id="wrong-5" d="M978.609-438.353l-2.052-2.043-4.37-4.366a1.33,1.33,0,0,1-.4-1.425,1.3,1.3,0,0,1,.833-.843,1.3,1.3,0,0,1,1.171.183,3.019,3.019,0,0,1,.353.321q3.009,3,6.009,6.01c.088.088.159.193.254.309.127-.118.217-.2.3-.281l6.156-6.156a1.332,1.332,0,0,1,1.325-.431,1.3,1.3,0,0,1,.927.828,1.3,1.3,0,0,1-.188,1.228,3.412,3.412,0,0,1-.325.35q-3,3.009-6.011,6.009a3.233,3.233,0,0,1-.317.244c.132.14.213.23.3.316q3.052,3.053,6.108,6.1a1.36,1.36,0,0,1,.441,1.387,1.305,1.305,0,0,1-2.205.564c-.59-.568-1.163-1.157-1.74-1.736l-4.487-4.491a2.068,2.068,0,0,1-.183-.248l-.142-.051a1.52,1.52,0,0,1-.191.325q-3.047,3.059-6.1,6.111a1.341,1.341,0,0,1-1.45.419,1.3,1.3,0,0,1-.851-.866,1.3,1.3,0,0,1,.235-1.19,3.215,3.215,0,0,1,.257-.274l6.034-6.033C978.386-438.167,978.484-438.245,978.609-438.353Z" transform="translate(-971.716 447.116)" fill="#fff" />
          </svg>}
        </Modal.Header>
        <Modal.Content className=' p-1'>
          <div className="ui form px-4 px-sm-2">
            <div className="field w-100 datePicker my-3">
              <label className='fw-500 fs-7 mb-1' >Cancel Schedule Move-Out Date</label>
              <SemanticDatepicker datePickerOnly disabled={true} name="date" onChange={(e, data) => handleChange(e, data)} value={bindScheduledMovedDate} placeholder='Select date' className='w-100' />
            </div>
            <div className="field w-100  my-3">
              <label className='fw-500 fs-7 mb-1' >{t("Reason")}</label>
              <TextArea disabled={isButtonLoading} required placeholder='Please tell us reason' name="reason" value={scheduleMoveOutDate.reason} onChange={(e, data) => handleChange(e, data)} />
              <div className="text-danger">{errorMessage} </div>
            </div>
            <div className='text-center my-6'>
              <Button className="ui button bg-success-dark fs-7 fw-400 text-white px-3 py-1" disabled={isButtonLoading} loading={isButtonLoading} onClick={() => cancelScheduleMOveOutDate(leaseInfoById[0])}>Schedule</Button>
            </div>
          </div>
        </Modal.Content>
      </Modal>
    </div>
  )
}
