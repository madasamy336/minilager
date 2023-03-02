import PreBookingBreadcrumb from "../components/prebooking breadcrumb/PreBookingBreadcrumb";
import { PHOTO_URl_BUSINESS_USER, PHOTO_URl_PERSONAL_USER } from "../constant/constant";
import { Image, Modal, Button, Loader } from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import React, { useEffect, useRef, useState } from "react";
import TenantDetailEmergengycontactAccordian from "../components/tenantDetailsAccordian/TenantDetailsAccordian";
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import instance from '../services/instance';
import request from '../services/request';
import { useTranslation } from "react-i18next";
import Helper from "../helper";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import Spinner from "../components/Spinner/Spinner";



let helper = new Helper();
let customFieldValue = [];
let Sdetails;
let cusomfieldPhone;
let customInputFieldValue;

export default function TenantDetails() {
  const { t } = useTranslation();
  let unitid = localStorage.getItem('unitid');
  let userid = localStorage.getItem("userid");
  let preferredStorageValue = JSON.parse(sessionStorage.getItem("preferredStorage"));
  let leaseProfileId = sessionStorage.getItem('leaseProfileid');
  let emergencyDetail = sessionStorage.getItem('emergencyDetail');
  let BusinessUser = JSON.parse(sessionStorage.getItem('isBussinessUser'));
  let customFieldAccess = JSON.parse(localStorage.getItem('CustomFieldsSetting'));
  let unitDetailCustomField = JSON.parse(sessionStorage.getItem("customFieldstorage"));
  let startdate = Number(localStorage.getItem('storedate'));
  const clientDataconfig = JSON.parse(sessionStorage.getItem("configdata"));
  const today = new Date();
  const minDate = new Date(today.setFullYear(today.getFullYear() - 18));
  const navigate = useNavigate();
  const [previewSrc, setPreviewSrc] = useState('/assets/images/userDemoProfile.svg');
  const [file, setFile] = useState('/assets/images/userDemoProfile.svg');
  const companyName = useRef(null);
  const ssn = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const companyRegistrationNumber = useRef(null);
  const [TenantInfoDetails, setTenantInfoDetails] = useState(
    {
      firstName: '',
      lastName: '',
      email: '',
      birthDate: '',
      phoneNumber: '',
      addressLineOne: '',
      addressLineTwo: '',
      companyName: '',
      companyRegistrationNumber: '',
      city: '',
      country: '',
      state: '',
      zipCode: '',
      ssn: '',
    });

  const [tenantInfoError, setTenantInfoError] = useState({
    firstName: '', email: '', phoneNumber: '', addressLineOne: '', city: '', state: '', zipCode: '', ssn: '', companyName: '', companyRegistrationNumber: ''
  });

  const [emergencyContactDetails, setEmergencyContactDetails] = useState({
    emergencyFname: '', emergencyLname: '', emergencyEmail: '', emergencyPhoneNo: ''
  });

  const [emergencyContactErr, setEmergencyContactErr] = useState({
    emergencyFname: '', emergencyEmail: '', emergencyPhoneNo: '',
  });

  const [imguploadStatus, SetimguploadStatus] = useState(false);
  const [creditCheckLoader, setCreditCheckLoader] = useState(false);
  const [contactAccordian, setContactAccordian] = useState([]);
  const [creditStatus, SetCreditStatus] = useState(false);
  const [tenantCreditCheckDetails, setTenantCreditCheckDetails] = useState({})
  const [creditcheckerror, setCreditCheckError] = useState(false)
  const [isBtnLoading, setIsBtnLoading] = useState(false)
  const [creditCheckModal, SetCreditCheckModal] = useState({
    open: false,
    dimmer: undefined,
  })

  // const {
  //   firstName: fname_Data,
  //   lastName: lastNameError,
  //   email: email_Data,
  //   phoneNumber: phoneNo_Data,
  //   addressLineOne: addressLine1Error,
  //   city: cityError,
  //   state: stateError,
  //   zipCode: postalError,
  //   ssn: ssnError

  // } = tenantInfoError;

  const {
    emergencyFname: fname_err,
    emergencyEmail: email_err,
    emergencyPhoneNo: phone_err

  } = emergencyContactErr;

  // useEffect(() => {
  //   setEmergencyContactErr({ emergencyFname: '', emergencyEmail: '', emergencyPhoneNo: '' });
  // }, []);
  useEffect(() => {
    customFieldsSettings();
    var diff = (Date.now() - startdate) / 60000;
    if (diff > 40) {
      localStorage.setItem('nextpage', JSON.stringify(false))
    }
    fetchTenantInfo();
    if (emergencyDetail) {
      setContactAccordian(JSON.parse(emergencyDetail))
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (customFieldAccess && customFieldAccess.length > 0) {
        bindCustomFieldValue();
      }
    }, 1000)
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
            localStorage.setItem("CustomFieldsSetting", JSON.stringify(custom_field_result));
          }
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const handlechange = (e) => {
    e.persist();
    const { name, value } = e.target;
    setTenantInfoDetails({ ...TenantInfoDetails, [name]: value });
  }


  // Validation Functions



  const validateCustomFields = (e) => {
    console.log("validateCustomFields");
    const fieldId = e.target.dataset.fieldid;
    const value = e.target.value;
    const isMandatory = e.target.dataset.required;
    if (!value && isMandatory === "true") {
      document.getElementById(fieldId).style.display = 'block';
      return false;
    } else if (!value && isMandatory === "false") {
      document.getElementById(fieldId).style.display = 'none';
    } else {
      document.getElementById(fieldId).style.display = 'none';
    }
    return true;
  };

  const checkCustomfieldValue = () => {

    let customValue = JSON.parse(localStorage.getItem(`CustomFieldsSetting`));
    let errorcount = 0;

    if (customValue && customValue.length > 0) {
      let filterUnitSpecificValue = customValue.filter(i => i.matadata.displayOn === 'Movein Tenant Details');
      filterUnitSpecificValue.forEach((item) => {
        let customvalue = document.getElementById(`${item.matadata.type}_${item.fieldId}`);
        let errordiv = document.getElementById(`${item.fieldId}`);

        if (item.matadata.isMandatory === true) {
          if (item.matadata.type === 'textbox' && customvalue.value === '') {
            errordiv.style.display = 'block';
            errorcount++;
          } else if (item.matadata.type === 'radio') {
            let radiobutton = document.getElementsByName(`${item.matadata.type}_${item.fieldId}`);
            let radioButtonSelected = Array.from(radiobutton).some(radio => radio.checked);
            if (!radioButtonSelected) {
              errordiv.style.display = 'block';
              errorcount++;
            }
          } else if (item.matadata.type === 'checkboxes' || item.matadata.type === 'checkbox') {
            let checkboxes = document.getElementsByName(`${item.matadata.type}_${item.fieldId}`);
            let checkboxSelected = Array.from(checkboxes).some(checkbox => checkbox.checked);
            if (!checkboxSelected) {
              errordiv.style.display = 'block';
              errorcount++;
            }
          } else if (item.matadata.type === 'textarea' && customvalue.value === '') {
            errordiv.style.display = 'block';
            errorcount++;
          } else if (item.matadata.type === 'date' && customvalue.value === '') {
            errordiv.style.display = 'block';
            errorcount++;
          }
        }
      });
    }

    return errorcount;
  };



  const validatePersonalInfo = (details) => {
    const { firstName, lastName, email, phoneNumber, ssn, birthDate, companyName, companyRegistrationNumber, addressLineOne, city, state, zipCode } = details;
    const errors = {};
    if (!firstName) {
      errors.firstName = "First Name is required";
    }

    if (!lastName) {
      errors.lastName = "Last Name is required";
    }

    if (!email) {
      errors.email = "Email is required";
    }

    if (!phoneNumber) {
      errors.phoneNumber = "Phone Number is required";
    }

    if (!ssn) {
      errors.ssn = "Social Security Number is required";
    }

    if (!birthDate) {
      errors.birthDate = "Date Of Birth is required";
    }
    if (!addressLineOne) {
      errors.addressLineOne = "Address Line 1 is required";
    }
    if (!city) {
      errors.city = "City is required";
    }
    if (!state) {
      errors.state = "State is required";
    }
    if (!zipCode) {
      errors.zipCode = "Zip Code is required";
    }
    console.log("businessUser", BusinessUser);
    console.log("companyName", !companyName);


    if (BusinessUser && !companyName) {
      errors.companyName = "Company Name is required";
    }
    if (BusinessUser && !companyRegistrationNumber) {
      errors.companyRegistrationNumber = "Company Registration Number is required";
    }

    setTenantInfoError(errors);

    return Object.keys(errors).length === 0;
  };



  const validateEmergencyContactInfo = (details) => {
    const { emergencyFname, emergencyLname, emergencyEmail, emergencyPhoneNo } = details;
    const errors = {};

    if (!emergencyFname) {
      errors.emergencyFname = "First Name is required";
    }

    if (!emergencyEmail) {
      errors.emergencyEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(emergencyEmail)) {
      errors.emergencyEmail = "Email format must be example@mail.com";
    }

    if (!emergencyPhoneNo) {
      errors.emergencyPhoneNo = "Phone Number is required";
    }

    setEmergencyContactErr(errors);

    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  };







  // onChange Funcion
  const onChangePhoneInput = (e, data) => {
    setEmergencyContactDetails({ ...emergencyContactDetails, ['emergencyPhoneNo']: e });
  }
  const emergencyhandlechange = (e) => {
    setEmergencyContactDetails({ ...emergencyContactDetails, [e.target.name]: e.target.value });
  }

  // OnClick Functions

  // const addEmergencyContact = (e) => {
  //   e.preventDefault();

  //   const isValid = validateEmergencyContactInfo(emergencyContactDetails);
  //   if (!isValid) {
  //     return false;
  //   }

  //   const newContactDetails = {
  //     name: emergencyContactDetails.emergencyFname,
  //     lname: emergencyContactDetails.emergencyLname,
  //     email: emergencyContactDetails.emergencyEmail,
  //     phone: emergencyContactDetails.emergencyPhoneNo,
  //     contactAccordianLength: contactAccordian.length + 1
  //   };

  //   setContactAccordian([...contactAccordian, newContactDetails]);
  //   // setEmergencyContactDetails({
  //   //   emergencyFname: '',
  //   //   emergencyLname: '',
  //   //   emergencyEmail: '',
  //   //   emergencyPhoneNo: '',
  //   // });

  //   return true;
  // };

  const addEmergencyContact = () => {
    const { isValid, errors } = validateEmergencyContactInfo(emergencyContactDetails);
    if (!isValid) {
      setEmergencyContactErr(errors);
      return false;
    }

    const newContactDetails = {
      name: emergencyContactDetails.emergencyFname,
      lname: emergencyContactDetails.emergencyLname,
      email: emergencyContactDetails.emergencyEmail,
      phone: emergencyContactDetails.emergencyPhoneNo,
      contactAccordianLength: contactAccordian.length + 1
    };

    setContactAccordian(prevState => [...prevState, newContactDetails]);
    setEmergencyContactDetails({
      emergencyFname: '',
      emergencyLname: '',
      emergencyEmail: '',
      emergencyPhoneNo: '',
    });

    return true;
  };



  // const addEmergencyContactNext = () => {
  //   const isValid = validateEmergencyContactInfo(emergencyContactDetails);
  //   if (!isValid && !contactAccordian.length) {
  //     return false;
  //   }
  //   const newContactDetails = {
  //     name: emergencyContactDetails.emergencyFname,
  //     lname: emergencyContactDetails.emergencyLname,
  //     email: emergencyContactDetails.emergencyEmail,
  //     phone: emergencyContactDetails.emergencyPhoneNo,
  //     contactAccordianLength: contactAccordian.length + 1
  //   };

  //   setContactAccordian(prevState => [...prevState, newContactDetails]);
  //   setEmergencyContactDetails({
  //     emergencyFname: '',
  //     emergencyLname: '',
  //     emergencyEmail: '',
  //     emergencyPhoneNo: '',
  //   });

  //   return true;
  // };


  const removeEmergencyContact = (index) => {
    const list = [...contactAccordian]
    list.splice(index, 1);
    setContactAccordian(list)
    sessionStorage.setItem('emergencyDetail', JSON.stringify(list));
  }

  const handleFileSelect = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => setPreviewSrc(reader.result);
      setFile(e.target.files[0]);
      SetimguploadStatus(true);
      // saveTenantPhoto();
    }
  }

  async function saveTenantPhoto() {
    const userId = localStorage.getItem("userid");
    if (!file) {
      toast.error("Please select a file", {
        position: "top-right",
        autoClose: 3000,
        duration: 100,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        toastId: "profilePhoto"
      });
      return;
    }
    const timestamp = new Date().getTime();
    const fileName = `${userId}_${timestamp}.png`;

    const data = new FormData();
    data.append("FileData", file);
    data.append("FileName", fileName);

    const config = {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
        maxBodyLength: Infinity,
        accept: "application/json",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`
      },
      data
    };
    try {
      const response = await instance.post(
        `${request.add_profile_picture}${userId}`,
        data,
        config
      );
      console.log(response.data);
      // TODO: handle successful response
    } catch (error) {
      console.error(error);
      // TODO: handle error
    }
  }


  const dateOfBirthChange = (e, date) => {
    TenantInfoDetails['birthDate'] = date.value;
  }

  const oAuthTokenGeneration = async () => {
    const currentTimestamp = new Date().getTime() / 1000;
    const tokenExpirationTimestamp = sessionStorage.getItem("tokenExpirationTimestamp");
    const client_id = process.env.REACT_APP_CLIENT_ID
    const client_secret = process.env.REACT_APP_CLIENT_SECRET
    // Check if the token has expired
    if (!tokenExpirationTimestamp || currentTimestamp > parseInt(tokenExpirationTimestamp)) {
      try {
        const data = {
          client_id: client_id,
          client_secret: client_secret,
          grant_type: 'client_credentials',
          acr_values: `tenant:${clientDataconfig.clientId}`,
          scopes: 'sixstorage_admin_api_scope'
        };
        const config = {
          headers: {
            'tenant': 'root',
            'Accept-Language': 'en-US',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        };
        const authorityUrl = process.env.REACT_APP_AUTHORITY

        await axios.post(authorityUrl, data, config)
          .then(response => {
            const accessToken = response.data.access_token;
            const expirationTimestamp = currentTimestamp + response.data.expires_in;
            // Store the new token and its expiration timestamp
            // localStorage.setItem("accessToken", accessToken);
            // localStorage.setItem("tokenExpirationTimestamp", expirationTimestamp);
            sessionStorage.setItem("accessToken", accessToken);
            sessionStorage.setItem("tokenExpirationTimestamp", expirationTimestamp);
            return accessToken;
          })
          .catch(error => {
            console.error(error);
          });
      } catch (error) {
        console.error(error);
      }
    } else {
      return sessionStorage.getItem("accessToken");
    }
  };



  const creditCheckSettingsInformation = async (e) => {
    // setIsLoading(true)
    await oAuthTokenGeneration()
    const requestBody = {
      country_code: "NOR",
      event_type: "GET_CREDIT_CHECK_SETTINGS",
      client_id: `${clientDataconfig.clientId}`,
      integrated_with: "signicat",
      initiated_by: "karthick"
    }

    const creditCheckConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    };
    const sixVerifierSettingsUrl = process.env.REACT_APP_SIX_VERIFIER_SETTINGS_URL

    try {
      const response = await axios.post(sixVerifierSettingsUrl, requestBody, creditCheckConfig);
      if (response.data.status === 200 && response.data.body.is_enabled_in_booking_portal) {
        if (BusinessUser) {
          if (response.data.body.enable_in_booking_portal_for === "BUSINESS" || response.data.body.enable_in_booking_portal_for === "BOTH") {
            await proceedCreditCheck(e);
          } else {
            setIsLoading(true);
            console.log("Continue with Normal Move-in");
            navigate('/preBooking/esignPayment');
          }
        } else {
          if (response.data.body.enable_in_booking_portal_for === "PERSONAL" || response.data.body.enable_in_booking_portal_for === "BOTH") {
            await proceedCreditCheck(e);
          } else {
            setIsLoading(true);
            console.log("Continue with Normal Move-in");
            navigate('/preBooking/esignPayment');
          }
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false)
    }
  };


  const navigateEsign = async (e) => {
    if (typeof e !== 'undefined' && e !== null) {
      e.preventDefault();
    }
    // await updateTenantInfo();
    navigate('/preBooking/esignPayment');

    //sessionStorage.setItem('customFieldstorage', JSON.stringify(unitDetailCustomField));
    // leaseProfileSave(unitDetailCustomField)
  };


  const fetchTenantInfo = async () => {
    setIsLoading(true);
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let tenantinfodata = {
      userId: userid,
    };
    try {
      const response = await instance.get(
        request.tenant_details + "/" + userid,
        tenantinfodata,
        config
      );
      const tenantInfoGetdata = response.data;
      if (
        typeof tenantInfoGetdata !== "undefined" &&
        tenantInfoGetdata !== null &&
        tenantInfoGetdata !== ""
      ) {
        const tenantInfoGetresult = tenantInfoGetdata.result;
        if (
          typeof tenantInfoGetresult !== "undefined" &&
          tenantInfoGetresult !== null & tenantInfoGetresult !== ""
        ) {
          sessionStorage.setItem("tenantInfo", JSON.stringify(tenantInfoGetresult));
          let tenantMovinData = JSON.parse(sessionStorage.getItem("tenantInfo"));
          setTenantInfoDetails(tenantMovinData);
          setPreviewSrc(tenantInfoGetresult.photoPath);
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };





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
    // customValues = {
    //   value: e.target.value,
    //   unitId: e.target.dataset.unitid,
    //   fieldId: e.target.dataset.fieldid,
    // }
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
  };

  const proceedCreditCheck = async (e) => {
    // e.preventDefault()
    // await updateTenantInfo();
    // setCreditCheckLoader(true);
    const requestBody = {
      country_code: "NOR",
      event_type: "CREDIT_CHECK_ENQUIRY",
      identity_number: TenantInfoDetails.ssn,
      // identity_number: "24014021406",
      initiated_by: `${TenantInfoDetails.firstName} ${TenantInfoDetails.lastName}`,
      request_from: "BOOKING_PORTAL",
      tenant_id: `${userid}`,
      tenant_type: BusinessUser ? "BUSINESS" : "PERSON",
    }

    if (BusinessUser) {
      delete requestBody.identity_number;
      requestBody.organization_number = TenantInfoDetails.companyRegistrationNumber;
    }
    var creditCheckConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
      },
    };

    const creditCheckUrl = process.env.REACT_APP_CREDIT_CHECK_URL
    await axios.post(creditCheckUrl, requestBody, creditCheckConfig)
      .then(response => {
        return response;
      }).then(result => {
        const tenantId = JSON.parse(sessionStorage.getItem("tenantInfo")).userId;
        const data = {
          creditCheckResponse: result,
          tenantId: tenantId
        };
        localStorage.setItem("creditCheckResponse", JSON.stringify(data));
        checkCreditCheckStatus()
        // if (result.data.status === 500) {
        //   if (result.data.message === "TRY_CREDITCHECK_AFTER_SOMETIME") {
        //     setTenantCreditCheckDetails({ ...tenantCreditCheckDetails, credit_check_details: result.data.message, credit_check_discription: result.data.description, modified_on: new Date() })
        //     setCreditCheckLoader(false);
        //     SetCreditStatus(true)
        //   } else {
        //     setTenantCreditCheckDetails({ ...tenantCreditCheckDetails, credit_check_details: result.data.message, credit_check_discription: result.data.description, modified_on: new Date() })
        //     setCreditCheckLoader(false);
        //     SetCreditStatus(true)
        //   }

        // } else {
        //   localStorage.setItem('nextpage', result.data.body.is_movein_recommended ? true : false)
        //   localStorage.setItem('eSignatureCompleted', false)
        //   // setCreditCheckStatusResponse(response.data)
        //   setTenantCreditCheckDetails({ ...tenantCreditCheckDetails, credit_check_details: result.data.body, modified_on: new Date() })
        //   setCreditCheckLoader(false);
        //   SetCreditStatus(true)
        // }
      })
      .catch((error) => {
        console.log(error);
        // setCreditCheckLoader(false);
        // setCreditCheckError(true);
      })
    return;
  }

  const checkCreditCheckStatus = () => {
    const storedData = JSON.parse(localStorage.getItem("creditCheckResponse"));
    const currentTenantId = JSON.parse(sessionStorage.getItem("tenantInfo")).userId;

    if (storedData.tenantId === currentTenantId) {
      // use the stored data
    } else {
      // update with new tenant data or ignore
    }
    const isCreditCheckResponseStored = localStorage.getItem('creditCheckResponse');
    const parsedResponse = JSON.parse(isCreditCheckResponseStored);
    if (parsedResponse.creditCheckResponse.data.status === 500) {
      if (parsedResponse.creditCheckResponse.data.message === "TRY_CREDITCHECK_AFTER_SOMETIME") {
        console.log("Continue with Normal Move-in");
        navigate('/preBooking/esignPayment');
      }
      else {
        setTenantCreditCheckDetails({ ...tenantCreditCheckDetails, credit_check_details: parsedResponse.creditCheckResponse.data.message, credit_check_discription: parsedResponse.creditCheckResponse.data.description, modified_on: new Date() })
        SetCreditCheckModal({ open: true })
        setCreditCheckLoader(true);
        setTimeout(() => {
          setCreditCheckLoader(false);
          SetCreditStatus(true)
        }, 1500);
      }
    } else {
      localStorage.setItem('nextpage', parsedResponse.creditCheckResponse.data.body.is_movein_recommended ? true : false)
      localStorage.setItem('eSignatureCompleted', false)
      // setCreditCheckStatusResponse(response.data)
      setTenantCreditCheckDetails({ ...tenantCreditCheckDetails, credit_check_details: parsedResponse.creditCheckResponse.data.body, modified_on: new Date() })
      SetCreditCheckModal({ open: true })
      setCreditCheckLoader(true);
      setTimeout(() => {
        setCreditCheckLoader(false);
        SetCreditStatus(true)
      }, 1500);

    }
  };

  // const proceedCreditCheck = async (e) => {
  //   e.preventDefault()
  //   await updateTenantInfo();
  //   setCreditCheckLoader(true);
  //   const requestBody = {
  //     country_code: "NOR",
  //     event_type: "CREDIT_CHECK_ENQUIRY",
  //     identity_number: TenantInfoDetails.ssn,
  //     // identity_number: "24014021406",
  //     initiated_by: `${TenantInfoDetails.firstName} ${TenantInfoDetails.lastName}`,
  //     request_from: "BOOKING_PORTAL",
  //     tenant_id: `${userid}`,
  //     tenant_type: BusinessUser ? "BUSINESS" : "PERSON",
  //   }

  //   if (BusinessUser) {
  //     delete requestBody.identity_number;
  //     requestBody.organization_number = TenantInfoDetails.companyRegistrationNumber;
  //   }
  //   var creditCheckConfig = {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
  //     },
  //   };

  //   const creditCheckUrl = process.env.REACT_APP_CREDIT_CHECK_URL
  //   await axios.post(creditCheckUrl, requestBody, creditCheckConfig)
  //     .then(response => {
  //       return response;
  //     }).then(result => {
  //       if (result.data.status === 500) {
  //         if (result.data.message === "TRY_CREDITCHECK_AFTER_SOMETIME") {
  //           setTenantCreditCheckDetails({ ...tenantCreditCheckDetails, credit_check_details: result.data.message, credit_check_discription: result.data.description, modified_on: new Date() })
  //           setCreditCheckLoader(false);
  //           SetCreditStatus(true)
  //         } else {
  //           setTenantCreditCheckDetails({ ...tenantCreditCheckDetails, credit_check_details: result.data.message, credit_check_discription: result.data.description, modified_on: new Date() })
  //           setCreditCheckLoader(false);
  //           SetCreditStatus(true)
  //         }

  //       } else {
  //         localStorage.setItem('nextpage', result.data.body.is_movein_recommended ? true : false)
  //         localStorage.setItem('eSignatureCompleted', false)
  //         // setCreditCheckStatusResponse(response.data)
  //         setTenantCreditCheckDetails({ ...tenantCreditCheckDetails, credit_check_details: result.data.body, modified_on: new Date() })
  //         setCreditCheckLoader(false);
  //         SetCreditStatus(true)
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setCreditCheckLoader(false);
  //       setCreditCheckError(true);
  //     })
  //   return;
  // }

  const bindCustomFieldValue = () => {
    let filtervalue = unitDetailCustomField.filter((i => i.fieldpage === 'Movein Tenant Details'));
    filtervalue.forEach((item) => {
      let element = document.getElementById(`${item.typeof}_${item.fieldId}`);
      if (item.typeof === 'textbox' || item.typeof === 'textarea' && element) {
        element.value = item.value
      } else if (item.typeof === 'checkboxes' || item.typeof === 'checkbox') {
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
            element.value = helper.readDate(new Date(item.value))
          }

        }, 1000)
      }
    })
  }

  const leaseProfileSave = async (customfield) => {
    sessionStorage.setItem('customFieldstorage', JSON.stringify(customfield));
    setIsBtnLoading(true)
    // addEmergencyContactNext()
    const isEmergencyContactValid = validateEmergencyContactInfo(emergencyContactDetails)
    console.log("isEmergencyContactValid", isEmergencyContactValid);
    if (isEmergencyContactValid) {
      return
    }
    try {
      let emergencyContactArray = [];
      if (contactAccordian.length > 0) {
        sessionStorage.setItem('emergencyDetail', JSON.stringify(contactAccordian));
        contactAccordian.forEach((item) => {
          emergencyContactArray.push({
            id: null,
            firstName: item.name,
            lastName: item.lname,
            email: item.email,
            mobile: item.phone
          })
        })
      } else {
        emergencyContactArray = [];
      }

      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      let companyDetail = {
        companyName: TenantInfoDetails.companyName,
      }

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
        companyDetails: BusinessUser ? companyDetail : {},
        deliveryAddress: {},
        customFields: customfield ? customfield : [],
        emergencyContact: emergencyContactArray,
        id: leaseProfileId ? leaseProfileId : null,
        tenantId: userid,
        firstName: TenantInfoDetails.firstName,
        lastName: TenantInfoDetails.lastName,
        email: TenantInfoDetails.email,
        isBusinessUser: BusinessUser,
        phoneNumberOne: TenantInfoDetails.phoneNumber,
        dob: TenantInfoDetails.birthDate,
        preferredStorage: preferredStorageValue
      }

      const response = await instance.post(request.lease_profile, requestbody, config);
      if (response.data.result !== null && response.data.result !== 'undefined') {
        sessionStorage.setItem("leaseProfileid", response.data.result);
        // navigate('/preBooking/esignPayment')
        //checkCustomfieldValue();
        setIsBtnLoading(false)
      }
    } catch (error) {
      console.log(error);
      // Handle errors here
      setIsBtnLoading(false)
    }
  };


  const navigateToPayNowPage = async (e) => {
    // Step 1: Initialize errorcount to zero
    let errorcount = 0;

    // Step 2: Perform validations
    const customFieldsErrorCount = checkCustomfieldValue();
    if (customFieldsErrorCount > 0) {
      errorcount += customFieldsErrorCount;
    } else {
      errorcount = 0
    }

    if (!validatePersonalInfo(TenantInfoDetails)) {
      errorcount++;
    }

    // Check if at least one emergency contact has been added
    if (contactAccordian.length === 0) {
      // Validate emergency contact details and increment error count if validation fails
      const isEmergencyContactValid = validateEmergencyContactInfo(emergencyContactDetails);
      if (!isEmergencyContactValid) {
        errorcount++;
      }
    }

    // Step 3: Return if there are errors
    if (errorcount > 0) {
      return;
    }

    // Step 4: Update and Proceed to next step
    await updateTenantInfo();
  }


  const updateTenantInfo = async () => {
    await saveTenantPhoto();
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    const requestBody = {
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
    };
    const response = await instance.post(request.update_user_info + `/${userid}`, requestBody, config);
    const userUpdateResponse = response.data.data;
    console.log(customFieldValue);
    Array.prototype.push.apply(unitDetailCustomField, customFieldValue);
    console.log(unitDetailCustomField);
    await leaseProfileSave(unitDetailCustomField);
    await creditCheckSettingsInformation();
  };

  const handleInputKeyDown = (event) => {
    const pattern = /^[0-9\b]+$/;
    const mathSymbols = /[-+*/^()]/;
    const inputChar = String.fromCharCode(event.keyCode);
    if (!pattern.test(inputChar) && !mathSymbols.test(inputChar)) {
      if (event.ctrlKey || event.metaKey) {
        return true;
      }
      if (event.clipboardData) {
        const pasteData = event.clipboardData.getData('text/plain');
        if (!pattern.test(pasteData)) {
          event.preventDefault();
        }
      } else {
        event.preventDefault();
      }
    }
  };

  return (
    <>
      <div>
        {isLoading ? (
          <Spinner />
          // <Loader size='large' active>{t("Loading")}</Loader>
        ) :
          (
            <div>
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
                  <span className='veritical-align-text-top ml-1'>{t("Tenant Details")}</span></h6>
                <div className="row reverse-sm">
                  <div className="col-12 col-md-6 ui form">
                    <div className="col-12 px-4 px-sm-2">
                      <div className="field w-100  my-3">
                        <label className='fw-500 fs-7 mb-2'>{t("First Name")}<i className="text-danger ">*</i></label>
                        <input type='text' placeholder={t('Enter First Name')} name="firstName" value={TenantInfoDetails.firstName} onChange={(e) => handlechange(e)} onBlur={() => validatePersonalInfo(TenantInfoDetails)} />
                        {/* <div className="text-danger mt-1">{fname_Data}</div> */}
                        {tenantInfoError.firstName && <p className="text-danger mt-1">{tenantInfoError.firstName}</p>}

                      </div>
                    </div>
                    <div className="col-12  px-4 px-sm-2">
                      <div className="field w-100  my-3">
                        <label className='fw-500 fs-7 mb-2'>{t("Last Name")}<i className="text-danger ">*</i></label>
                        <input type='text' placeholder={t('Enter Last Name')} name="lastName" value={TenantInfoDetails.lastName} onChange={(e) => handlechange(e)} onBlur={() => validatePersonalInfo(TenantInfoDetails)} />
                        {/* <div className="text-danger mt-1">{lastNameError}</div> */}
                        {tenantInfoError.lastName && <p className="text-danger mt-1">{tenantInfoError.lastName}</p>}

                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 d-flex justify-content-center mb-2">
                    <div className="edit-profile-img position-relative">
                      {/* <img src={profileImageSrc && profileImageSrc.length > 0 ? profileImageSrc : '/assets/images/profile_.png'} className="ui medium circular image object-fit-cover TenantDetailsProfileImage mx-auto" id="tenantProfileImage" alt="Profile" /> */}
                      {previewSrc ? (
                        <Image src={previewSrc} className="ui medium circular image object-fit-cover TenantDetailsProfileImage mx-auto" id="tenantProfileImage" alt="Profile" />
                      ) : (
                        <Image src='/assets/images/userDemoProfile.svg' className="ui medium circular image object-fit-cover TenantDetailsProfileImage mx-auto" id="tenantProfileImage" alt="Profile" />
                      )}
                      <div className="edit-icon position-absolute text-center l-18 r-0 t-1">
                        <label className="cursor-pointer" htmlFor='handleFileSelect'>
                          <img width='50' height='50' className="" src="/assets/images/edit-photo.svg" alt="Edit" />
                        </label>
                        <input id='handleFileSelect' onChange={e => handleFileSelect(e)} type="file" hidden />
                      </div>
                    </div>
                  </div>

                </div>
                <div className="row ui form mb-1">
                  <div className="col-12  col-md-6  px-4 px-sm-2">
                    <div className="field datePicker w-100 my-3">
                      <label className='fw-500 fs-7 mb-2' >{t("Date of Birth")}<i className="text-danger ">*</i></label>
                      <SemanticDatepicker
                        datePickerOnly
                        placeholder={t('Select date')}
                        name="birthDate"
                        className="w-100"
                        format="DD-MM-YYYY"
                        value={TenantInfoDetails.birthDate ? new Date(TenantInfoDetails.birthDate) : TenantInfoDetails.birthDate}
                        minDate={minDate}
                        maxDate={new Date()}
                        onChange={dateOfBirthChange}
                      />
                      {tenantInfoError.birthDate && <p className="text-danger mt-1">{tenantInfoError.birthDate}</p>}

                    </div>
                  </div>
                  <div className="col-12  col-md-6  px-4 px-sm-2">
                    <div className="field w-100  my-3">
                      <label className='fw-500 fs-7 mb-2'>{t("Email Address")} <i className="text-danger ">*</i></label>
                      <input disabled type='email' placeholder={t('Enter Email Address')} name="email" value={TenantInfoDetails.email} onChange={(e) => handlechange(e)} onBlur={() => validatePersonalInfo(TenantInfoDetails)} />
                      {tenantInfoError.email && <p className="text-danger mt-1">{tenantInfoError.email}</p>}

                    </div>
                  </div>
                  <div className="col-12  col-md-6  px-4 px-sm-2">
                    <div className="points-events-none field w-100  my-3 tenantPhonenumber">
                      <label className='fw-500 fs-7 mb-2'>{t("Phone Number")} <i className="text-danger ">*</i></label>
                      <ReactPhoneInput
                        name="phoneNumber"
                        disabled
                        value={TenantInfoDetails.phoneNumber}
                        className={`profilePhoneNumber`}
                        placeholder={t("Enter Mobile Number")}
                        id="tenantinfophone"
                      />
                      {/* <Input disabled className="noCounterNumber" type="number" name="phoneNumber" placeholder="Enter Mobile Number" value={TenantInfoDetails.phoneNumber} onChange={(e) => handlechange(e)} onBlur={() => validatePersonalInfo("email", email)}
                label={<Dropdown defaultValue='+91' search options={countriecodes} />}
                labelPosition='left' /> */}
                      {/* <div className="text-danger mt-1">{phoneNo_Data}</div> */}
                      {tenantInfoError.phoneNumber && <p className="text-danger mt-1">{tenantInfoError.phoneNumber}</p>}

                    </div>
                  </div>
                  <div className="col-12  col-md-6  px-4 px-sm-2">
                    <div className="field w-100  my-3">
                      <label className='fw-500 fs-7 mb-2'>{t("Social Security Number")} <i className="text-danger ">*</i></label>
                      <input className="noCounterNumber" ref={ssn} type='number' name="ssn" value={TenantInfoDetails.ssn} placeholder={t("Social Security Number")} onChange={(e) => handlechange(e)} onBlur={() => validatePersonalInfo(TenantInfoDetails)} onKeyDown={(e) => handleInputKeyDown(e)} />
                      {tenantInfoError.ssn && <p className="text-danger mt-1">{tenantInfoError.ssn}</p>}

                    </div>
                  </div>
                  {BusinessUser ?
                    <div className="col-12  col-md-6  px-4 px-sm-2">
                      <div className="field w-100  my-3">
                        <label className='fw-500 fs-7 mb-2'>{t("Company Name")}<i className="text-danger ">*</i></label>
                        <input className="noCounterNumber" ref={companyName} value={TenantInfoDetails.companyName} type='text' name="companyName" placeholder='Company Name' onChange={(e) => handlechange(e)} onBlur={() => validatePersonalInfo(TenantInfoDetails)} />
                        {tenantInfoError.companyName && <p className="text-danger mt-1">{tenantInfoError.companyName}</p>}
                      </div>
                    </div>
                    : ""

                  }
                  {BusinessUser ?
                    <div className="col-12  col-md-6  px-4 px-sm-2">
                      <div className="field w-100  my-3">
                        <label className='fw-500 fs-7 mb-2'>{t("Company registration No")} <i className="text-danger ">*</i></label>
                        <input className="noCounterNumber" ref={companyRegistrationNumber} value={TenantInfoDetails.companyRegistrationNumber} type='text' name="companyRegistrationNumber" placeholder='Company registration No' onChange={(e) => handlechange(e)} onBlur={() => validatePersonalInfo(TenantInfoDetails)} />
                        <div id="registration" className="text-danger mt-1 d-none"> {t("Please Enter registration No")} </div>
                        {tenantInfoError.companyRegistrationNumber && <p className="text-danger mt-1">{tenantInfoError.companyRegistrationNumber}</p>}

                      </div>
                    </div> : ""


                  }
                  {typeof customFieldAccess !== "undefined" && customFieldAccess !== null && customFieldAccess !== "" && customFieldAccess.length > 0 ?
                    customFieldAccess.map((item, index) => {
                      {

                        typeof Sdetails !== "undefined" && Sdetails !== null && Sdetails !== "" && Sdetails.length > 0 ?
                          Sdetails.forEach((data) => {
                            cusomfieldPhone = data.value.fid;
                          }) : ""
                      }

                      if (item.matadata.displayOn === "Movein Tenant Details" && item.matadata.type === "textbox" && item.matadata.dataType === "Alphabet") {
                        return <div key={item.fieldId} className="col-12 col-md-6 px-4 px-sm-2">
                          <div key={item.fieldId} className="field w-100 my-2 ">
                            <label className='fw-500 fs-7 mb-2'>{item.fieldName} {item.matadata.isMandatory ? <i className="text-danger ">*</i> : ""}
                            </label>
                            <input type='text' id={`${item.matadata.type}_${item.fieldId}`} placeholder={item.fieldName} data-name={item.fieldName} data-fieldid={item.fieldId} data-unitid={unitid} data-required={item.matadata.isMandatory} data-datatype={item.matadata.dataType} data-type={item.matadata.type} data-fieldpage={item.matadata.displayOn} onChange={(e) => customhandlechange(e)} onBlur={(e) => validateCustomFields(e)} />
                            <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>{t("Required Field")}</div>
                            <div className="text-danger mt-1" id={item.matadata.dataType} style={{ display: 'none' }}>{t("It should allow Alphabet Only")}</div>
                          </div>
                        </div>

                      } else if (item.matadata.displayOn === "Movein Tenant Details" && item.matadata.type === "textbox" && item.matadata.dataType === "Alphanumeric") {

                        return <div key={item.fieldId} className="col-12 col-md-6 px-4 px-sm-2">
                          <div className="field w-100 my-2 ">
                            <label className='fw-500 fs-7 mb-2'>{item.fieldName} {item.matadata.isMandatory ? <i className="text-danger ">*</i> : ""}
                            </label>
                            <input type='text' id={`${item.matadata.type}_${item.fieldId}`} placeholder={item.fieldName} value={customInputFieldValue} data-name={item.fieldName} data-fieldid={item.fieldId} data-unitid={unitid} data-required={item.matadata.isMandatory} data-type={item.matadata.type} data-fieldpage={item.matadata.displayOn} onChange={(e) => customhandlechange(e)} onBlur={(e) => validateCustomFields(e)} />
                            <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>{t("Required Field")}</div>
                          </div>
                        </div>

                      }

                      else if (item.matadata.displayOn === "Movein Tenant Details" && item.matadata.type === "date") {
                        return <div key={item.fieldId} className="col-12 col-md-6 px-4 px-sm-2">
                          <div className="field w-100 datePicker my-2">
                            <label className='fw-500 fs-7 mb-2'>{item.fieldName} {item.matadata.isMandatory ? <i className="text-danger ">*</i> : ""}</label>
                            <SemanticDatepicker datePickerOnly id={`${item.matadata.type}_${item.fieldId}`} placeholder={item.fieldName} className='w-100' data-name={item.fieldName} fieldId={item.fieldId} unitId={unitid} required={item.matadata.isMandatory} fieldpage={item.matadata.displayOn} type={item.matadata.type} onChange={(e, data) => customhandlechange(e, data, "date")} />
                            <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>{t("Required Field")}</div>
                          </div>
                        </div>
                      }
                      else if (item.matadata.displayOn === "Movein Tenant Details" && item.matadata.type === "checkboxes") {
                        return <div key={item.fieldId} className="col-12 col-md-6 px-4 px-sm-2">
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

                      else if (item.matadata.displayOn === "Movein Tenant Details" && item.matadata.type === "textarea") {

                        return <div key={item.fieldId} className="col-12 col-md-6 px-4 px-sm-2">
                          <div className="field w-100 my-2">
                            <label className='fw-500 fs-7 mb-2'>{item.fieldName} {item.matadata.isMandatory ? <i className="text-danger ">*</i> : ""}</label>
                            <textarea id={`${item.matadata.type}_${item.fieldId}`} placeholder={item.fieldName} data-name={item.fieldName} data-type={item.matadata.type} value={customInputFieldValue} rows="3" data-fieldid={item.fieldId} data-unitid={unitid} data-required={item.matadata.isMandatory} data-fieldpage={item.matadata.displayOn} onChange={(e) => customhandlechange(e)} onBlur={(e) => validateCustomFields(e)}></textarea>
                            <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>{t("Required Field")}</div>
                          </div>
                        </div>

                      }
                      else if (item.matadata.displayOn === "Movein Tenant Details" && item.matadata.type === "checkbox") {

                        return <div key={item.fieldId} className="col-12 col-md-6 px-4 px-sm-2">
                          <span id={`${item.matadata.type}_${item.fieldId}`}>
                            <span className="mx-0">
                              <input className="mr-1" type="checkbox" name={`${item.matadata.type}_${item.fieldId}`} data-name={item.fieldName} data-fieldid={item.fieldId} data-unitid={unitid} data-required={item.matadata.isMandatory} data-type={item.matadata.type} value={item.fieldName} data-fieldpage={item.matadata.displayOn} onChange={(e) => customhandlechange(e)} onBlur={(e) => validateCustomFields(e)} />
                              <label>{item.fieldName}{item.matadata.isMandatory ? <i className="text-danger ">*</i> : ""}</label>
                            </span>
                          </span>
                          <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>{t("Required Field")}</div>
                        </div>

                      } else if (item.matadata.displayOn === "Movein Tenant Details" && item.matadata.type === "textbox" && item.matadata.dataType === "Digits (0-9)") {

                        return <div key={item.fieldId} className="col-12 col-md-6 px-4 px-sm-2">
                          <div className="field w-100 my-2 ">
                            <label className='fw-500 fs-7 mb-2'>{item.fieldName} {item.matadata.isMandatory ? <i className="text-danger ">*</i> : ""}
                            </label>
                            <input type='number' onKeyDown={handleInputKeyDown} id={`${item.matadata.type}_${item.fieldId}`} name={item.fieldId} placeholder={item.fieldName} value={cusomfieldPhone} data-name={item.fieldName} data-fieldid={item.fieldId} data-unitid={unitid} data-required={item.matadata.isMandatory} data-type={item.matadata.type} data-fieldpage={item.matadata.displayOn} onChange={(e) => customhandlechange(e)} onBlur={(e) => validateCustomFields(e)} />
                            <div className="text-danger mt-1" id={item.fieldId} style={{ display: 'none' }}>{t("Required Field")}</div>
                          </div>
                        </div>

                      } else if (item.matadata.displayOn === "Movein Tenant Details" && item.matadata.type === "radio") {
                        return <div key={item.fieldId} className="col-12 col-md-6 px-4 px-sm-2">
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
                      <span className='veritical-align-text-top ml-1'>{t("Address Details")}</span></h6>
                  </div>
                  <div className="col-12 col-md-6 px-4 px-sm-2">
                    <div className="field w-100  my-3">
                      <label className='fw-500 fs-7 mb-2'>{t("Address Line 1")}<i className="text-danger ">*</i></label>
                      <input type='text' placeholder={t("Address Line 1")} name="addressLineOne" value={TenantInfoDetails.addressLineOne} onChange={(e) => handlechange(e)} onBlur={() => validatePersonalInfo(TenantInfoDetails)} />
                      {/* <div className="text-danger mt-1">{addressLine1Error}</div> */}
                      {tenantInfoError.addressLineOne && <p className="text-danger mt-1">{tenantInfoError.addressLineOne}</p>}

                    </div>
                  </div>
                  <div className="col-12 col-md-6 px-4 px-sm-2">
                    <div className="field w-100  my-3">
                      <label className='fw-500 fs-7 mb-2'>{t("Address Line 2")}</label>
                      <input type='text' placeholder={t("Address Line 2")} name="addressLineTwo" value={TenantInfoDetails.addressLineTwo} onChange={(e) => handlechange(e)} onBlur={() => validatePersonalInfo(TenantInfoDetails)} />
                    </div>
                  </div>
                  <div className="col-12 col-md-6 px-4 px-sm-2">
                    <div className="field w-100  my-3">
                      <label className='fw-500 fs-7 mb-2'>{t("City")}<i className="text-danger ">*</i></label>
                      <input type='text' placeholder={t("City")} name="city" value={TenantInfoDetails.city} onChange={(e) => handlechange(e)} onBlur={() => validatePersonalInfo(TenantInfoDetails)} />
                      {tenantInfoError.city && <p className="text-danger mt-1">{tenantInfoError.city}</p>}
                    </div>
                  </div>
                  <div className="col-12 col-md-6 px-4 px-sm-2">
                    <div className="field w-100  my-3">
                      <label className='fw-500 fs-7 mb-2'>{t("State/Provine")}<i className="text-danger ">*</i></label>
                      <input type='text' placeholder={t("State/Provine")} name="state" value={TenantInfoDetails.state} onChange={(e) => handlechange(e)} onBlur={() => validatePersonalInfo(TenantInfoDetails)} />
                      {tenantInfoError.state && <p className="text-danger mt-1">{tenantInfoError.state}</p>}
                    </div>
                  </div>
                  <div className="col-12 col-md-6 px-4 px-sm-2">
                    <div className="field w-100  my-3">
                      <label className='fw-500 fs-7 mb-2'>{t("Zip/Postal Code")}<i className="text-danger ">*</i></label>
                      <input className="noCounterNumber" type='number' name="zipCode" placeholder={t("Zip/Postal Code")} defaultValue={TenantInfoDetails.zipCode} onChange={(e) => handlechange(e)} onBlur={() => validatePersonalInfo(TenantInfoDetails)} />
                      {tenantInfoError.postalCode && <p className="text-danger mt-1">{tenantInfoError.postalCode}</p>}
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
                      <span className='veritical-align-text-top ml-1'>{t("Emergency Contact")}</span></h6>
                  </div>
                </div>
                {contactAccordian.length < 3 &&
                  <div className="row ui form mb-4 emergencycontact">
                    <div className="col-12 col-md-6 px-4 px-sm-2">
                      <div className="field w-100  my-3">
                        <label className='fw-500 fs-7 mb-2'>{t("First Name")}<i className="text-danger ">*</i></label>
                        <input value={emergencyContactDetails.emergencyFname} onChange={(e) => emergencyhandlechange(e)} onBlur={(e) => validateEmergencyContactInfo(emergencyContactDetails)} name="emergencyFname" type='text' placeholder={t("First Name")} />
                        {emergencyContactErr.emergencyFname && <p className="text-danger mt-1">{emergencyContactErr.emergencyFname}</p>}
                      </div>
                    </div>
                    <div className="col-12 col-md-6 px-4 px-sm-2">
                      <div className="field w-100  my-3">
                        <label className='fw-500 fs-7 mb-2'>{t("Last Name")}</label>
                        <input value={emergencyContactDetails.emergencyLname} onChange={(e) => emergencyhandlechange(e)} type='text' name="emergencyLname" onBlur={(e) => validateEmergencyContactInfo(emergencyContactDetails)} placeholder={t('Last Name')} />
                      </div>
                    </div>
                    <div className="col-12 col-md-6 px-4 px-sm-2">
                      <div className="field w-100  my-3">
                        <label className='fw-500 fs-7 mb-2'>{t("Email")} <i className="text-danger ">*</i></label>
                        <input value={emergencyContactDetails.emergencyEmail} onChange={(e) => emergencyhandlechange(e)} onBlur={(e) => validateEmergencyContactInfo(emergencyContactDetails)} type='email' name="emergencyEmail" placeholder={t('Enter Email')} />
                        {emergencyContactErr.emergencyEmail && <div className="text-danger mt-1">{emergencyContactErr.emergencyEmail}</div>}
                      </div>
                    </div>
                    <div className="col-12 col-md-6 px-4 px-sm-2">
                      <div className="field w-100  my-3">
                        <label className='fw-500 fs-7 mb-2'>{t("Phone Number")} <i className="text-danger ">*</i></label>
                        {/* <input value={contactPhone} onChange={e=>SetContactPhone(e.target.value)} className="noCounterNumber" type='number' placeholder='Enter Phone Number' /> */}
                        {/* <Input value={emergencyContactDetails.emergencyPhoneNo} onChange={(e) => emergencyhandlechange(e)} className="noCounterNumber" onBlur={(e) => validateEmergencyContactInfo(e.target.value)} type="number" name="emergencyPhoneNo" placeholder="Enter Mobile Number"
                  label={<Dropdown defaultValue='+91' search options={countriecodes} />}
                  labelPosition='left' /> */}
                        <ReactPhoneInput
                          country={`no`}
                          className={`profilePhoneNumber`}
                          value={emergencyContactDetails.emergencyPhoneNo}
                          placeholder={t("Enter Mobile Number")}
                          name="emergencyPhoneNo"
                          onBlur={(e) => validateEmergencyContactInfo(emergencyContactDetails)}
                          onChange={(e, d) => onChangePhoneInput(e, d)} />
                        <div className="text-danger mt-1">{[phone_err]}</div>
                      </div>
                    </div>
                    <div className="col-12">
                      <a onClick={(e) => addEmergencyContact(e)} className="text-success fs-7 px-4 px-sm-2 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="18" viewBox="0 0 27.505 27.5">
                          <path id="floating" d="M577.346,2164.47h1.719c.468.061.939.108,1.4.186a13.8,13.8,0,0,1,11.276,11.2c.089.5.142,1.006.211,1.51v1.719c-.04.327-.075.656-.122.981a13.749,13.749,0,1,1-23.4-11.494,13.464,13.464,0,0,1,7.4-3.886C576.337,2164.593,576.843,2164.539,577.346,2164.47Zm2,14.892h4.82a1.14,1.14,0,1,0,.027-2.278c-1.5-.009-3.007,0-4.51,0h-.336v-4.813a1.118,1.118,0,0,0-.693-1.111,1.131,1.131,0,0,0-1.588,1.07c-.01,1.5,0,3.007,0,4.51v.344h-4.806a1.141,1.141,0,1,0-.055,2.28c1.512.011,3.025,0,4.537,0h.323v.364c0,1.477,0,2.953,0,4.43a1.141,1.141,0,1,0,2.28.068c.012-1.5,0-3.007,0-4.51Z" transform="translate(-564.451 -2164.47)" fill="#328128" />
                        </svg><span className="veritical-align-text-top ml-1">{t("Add")}</span>
                      </a>
                    </div>
                  </div>
                }
                <div className="col-12 px-sm-2" id="EmergencyContactDiv">
                  {
                    contactAccordian.map((data, index) => (
                      <TenantDetailEmergengycontactAccordian key={index} removefunction={removeEmergencyContact} index={index} contactLength={data.contactAccordianLength} name={data.name} lname={data.lname} email={data.email} phone={data.phone} />
                    ))
                  }
                </div>

              </div>
              <div className="ui container text-center my-5">
                <Button onClick={() => navigate('/preBooking/addOns')} disabled={isLoading || isBtnLoading} className="ui button  basic border-success-dark-1 fs-7 fw-400 text-dark px-5 mr-2">{t("BACK")}</Button>
                <Button onClick={e => navigateToPayNowPage(e)} loading={isLoading || isBtnLoading} disabled={isLoading || isBtnLoading} className="ui button bg-success-dark   fs-7 fw-400 text-white px-5">{t("NEXT")}</Button>
              </div>
            </div>)}
      </div>

      <Modal
        dimmer={creditCheckModal.dimmer}
        open={creditCheckModal.open}
        size='tiny'
        onClose={() => SetCreditCheckModal({ open: false })}
      >
        <Modal.Header className='header text-success-dark text-center fw-601 fs-5 border-0 pb-1'>{t("CREDIT CHECK")}</Modal.Header>
        <Modal.Content className='mh-400 overflow-y-auto text-center pt-2'>
          <div className="d-flex justify-content-center mb-2">
            {(!creditCheckLoader && !creditStatus) && <Image width='250' src="/assets/images/creditCheck.svg" />}
            {/* Loader */}
            {creditCheckLoader && <>
              {BusinessUser ?
                <img width='250' src='/assets/images/credit-check_meter_C_AAA.svg' alt='CreditCheck' /> :
                <img width='250' src='/assets/images/credit-check_meter_0_100.svg' alt='CreditCheck' />}
            </>
            }

            {!creditCheckLoader && creditStatus &&
              <>
                {

                  BusinessUser ?
                    <Image width='250' src={`${PHOTO_URl_BUSINESS_USER(tenantCreditCheckDetails?.credit_check_details?.credit_score)}`} /> :
                    <Image width='250' src={`${PHOTO_URl_PERSONAL_USER(tenantCreditCheckDetails?.credit_check_details?.credit_score)}`} />

                }
              </>
            }
          </div>
          {!creditStatus && !creditCheckLoader &&
            <>
              {creditcheckerror ?
                <div className="mb-3 text-danger">
                  {t("Something went wrong. Please try Again")}.
                </div> : <div className="mb-3">
                  {t("As part of the move-in process, we need to verify your credit score, would you like to proceed for a credit check?")}
                </div>

              }
              {creditcheckerror ? <Button onClick={() => SetCreditCheckModal({ open: false })} className="ui button bg-secondary  fs-7 fw-400 text-white px-5 mr-1">{t("Close")}</Button> : <div className="">
                <Button onClick={() => SetCreditCheckModal({ open: false })} className="ui button bg-secondary  fs-7 fw-400 text-white px-5 mr-1">{t("Cancel")}</Button>
                <Button onClick={(e) => proceedCreditCheck(e)} className="ui button bg-success-dark   fs-7 fw-400 text-white px-5">{t("Proceed")}</Button>
              </div>}

            </>
          }
          {creditCheckLoader &&
            <div className="mb-3">
              {t("Please tie your shoes while we check your credit score.")} {t("Please do not perform any actions until we prompt")}
            </div>
          }
          {!creditCheckLoader && creditStatus && <>
            {(!tenantCreditCheckDetails?.credit_check_details?.is_movein_recommended) ? <>
              {tenantCreditCheckDetails?.credit_check_details === 'TRY_CREDITCHECK_AFTER_SOMETIME' ?
                <div className="mb-3 text-danger">
                  {tenantCreditCheckDetails.credit_check_discription}
                </div> : <div className="mb-3 text-danger">
                  {t("Oops! The customer cannot complete the move-in with this credit score")}
                </div>

              }

              <div>
                <Button onClick={() => SetCreditCheckModal({ open: false })} className="ui button bg-secondary  fs-7 fw-400 text-white px-5">{t("Close")}</Button>
              </div>
            </> : <>
              <div className="mb-3">
                {t("Congratulations! You have sufficient credit score to proceed further with us")}
              </div>
              <div>
                <Button onClick={(e) => navigateEsign(e)} className="ui button bg-secondary  fs-7 fw-400 text-white px-5">{t("Continue")}</Button>
              </div></>
            }
          </>
          }
        </Modal.Content>
      </Modal>
    </>
  )
}
