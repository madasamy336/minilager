import PreBookingBreadcrumb from "../components/prebooking breadcrumb/PreBookingBreadcrumb";
import { Dropdown, Image, Input, Modal } from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import React, { useEffect, useState } from "react";
import TenantDetailEmergengyContactAccordian from "../components/tenantDetailsAccordian/TenantDetailsAccordian";
import { json, useNavigate } from "react-router-dom";
import countriecodes from "../components/CountryCode";
import instance from '../services/instance';
import request from '../services/request';
import Helper from "../helper";
let helper = new Helper();


export default function TenantDetails() {
  let userid = localStorage.getItem("userid");
  let preferredStorageValue = JSON.parse(sessionStorage.getItem("preferredStorage"));
  let leaseProfileId = sessionStorage.getItem('leaseProfileid');
  let emergencyDetail = sessionStorage.getItem('emergencyDetail');
  const navigate = useNavigate();
  const [profileImageSrc, setprofileImageSrc] = useState({
    img: '/assets/images/userDemoProfile.svg'
  });
  // <button onClick={e => tenantInfoFinal(e)} className="ui button bg-success-dark   fs-7 fw-400 text-white px-5">NEXT</button>
  // <button onClick={() => SetCreditCheckModal({ open: true, dimmer: 'blurring' })} className="ui button bg-success-dark   fs-7 fw-400 text-white px-5">NEXT</button>
  const [TenantInfoDetails, setTenantInfoDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    phoneNumber: '',
    addressLineOne: '',
    addressLineTwo: '',
    city: '',
    country: '',
    state: '',
    zipCode: '',
    ssn: '',

  });

  const [TenantInfoError, setTenantInfoError] = useState({
    firstName: '',
    email: '',
    phoneNumber: '',
    addressLineOne:'',
    city: '',
    state:'',
    zipCode:''
  });

  const [emergencyContactDetails, setEmergencyContactDetails] = useState({
    emergencyFname: '',
    emergencylname: '',
    emergencyemail: '',
    emergencyphoneno: ''
  });

  const [emergencyContactErr, setEmergencyContactErr] = useState({
    emergencyFname: '',
    emergencyemail: '',
    emergencyphoneno: '',
  });


  const [imguploadStatus, SetimguploadStatus] = useState(false);
  const [contactaccordian, SetContactaccordian] = useState([]);
  

  const [creditStatus, SetCreditStatus] = useState(false);
  const [creditCheckModal, SetCreditCheckModal] = useState({
    open: false,
    dimmer: undefined,
  })

  const handlechange = (e) => {
    e.persist();
    const { name, value } = e.target;
    setTenantInfoDetails({ ...TenantInfoDetails, [name]: value });
  }
  const validateemergencycontactInfo = (e) => {

    const { name } = e.target;
    const value = emergencyContactDetails[name];
    let message = '';
    if (!value && name === "emergencyFname") {
      message = 'First Name is Required';
    }
    if (!value && name === "emergencyemail") {
      message = 'Email is Required';
    }
    if (value && name === "emergencyemail" && !/\S+@\S+\.\S+/.test(value)) {
      message = 'Email format must be as example@mail.com';
    }
    if (!value && name === "emergencyphoneno") {
      message = 'Phone No is Required';
    }

    setEmergencyContactErr({ ...emergencyContactErr, [name]: message })

  }

  const validateTenantInfo = (e) => {
    const { name } = e.target;
    const value = TenantInfoDetails[name];
    let message = ''
    if (!value) {
      message = `${name} is required`;
    }
    setTenantInfoError({ ...TenantInfoError, [name]: message });
  }

  const emergencyhandlechange = (e) => {
    setEmergencyContactDetails({ ...emergencyContactDetails, [e.target.name]: e.target.value });
  }


  const addEmergencyContact = (e) => {
    e.preventDefault();

    const emergencyContactErr = { emergencyFname: '', emergencyemail: '', emergencyphoneno: '' }
    let isValid = true;

    if (!emergencyContactDetails.emergencyFname) {
      emergencyContactErr.emergencyFname = "First Name is Required ";
      isValid = false;
    }
    if (!emergencyContactDetails.emergencyemail) {
      emergencyContactErr.emergencyemail = "Email is Required";
      isValid = false;
    }
    if (emergencyContactDetails.emergencyemail && !/\S+@\S+\.\S+/.test(emergencyContactDetails.emergencyemail)) {
      emergencyContactErr.emergencyemail = "Email format must be as example@mail.com ";
      isValid = false;
    }
    if (!emergencyContactDetails.emergencyphoneno) {
      emergencyContactErr.emergencyphoneno = "Phone No is Required";
      isValid = false;
    }
    if (!isValid) {
      setEmergencyContactErr(emergencyContactErr);
    } else {

      const newcontactdetails = {
        name: emergencyContactDetails.emergencyFname,
        lname: emergencyContactDetails.emergencylname,
        email: emergencyContactDetails.emergencyemail,
        phone: emergencyContactDetails.emergencyphoneno,
        contactaccordianLength: contactaccordian.length + 1
      }
      SetContactaccordian([...contactaccordian, newcontactdetails]);

      /** Clear all Input values */

      emergencyContactDetails.emergencyFname = '';
      emergencyContactDetails.emergencylname = '';
      emergencyContactDetails.emergencyemail = '';
      emergencyContactDetails.emergencyphoneno = '';

      /** Clear all Input values */

    }
  }
  const removeEmergencyContact = (index) => {
    const list = [...contactaccordian]
    list.splice(index, 1);
    SetContactaccordian(list)

  }
  const proceedCreditCheck = (e) => {
    e.preventDefault();
    SetCreditStatus(true);
  }
  const navigateEsign = (e) => {
    e.preventDefault();
    navigate('/preBooking/esignPayment')
  }
  const profileImageUpload = (e) => {
    e.preventDefault();
    let img = e.target.files[0];
    if (!img.name.match(/\.(jpg|jpeg|png|svg)$/)) {
      alert('Please check the your file format,only jpg,jpeg,png,svg formats are supported')
      return false;
    }
    if (img.size > 1000000) {
      alert('Please make sure the file size is less than 1mb and try again')
      return false;
    }

    if (e.target.files && e.target.files[0]) {
      setprofileImageSrc({ img: URL.createObjectURL(img) });
      SetimguploadStatus(true);

    }
  }
  const dateOfBirthChange = (e, date) => {
    TenantInfoDetails['birthDate'] = date.value;

  }

  const leaseProfileSave = (e) => {
    let emergencyContactArray = [];
    if(contactaccordian.length > 0){
      sessionStorage.setItem('emergencyDetail',JSON.stringify(contactaccordian));
      contactaccordian.forEach((item)=> {
        emergencyContactArray.push({id:null,
          firstName:item.name,
          lastName:item.lname,
          email:item.email,
          mobile:item.phone
         })
      })

    }else{
      emergencyContactArray = [];
    }
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let requestbody = {
      profileAddress: {
        id: null,
        addressLineOne: TenantInfoDetails.addressLineOne,
        addressLineTwo: TenantInfoDetails.addressLineTwo,
        country: TenantInfoDetails.country,
        state: TenantInfoDetails.state,
        city: TenantInfoDetails.city,
        zipCode: TenantInfoDetails.zipCode
      },
      deliveryAddress: {},
      emergencyContact: emergencyContactArray,
      id: leaseProfileId ? leaseProfileId : "",
      tenantId: userid,
      firstName: TenantInfoDetails.firstName,
      lastName: TenantInfoDetails.lastName,
      email: TenantInfoDetails.email,
      isBusinessUser: true,
      phoneNumberOne: TenantInfoDetails.phoneNumber,
      dob: TenantInfoDetails.birthDate,
      preferredStorage: preferredStorageValue


    }
    instance
      .post(request.lease_profile, requestbody, config)
      .then(response => {
        if (response.data.result !== null && response.data.result !== 'undefined') {
          sessionStorage.setItem("leaseProfileid", response.data.result);
          navigateEsign(e);

        }


      })
      .catch(error => {
        console.log(error)

      })


    // navigateEsign(e);

  }


  const tenantInfo = () => {


    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let tenantinfodata;

    tenantinfodata = {
      userId: userid
    }
    instance
      .get(request.tenant_details + '/' + userid, tenantinfodata, config)
      .then((response) => {
        const tenantInfoGetdata = response.data;
        if (typeof tenantInfoGetdata !== "undefined" && tenantInfoGetdata !== null && tenantInfoGetdata !== "") {
          const tenantInfoGetresult = tenantInfoGetdata.result;
          console.log(tenantInfoGetresult);
          if (typeof tenantInfoGetresult !== "undefined" && tenantInfoGetresult !== null & tenantInfoGetresult !== "") {
            localStorage.setItem("tenantIfo", JSON.stringify(tenantInfoGetresult));
            let tenantMovinData = JSON.parse(localStorage.getItem("tenantIfo"));
            
            setTenantInfoDetails(tenantMovinData);
          }

        }
      })
      .catch((error) => {
        console.log(error);
      });

  }
  function updateTenantInfo() {
    console.log(TenantInfoDetails)
    // setTenantDetails({ ...tenantDetails, type : event.target.value });
    let config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    let requestBody = {
      firstName: TenantInfoDetails.firstName,
      lastName: TenantInfoDetails.lastName,
      dateOfBirth: TenantInfoDetails.birthDate,
      addressLine1: TenantInfoDetails.addressLineOne,
      addressLine2: TenantInfoDetails.addressLineTwo,
      city: TenantInfoDetails.city,
      country: TenantInfoDetails.country,
      state: TenantInfoDetails.state,
      postalCode: TenantInfoDetails.zipCode,
      email: TenantInfoDetails.email,
      phoneNumber: TenantInfoDetails.phoneNumber,
      ssn: TenantInfoDetails.ssn

    }
    console.log(request.update_user_info + `/${userid}`);
    instance.post(request.update_user_info + `/${userid}`, requestBody, config).then((response) => {
      const userUpdateResponse = response.data.data;
      console.log(userUpdateResponse)
      if (userUpdateResponse.isSuccess === true && userUpdateResponse.returnCode === "SUCCESS") {
        console.log(userUpdateResponse)
      }
    })
  }



  const tenantInfoFinal = (e) => {
    e.preventDefault();
    const TenantInfoError = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      addressLineOne:"",
      city: "",
      state:"",
      zipCode:""
    }
    let isValid = true;
    if (!TenantInfoDetails.firstName) {
      TenantInfoError.firstName = "first Name is Required";
      isValid = false;
    }
    if (!TenantInfoDetails.lastName) {
      TenantInfoError.lastName = "Last Name is Required";
      isValid = false;
    }
    if (!TenantInfoDetails.addressLineOne) {
      TenantInfoError.addressLineOne = "address is Required";
      isValid = false;
    }
    if (!TenantInfoDetails.city) {
      TenantInfoError.city = "city is Required";
      isValid = false;
    }
    if (!TenantInfoDetails.zipCode) {
      TenantInfoError.zipCode = "zipcode is Required";
      isValid = false;
    }
    if (!TenantInfoDetails.state) {
      TenantInfoError.state = "state is Required";
      isValid = false;
    }
    if (!isValid) {
      setTenantInfoError(TenantInfoError);
    }else{
      updateTenantInfo();
      leaseProfileSave(e)
    }
   

  }


  useEffect(() => {
    tenantInfo();
    if(emergencyDetail){
      SetContactaccordian(JSON.parse(emergencyDetail))
    }
    
  }, [])


  const {
    firstName: fname_Data,
    lastName: lastNameError,
    email: email_Data,
    phoneNumber: phoneNo_Data,
    addressLineOne: addressLine1Error,
    city: cityError,
    state: stateError,
    zipCode:postalError

  } = TenantInfoError;

  const {
    emergencyFname: fname_err,
    emergencyemail: email_err,
    emergencyphoneno: phone_err

  } = emergencyContactErr;
 
  console.log(contactaccordian);

  return (
    <>
      <PreBookingBreadcrumb activeStep='123' />
      <div className="ui container bg-white card-boxshadow border-radius-15 py-2">

        <h6 className='text-dark dashed-bottom fw-500 fs-6 px-4 py-2 px-sm-2 mb-2'><svg
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
        </svg>
          <span className='veritical-align-text-top ml-1'>Tenant Details</span></h6>
        <div className="row reverse-sm">
          <div className="col-12 col-md-6 ui form">
            <div className="col-12 px-4 px-sm-2">
              <div className="field w-100  my-3">
                <label className='fw-500 fs-7 mb-2'>First Name <i className="text-danger ">*</i></label>
                <input type='text' placeholder='Enter Name' name="firstName" value={TenantInfoDetails.firstName} onChange={(e) => handlechange(e)} onBlur={validateTenantInfo} />
                <div className="text-danger mt-1">{fname_Data}</div>
              </div>
            </div>
            <div className="col-12  px-4 px-sm-2">
              <div className="field w-100  my-3">
                <label className='fw-500 fs-7 mb-2'>Last Name</label>
                <input type='text' placeholder='Enter Name' name="lastName" value={TenantInfoDetails.lastName} onChange={(e) => handlechange(e)} onBlur={validateTenantInfo} />
                <div className="text-danger mt-1">{lastNameError}</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-center mb-2">
            <div className="position-relative">
              {imguploadStatus &&

                <label className="position-absolute r-0 t-1 z-index-1 cursor-pointer" htmlFor="photoUpload"><img width='50' height='50' className="" alt="Edit Photo" src="/assets/images/edit-photo.svg" /></label>
              }
              <Image className="TenantDetailsProfileImage object-fit-cover" src={profileImageSrc.img} size='medium' circular />
              <div className="text-center mt-1">
                {!imguploadStatus &&
                  <label htmlFor="photoUpload" className="text-success fw-500 cursor-pointer">Upload Photo</label>
                }
                <input id='photoUpload' onChange={e => profileImageUpload(e)} type="file" hidden />
              </div>
            </div>
          </div>

        </div>
        <div className="row ui form mb-1">
          <div className="col-12  col-md-6  px-4 px-sm-2">
            <div className="field datePicker w-100 my-3">
              <label className='fw-500 fs-7 mb-2' >Date of Birth</label>
              {TenantInfoDetails && TenantInfoDetails.birthDate ?
                <SemanticDatepicker placeholder='Select date' name="birthDate" className='w-100' format="DD-MM-YYYY" value={new Date(TenantInfoDetails.birthDate)} onChange={dateOfBirthChange} /> :
                <SemanticDatepicker placeholder='Select date' name="birthDate" className='w-100' format="DD-MM-YYYY" value={new Date()} onChange={dateOfBirthChange} />
              }

            </div>
          </div>
          <div className="col-12  col-md-6  px-4 px-sm-2">
            <div className="field w-100  my-3">
              <label className='fw-500 fs-7 mb-2'>Email <i className="text-danger ">*</i></label>
              <input disabled type='email' placeholder='Enter Email' name="email" value={TenantInfoDetails.email} onChange={(e) => handlechange(e)} onBlur={validateTenantInfo} />
              <div className="text-danger mt-1">{email_Data}</div>
            </div>
          </div>
          <div className="col-12  col-md-6  px-4 px-sm-2">
            <div className="points-events-none field w-100  my-3">
              <label className='fw-500 fs-7 mb-2'>Phone Number <i className="text-danger ">*</i></label>
              <Input disabled className="noCounterNumber" type="number" name="phoneNumber" placeholder="Enter Mobile Number" value={TenantInfoDetails.phoneNumber} onChange={(e) => handlechange(e)} onBlur={validateTenantInfo}
                label={<Dropdown defaultValue='+91' search options={countriecodes} />}
                labelPosition='left' />
              <div className="text-danger mt-1">{phoneNo_Data}</div>
            </div>
          </div>
          <div className="col-12  col-md-6  px-4 px-sm-2">
            <div className="field w-100  my-3">
              <label className='fw-500 fs-7 mb-2'>Social Security Number</label>
              <input className="noCounterNumber" type='number' name="ssn" placeholder='Social Security Number' value={TenantInfoDetails.ssn} onChange={(e) => handlechange(e)} />
            </div>
          </div>
          <div className="col-12  col-md-6  px-4 px-sm-2 my-3">
            <span>Are you Military user? <span className="mx-2"><input className="mr-1" type="checkbox" /><label>Yes</label></span><span><input className="mr-1" type="checkbox" /><label>No</label></span></span>
          </div>
        </div>
        <div className="row ui form">
          <div className="col-12">
            <h6 className='text-dark dashed-bottom fw-500 fs-6 px-4 py-2 px-sm-2'>
              <svg id="location-svgrepo-com_1_" data-name="location-svgrepo-com (1)" xmlns="http://www.w3.org/2000/svg" width="25" height="22" viewBox="0 0 25 33.828">
                <g id="Group_6994" data-name="Group 6994" transform="translate(0)">
                  <g id="Group_6993" data-name="Group 6993">
                    <path id="Path_19673" data-name="Path 19673" d="M53.6,0A12.514,12.514,0,0,0,41.1,12.5c0,6.673,11.4,20.454,11.881,21.038a.805.805,0,0,0,1.239,0C54.708,32.954,66.1,19.173,66.1,12.5A12.514,12.514,0,0,0,53.6,0Zm0,31.745c-1.01-1.262-3.11-3.95-5.187-7.023-3.73-5.518-5.7-9.744-5.7-12.222a10.889,10.889,0,1,1,21.778,0c0,2.478-1.972,6.7-5.7,12.222C56.713,27.795,54.613,30.483,53.6,31.745Z" transform="translate(-41.103)" fill="#328128" />
                    <path id="Path_19674" data-name="Path 19674" d="M154.9,212.808a.805.805,0,0,0-1.118.217c-1.087,1.609-2.3,3.3-3.619,5.012a.805.805,0,1,0,1.279.979c1.334-1.742,2.57-3.454,3.675-5.089A.805.805,0,0,0,154.9,212.808Z" transform="translate(-138.305 -189.831)" fill="#328128" />
                    <path id="Path_19675" data-name="Path 19675" d="M102.6,57.5a6.6,6.6,0,1,0,6.6,6.6A6.612,6.612,0,0,0,102.6,57.5Zm0,11.6A4.994,4.994,0,1,1,107.6,64.1,5,5,0,0,1,102.6,69.1Z" transform="translate(-90.105 -51.325)" fill="#328128" />
                  </g>
                </g>
              </svg>
              <span className='veritical-align-text-top ml-1'>Address Deatils</span></h6>
          </div>
          <div className="col-12 col-md-6 px-4 px-sm-2">
            <div className="field w-100  my-3">
              <label className='fw-500 fs-7 mb-2'>Address Line 1</label>
              <input type='text' placeholder='Address Line 1' name="addressLineOne" value={TenantInfoDetails.addressLineOne} onChange={(e) => handlechange(e)} onBlur={validateTenantInfo}/>
              <div className="text-danger mt-1">{addressLine1Error}</div>
            </div>
          </div>
          <div className="col-12 col-md-6 px-4 px-sm-2">
            <div className="field w-100  my-3">
              <label className='fw-500 fs-7 mb-2'>Address Line 2</label>
              <input type='text' placeholder='Address Line 2' name="addressLineTwo" value={TenantInfoDetails.addressLineTwo} onChange={(e) => handlechange(e)} />
            </div>
          </div>
          <div className="col-12 col-md-6 px-4 px-sm-2">
            <div className="field w-100  my-3">
              <label className='fw-500 fs-7 mb-2'>City</label>
              <input type='text' placeholder='City' name="city" value={TenantInfoDetails.city} onChange={(e) => handlechange(e)} onBlur={validateTenantInfo} />
              <div className="text-danger mt-1">{cityError}</div>
            </div>
          </div>
          <div className="col-12 col-md-6 px-4 px-sm-2">
            <div className="field w-100  my-3">
              <label className='fw-500 fs-7 mb-2'>State/Provine</label>
              <input type='text' placeholder='State/Provine' name="state" value={TenantInfoDetails.state} onChange={(e) => handlechange(e)} onBlur={validateTenantInfo} />
              <div className="text-danger mt-1">{stateError}</div>
            </div>
          </div>
          <div className="col-12 col-md-6 px-4 px-sm-2">
            <div className="field w-100  my-3">
              <label className='fw-500 fs-7 mb-2'>Zip/Postal Code</label>
              <input className="noCounterNumber" type='number' name="zipCode" placeholder='Zip/Postal Code' defaultValue={TenantInfoDetails.zipCode} onChange={(e) => handlechange(e)} onBlur={validateTenantInfo} />
              <div className="text-danger mt-1">{postalError}</div>
            </div>
          </div>
        </div>
        <div className="row ui form mb-2">
          <div className="col-12">
            <h6 className='text-dark fw-500 fs-6 px-4 py-2 px-sm-2 dashed-bottom'>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 34.809 36">
                <g id="ec" transform="translate(-0.008 -0.005)">
                  <path id="Path_19732" data-name="Path 19732" d="M9.165,116.439a9.172,9.172,0,0,1-1.028-.208,14.7,14.7,0,0,1-1.606-.6.726.726,0,0,0-.672-.034,4.3,4.3,0,0,1-5.727-1.982c-.213-.394-.151-.738.165-.919a.609.609,0,0,1,.873.323,3.061,3.061,0,0,0,2.465,1.756,11.06,11.06,0,0,0,1.549-.093c-.137-.183-.2-.262-.255-.339A3.613,3.613,0,0,1,4.1,111.4a2.233,2.233,0,0,1,2.241-1.848,2.176,2.176,0,0,1,2.055,1.92,3.435,3.435,0,0,1-.77,2.822c-.095.118-.2.231-.3.347,1.671,1.349,5.862.382,7.136-1.661-.105-.065-.21-.13-.317-.194A21.442,21.442,0,0,1,4.637,101.7a11.863,11.863,0,0,1-.468-7.382A10.09,10.09,0,0,1,7.026,89.6a2.858,2.858,0,0,1,3.5-.4,11.694,11.694,0,0,1,4.313,4.336,2.809,2.809,0,0,1-.754,3.7,3.226,3.226,0,0,0-1.169,3.793,7.094,7.094,0,0,0,5.142,4.88,3.11,3.11,0,0,0,3.4-1.2,2.827,2.827,0,0,1,3.9-.715,11.8,11.8,0,0,1,4.167,4.194,2.872,2.872,0,0,1-.432,3.584,10.357,10.357,0,0,1-9.511,3.012c-.208-.033-.416-.069-.621-.117a.6.6,0,1,1,.231-1.179c.568.077,1.133.192,1.7.232a9.029,9.029,0,0,0,5.951-1.6c.067-.046.126-.1.256-.209-.57-.733-1.109-1.484-1.709-2.18-.5-.575-1.06-1.093-1.606-1.624-.385-.375-.459-.7-.187-.995.256-.273.61-.235.987.1a19.063,19.063,0,0,1,3.23,3.694c.051.076.107.149.161.224a1.669,1.669,0,0,0,.553-2.258,10.484,10.484,0,0,0-3.932-3.927,1.61,1.61,0,0,0-2.091.369,4.4,4.4,0,0,1-5.239,1.631,8.284,8.284,0,0,1-5.589-5.879,4.224,4.224,0,0,1,.571-3.6c.119-.179.063-.288-.033-.433a17.78,17.78,0,0,0-3.43-3.887c-.117-.1-.237-.193-.345-.3a.591.591,0,0,1-.072-.822.58.58,0,0,1,.846-.076,19.919,19.919,0,0,1,1.754,1.62c.728.807,1.379,1.684,2.062,2.53.064.08.124.163.183.242a1.536,1.536,0,0,0,.643-2.066A9.992,9.992,0,0,0,9.72,90.141a1.509,1.509,0,0,0-1.824.3A8.835,8.835,0,0,0,5.02,96.541a13.14,13.14,0,0,0,1.93,7.371,20.79,20.79,0,0,0,8.5,8.212c.61.322.688.612.3,1.174a6.963,6.963,0,0,1-5.056,3.082,1.179,1.179,0,0,0-.2.06H9.164ZM6.3,114.032a10.929,10.929,0,0,0,.755-1.1,1.843,1.843,0,0,0,.067-1.568.894.894,0,0,0-1.578-.248,1.666,1.666,0,0,0-.284.975A2.69,2.69,0,0,0,6.3,114.033Z" transform="translate(0 -80.435)" fill="#328128" />
                  <path id="Path_19733" data-name="Path 19733" d="M192.107,9.356a9.824,9.824,0,0,1-2.355,6.54,10.982,10.982,0,0,1-5.42,3.22c-.6.169-1.206.285-1.813.413a.666.666,0,0,1-.784-.239c-.251-.386-.017-.828.485-.934.561-.118,1.127-.218,1.678-.372a9.832,9.832,0,0,0,5.075-3.039,8.549,8.549,0,0,0,1.9-5.953,8.027,8.027,0,1,0-15.987,1.232,7.815,7.815,0,0,0,2.854,5.194c.444.372.51.525.3,1.06-.186.466-.412.916-.638,1.365-.191.379-.132.549.269.682a.594.594,0,0,1,.468.74.6.6,0,0,1-.742.423,1.567,1.567,0,0,1-1.13-2.264c.148-.292.3-.583.463-.866.128-.221.076-.362-.112-.533a9.028,9.028,0,0,1-2.8-4.885,9.234,9.234,0,1,1,18.149-3.393c.09.529.1,1.071.146,1.608Z" transform="translate(-157.29 0)" fill="#328128" />
                  <path id="Path_19734" data-name="Path 19734" d="M222.906,60.392c-.867,0-1.721.093-2.344-.644a2.4,2.4,0,0,1-.426-1.726,1.805,1.805,0,0,1,.878-1.583c.574-.369,1.225-.21,1.89-.271,0-.288,0-.565,0-.842a1.806,1.806,0,0,1,1.917-1.917,4.155,4.155,0,0,1,.943.064,1.763,1.763,0,0,1,1.34,1.688c.008.326,0,.652,0,1.024.327,0,.628,0,.927,0a1.781,1.781,0,0,1,1.846,1.73,5.631,5.631,0,0,1,0,.667,1.8,1.8,0,0,1-1.82,1.8c-.3.012-.606,0-.956,0,0,.317,0,.605,0,.894a1.79,1.79,0,0,1-1.881,1.873,4.726,4.726,0,0,1-.841-.03,1.8,1.8,0,0,1-1.479-1.8c-.009-.292,0-.584,0-.936Zm3,.2h0c0-.234,0-.469,0-.7.008-.475.213-.69.684-.7s.938.007,1.407-.006a.613.613,0,0,0,.682-.674c.007-.14,0-.281,0-.422-.016-.5-.223-.7-.715-.706-.434,0-.867,0-1.3,0-.551,0-.754-.211-.757-.772,0-.422,0-.844,0-1.266,0-.517-.206-.722-.721-.734-.129,0-.258,0-.387,0-.471.016-.682.221-.692.7-.01.457,0,.914,0,1.371-.008.492-.221.7-.715.7-.469,0-.938-.006-1.407,0a.6.6,0,0,0-.645.631c-.006.14,0,.281,0,.422,0,.532.21.74.749.748.422.007.844,0,1.266,0,.564,0,.749.194.755.767,0,.3,0,.61,0,.914,0,.993.122,1.112,1.113,1.087.035,0,.07,0,.105,0a.593.593,0,0,0,.58-.59c.013-.257,0-.516,0-.773Z" transform="translate(-199.444 -48.387)" fill="#328128" />
                </g>
              </svg>
              <span className='veritical-align-text-top ml-1'>Emergency Conatct</span></h6>
          </div>
        </div>
        {contactaccordian.length < 3 &&
          <div className="row ui form mb-4">
            <div className="col-12 col-md-6 px-4 px-sm-2">
              <div className="field w-100  my-3">
                <label className='fw-500 fs-7 mb-2'>First Name <i className="text-danger ">*</i></label>
                <input value={emergencyContactDetails.emergencyFname} onChange={(e) => emergencyhandlechange(e)} onBlur={(e) => validateemergencycontactInfo(e)} name="emergencyFname" type='text' placeholder='Enter Name' />
                <div className="text-danger mt-1">{fname_err}</div>
              </div>
            </div>
            <div className="col-12 col-md-6 px-4 px-sm-2">
              <div className="field w-100  my-3">
                <label className='fw-500 fs-7 mb-2'>Last Name</label>
                <input value={emergencyContactDetails.emergencylname} onChange={(e) => emergencyhandlechange(e)} onBlur={(e) => validateemergencycontactInfo(e)} type='text' name="emergencylname" placeholder='Last Name' />
              </div>
            </div>
            <div className="col-12 col-md-6 px-4 px-sm-2">
              <div className="field w-100  my-3">
                <label className='fw-500 fs-7 mb-2'>Email <i className="text-danger ">*</i></label>
                <input value={emergencyContactDetails.emergencyemail} onChange={(e) => emergencyhandlechange(e)} onBlur={(e) => validateemergencycontactInfo(e)} type='email' name="emergencyemail" placeholder='Enter Email' />
                <div className="text-danger mt-1">{email_err}</div>
              </div>
            </div>
            <div className="col-12 col-md-6 px-4 px-sm-2">
              <div className="field w-100  my-3">
                <label className='fw-500 fs-7 mb-2'>Phone Number <i className="text-danger ">*</i></label>
                {/* <input value={contactPhone} onChange={e=>SetContactPhone(e.target.value)} className="noCounterNumber" type='number' placeholder='Enter Phone Number' /> */}
                <Input value={emergencyContactDetails.emergencyphoneno} onChange={(e) => emergencyhandlechange(e)} className="noCounterNumber" onBlur={(e) => validateemergencycontactInfo(e)} type="number" name="emergencyphoneno" placeholder="Enter Mobile Number"
                  label={<Dropdown defaultValue='+91' search options={countriecodes} />}
                  labelPosition='left' />
                <div className="text-danger mt-1">{[phone_err]}</div>
              </div>
            </div>
            <div className="col-12">
              <a onClick={(e) => addEmergencyContact(e)} className="text-success fs-7 px-4 px-sm-2 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="18" viewBox="0 0 27.505 27.5">
                  <path id="floating" d="M577.346,2164.47h1.719c.468.061.939.108,1.4.186a13.8,13.8,0,0,1,11.276,11.2c.089.5.142,1.006.211,1.51v1.719c-.04.327-.075.656-.122.981a13.749,13.749,0,1,1-23.4-11.494,13.464,13.464,0,0,1,7.4-3.886C576.337,2164.593,576.843,2164.539,577.346,2164.47Zm2,14.892h4.82a1.14,1.14,0,1,0,.027-2.278c-1.5-.009-3.007,0-4.51,0h-.336v-4.813a1.118,1.118,0,0,0-.693-1.111,1.131,1.131,0,0,0-1.588,1.07c-.01,1.5,0,3.007,0,4.51v.344h-4.806a1.141,1.141,0,1,0-.055,2.28c1.512.011,3.025,0,4.537,0h.323v.364c0,1.477,0,2.953,0,4.43a1.141,1.141,0,1,0,2.28.068c.012-1.5,0-3.007,0-4.51Z" transform="translate(-564.451 -2164.47)" fill="#328128" />
                </svg><span className="veritical-align-text-top ml-1">Add more</span>
              </a>
            </div>
          </div>
        }
        <div className="col-12 px-sm-2" id="EmergencyContactDiv">
          {
            contactaccordian.map((data, index) => (
              <TenantDetailEmergengyContactAccordian key={index} removefunction={removeEmergencyContact} index={index} contactLength={data.contactaccordianLength} name={data.name} lname={data.lname} email={data.email} phone={data.phone} />
            ))
          }
        </div>

      </div>
      <div className="ui container text-center my-5">
        <button onClick={() => navigate('/preBooking/addOns')} className="ui button  basic border-success-dark-1 fs-7 fw-400 text-dark px-5 mr-2">BACK</button>
        <button onClick={e => tenantInfoFinal(e)} className="ui button bg-success-dark   fs-7 fw-400 text-white px-5">NEXT</button>

      </div>


      <Modal
        dimmer={creditCheckModal.dimmer}
        open={creditCheckModal.open}
        size='tiny'
        onClose={() => SetCreditCheckModal({ open: false })}
      >
        <Modal.Header className='header text-success-dark text-center fw-601 fs-5 border-0 pb-1'>CREDIT CHECK</Modal.Header>
        <Modal.Content className='mh-400 overflow-y-auto text-center pt-2'>
          <div className="d-flex justify-content-center mb-2">
            <Image width='250' src={!creditStatus ? `/assets/images/creditCheck.svg` : '/assets/images/creditStatusExcellent.png'} alt='CreditCheck' />
          </div>
          {!creditStatus &&
            <>
              <div className="mb-3">
                As part of the move-in process, we need to verify your credit score, would you like to proceed for a credit check?
              </div>
              <div className="">
                <button onClick={() => SetCreditCheckModal({ open: false })} className="ui button bg-secondary  fs-7 fw-400 text-white px-5 mr-1">Cancel</button>
                <button onClick={(e) => proceedCreditCheck(e)} className="ui button bg-success-dark   fs-7 fw-400 text-white px-5">Proceed</button>
              </div>
            </>
          }
          {creditStatus && <>
            <div className="mb-3">
              Congratulations! You have sufficient credit score to proceed further with us
            </div>
            <div>
              <button onClick={(e) => navigateEsign(e)} className="ui button bg-secondary  fs-7 fw-400 text-white px-5">Continue</button>
            </div>
          </>

          }


        </Modal.Content>
      </Modal>
    </>
  )
}
