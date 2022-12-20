import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Input } from "semantic-ui-react";
import countriecodes from "../components/CountryCode";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import instance from '../services/instance';
import request from '../services/request';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl } from 'react-phone-number-input'


let DefaultCountryCode;


export default function PostSignupForm(props) {
    const clientDataconfig = JSON.parse(sessionStorage.getItem("configdata"));
    const culture = clientDataconfig.culture.culture
    const country = culture.substring(culture.indexOf('-') + 1, culture.length).toLowerCase();
    const [toggle, setToggle] = useState(true);
    const showPasswordHandler = () => {
        setToggle(!toggle);
    }
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // getting culture 
    // let culture = JSON.parse(sessionStorage.getItem('culture')).culture;
    // console.log(culture);
    function sixStorageCheckPhoneNumber(event) {
        let inputValue = event.target.value;
        let numbers = inputValue.replace(/[^0-9]/g, '');
        event.target.value = numbers;
    }
    //setting value in state
    const [values, setValues] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        UserName: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });
    //setting value in validation
    const [validations, setValidations] = React.useState({
        firstName: '',
        lastName: '',
        email: '',
        UserName: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });

    let { firstName, lastName, email, UserName, phoneNumber, password, confirmPassword } = values;
    const validateOne = (e) => {
        const { name } = e.target
        const value = values[name]
        let message = ''
        switch (name) {
            case 'firstName':
                if (!value) {
                    message = 'First Name is Required'
                }
                break;
            case 'lastName':
                if (!value) {
                    message = 'Last Name is Required'
                }
                break;
            case 'phoneNumber':
                if (!value) {
                    message = 'Phone Number is Required'
                } else if (values.phoneNumber.length < 10) {
                    message = 'Phone Number must be at least 10 characters'
                }
                break;
            case 'email':
                if (!value) {
                    message = 'Email is Required'
                } else if (!/\S+@\S+\.\S+/.test(value)) {
                    message = 'Email format must be as example@mail.com'
                }
                break;
            case 'password':
                if (!value) {
                    message = 'Password is Required'
                } else if (value.length < 8) {
                    message = 'Password must contain at least eight characters!';
                } else if (!/[0-9]/.test(value)) {
                    message = 'Password must contain at least one number (0-9)';
                } else if (!/[a-z]/.test(value)) {
                    message = 'Password must contain at least one lowercase letter (a-z)';
                } else if (!/[A-Z]/.test(value)) {
                    message = 'Password must contain at least one uppercase letter (A-Z)';
                } else if (!/[*@!#%&()$^~{}]/.test(value)) {
                    message = 'Password must contain at least one special character!';
                }
                break;
            default:
                break;
        }
        setValidations({ ...validations, [name]: message })
    }

    const handleChange = (e) => {
        e.persist();
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });

    }

    
  const onChangePhoneInput = (e, data) => {
    setValues({ ...values, ['phoneNumber']: e });
  }

    const ValidateSignin = (e) => {
        e.preventDefault();
        const validations = { firstName: '', lastName: '', email: '', phoneNumber: '', password: '' }
        let isValid = true;
        if (!firstName) {
            validations.firstName = 'First Name is required';
            isValid = false;
        }
        if (!lastName) {
            validations.lastName = 'Last Name  is required';
            isValid = false;
        }
        if (!email) {
            validations.email = 'Email  is required';
        }
        if (!phoneNumber) {
            validations.phoneNumber = 'Phone Number  is required';
        }

        if (!password) {
            validations.password = 'Password  is required';

        }

        if (!isValid) {
            setValidations(validations)
        } else {
            values['UserName'] = values['email'];
            values['confirmPassword'] = values['password'];
            signupcall();
        }

    }

    const signupcall = () => {
        let config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        instance
            .post(request.user_signup, values, config)
            .then(response => {
                const configData = response.data
                if (configData.result !== null && typeof configData.result !== 'undefined' && configData.result !== '') {

                    if (configData.returnCode === 'SUCCESS') {
                        console.log(configData);
                        if (props.callingfrom === 'prebooking') {
                            localStorage.setItem('userid', response.data.result);
                            navigate('/preBooking/TenantDetails')
                        } else {

                            navigate('/login');
                        }
                        // 
                    } else if (configData.returnCode === 'FAILED' && configData.returnMessage === "Username/email already exists.") {

                        toast.error('Username / email already exists', {
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

                } else {
                    console.log("test");
                }

            })
            .catch(error => {
                console.log(error);
            })

    }

    const {
        firstName: nameVal,
        lastName: lastval,
        email: emailval,
        phoneNumber: phoneNumberval,
        password: paswordval,
    } = validations

    return (

        <>
            <ToastContainer />

            <div className="createAccountform my-5 mx-auto overflow-hidden">
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="createAccountform-img d-flex justify-content-center align-items-center py-6 h-100">
                            <img src="/assets/images/createacc.png" alt="Create Account" />
                        </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="createAccountform-inputs bg-white h-100">
                            <div className="form-title">
                                <h2 className="text-success fw-600">CREATE YOUR ACCOUNT</h2>
                                <p>Already a User? <a href="/" onClick={e => ValidateSignin(e)}>Sign in </a></p>
                            </div>
                            <form>
                                <div className="form-control">
                                    <label className="d-block">First Name <span className="requiredfield">*</span></label>
                                    <div className="ui input w-100 position-relative">
                                        <input type="text" placeholder="Enter First Name" name="firstName" value={firstName} onChange={(e) => { handleChange(e) }} onBlur={validateOne} />
                                        <svg className="position-absolute l-1 t-1" id="user-svgrepo-com" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30.667 30.667">
                                            <g id="Group_6355" data-name="Group 6355">
                                                <path id="Path_18913" data-name="Path 18913" d="M26.176,4.49A15.334,15.334,0,0,0,4.49,26.176,15.334,15.334,0,0,0,26.176,4.49ZM15.333,28.973a13.64,13.64,0,1,1,13.64-13.64A13.658,13.658,0,0,1,15.333,28.973Z" fill="#b5b3b3" />
                                                <path id="Path_18914" data-name="Path 18914" d="M184.889,83.883a3.992,3.992,0,1,0-3.989-3.995A3.995,3.995,0,0,0,184.889,83.883Zm0-6.29a2.3,2.3,0,1,1-2.3,2.3A2.3,2.3,0,0,1,184.889,77.593Z" transform="translate(-169.555 -71.14)" fill="#b5b3b3" />
                                                <path id="Path_18915" data-name="Path 18915" d="M130.687,234.1a7.439,7.439,0,0,0-12.091,0,13.409,13.409,0,0,0-1.969,6.19.845.845,0,0,0,1.681.176c.533-5.161,2.665-7.776,6.334-7.776s5.8,2.615,6.334,7.776a.848.848,0,0,0,.84.759.413.413,0,0,0,.088-.006.845.845,0,0,0,.753-.928A13.385,13.385,0,0,0,130.687,234.1Z" transform="translate(-109.308 -216.513)" fill="#b5b3b3" />
                                            </g>
                                        </svg>
                                    </div>
                                    <div className="text-danger mt-1"> {nameVal}</div>
                                </div>
                                <div className="form-control">
                                    <label className="d-block">Last Name<span className="requiredfield">*</span></label>
                                    <div className="ui input w-100 position-relative">
                                        <input type="text" placeholder="Enter Last Name" name="lastName" value={lastName} onChange={(e) => { handleChange(e) }} onBlur={validateOne} />
                                        <svg className="position-absolute l-1 t-1" id="user-svgrepo-com" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30.667 30.667">
                                            <g id="Group_6355" data-name="Group 6355">
                                                <path id="Path_18913" data-name="Path 18913" d="M26.176,4.49A15.334,15.334,0,0,0,4.49,26.176,15.334,15.334,0,0,0,26.176,4.49ZM15.333,28.973a13.64,13.64,0,1,1,13.64-13.64A13.658,13.658,0,0,1,15.333,28.973Z" fill="#b5b3b3" />
                                                <path id="Path_18914" data-name="Path 18914" d="M184.889,83.883a3.992,3.992,0,1,0-3.989-3.995A3.995,3.995,0,0,0,184.889,83.883Zm0-6.29a2.3,2.3,0,1,1-2.3,2.3A2.3,2.3,0,0,1,184.889,77.593Z" transform="translate(-169.555 -71.14)" fill="#b5b3b3" />
                                                <path id="Path_18915" data-name="Path 18915" d="M130.687,234.1a7.439,7.439,0,0,0-12.091,0,13.409,13.409,0,0,0-1.969,6.19.845.845,0,0,0,1.681.176c.533-5.161,2.665-7.776,6.334-7.776s5.8,2.615,6.334,7.776a.848.848,0,0,0,.84.759.413.413,0,0,0,.088-.006.845.845,0,0,0,.753-.928A13.385,13.385,0,0,0,130.687,234.1Z" transform="translate(-109.308 -216.513)" fill="#b5b3b3" />
                                            </g>
                                        </svg>
                                    </div>
                                    <div className="text-danger mt-1"> {lastval}</div>
                                </div>
                                <div className="form-control">
                                    <label className="d-block">Email Address<span className="requiredfield">*</span></label>
                                    <div className="ui input w-100 position-relative">
                                        <input type="text" placeholder="Enter Email Address" name="email" value={email} onChange={(e) => { handleChange(e) }} onBlur={validateOne} />
                                        <svg className="position-absolute l-1 t-1" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 28.667 28.667">
                                            <path id="email-svgrepo-com_2_" data-name="email-svgrepo-com (2)" d="M24.469,4.2A14.333,14.333,0,0,0,4.2,24.469,14.348,14.348,0,0,0,19.913,27.54l-.691-1.633a12.562,12.562,0,1,1,7.671-11.573c0,3.034-1.864,4.415-3.6,4.415s-3.6-1.382-3.6-4.415a5.374,5.374,0,1,0-1.076,3.221,5.538,5.538,0,0,0,.948,1.366,5.132,5.132,0,0,0,7.448,0,6.494,6.494,0,0,0,1.645-4.587A14.24,14.24,0,0,0,24.469,4.2ZM14.333,17.929a3.6,3.6,0,1,1,3.6-3.6A3.6,3.6,0,0,1,14.333,17.929Z" opacity="0.22" />
                                        </svg>
                                    </div>
                                    <div className="text-danger mt-1"> {emailval}</div>
                                </div>
                                <div className="field form-control w-100">
                                    <label className="d-block">Mobile Number<span className="requiredfield">*</span></label>
                                    <div className="ui input w-100">
                                        {/* <Input className="noCounterNumber w-100" type="tel" placeholder="Enter Mobile Number" onInput={(e) => { sixStorageCheckPhoneNumber(e) }} name="phoneNumber" value={phoneNumber} onBlur={validateOne} onChange={(e) => { handleChange(e) }}
                                            label={<Dropdown defaultValue='+91' search options={countriecodes} />}
                                            labelPosition='left' /> */}

                                        <PhoneInput
                                            defaultCountry={DefaultCountryCode}
                                            value={values.phoneNumber}
                                            placeholder="Enter Mobile Number"
                                            onChange={(e, d) => onChangePhoneInput(e, d)} />
                                    </div>
                                    <div className="text-danger mt-1"> {phoneNumberval}</div>
                                </div>
                                <div className="form-control">
                                    <label className="d-block">Password<span className="requiredfield">*</span></label>
                                    <div className="ui input w-100 position-relative">
                                        <input type={toggle ? "password" : "text"} placeholder="Enter Password" name="password" value={password} onChange={(e) => { handleChange(e) }} onBlur={validateOne} />
                                        <svg className="position-absolute l-1 t-1" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 22.036 32">
                                            <g id="password-svgrepo-com" transform="translate(-31.62)" opacity="0.21">
                                                <path id="Path_18916" data-name="Path 18916" d="M50.9,11.539h-.521v-3.8a7.739,7.739,0,0,0-15.479,0v3.8h-.522A2.761,2.761,0,0,0,31.62,14.3V29.243A2.761,2.761,0,0,0,34.377,32H50.9a2.761,2.761,0,0,0,2.757-2.757V14.3A2.76,2.76,0,0,0,50.9,11.539Zm-13.636-3.8a5.376,5.376,0,0,1,10.752,0v3.8H37.262Zm14.03,21.5a.4.4,0,0,1-.394.394H34.377a.4.4,0,0,1-.394-.394V14.3a.4.4,0,0,1,.394-.394H50.9a.4.4,0,0,1,.394.394Z" />
                                                <path id="Path_18917" data-name="Path 18917" d="M95.229,116.309a1.182,1.182,0,0,0-1.182,1.182v4.524a1.182,1.182,0,1,0,2.363,0v-4.524A1.182,1.182,0,0,0,95.229,116.309Z" transform="translate(-52.591 -97.983)" />
                                            </g>
                                        </svg>
                                        {!toggle && <div onClick={showPasswordHandler}>
                                            <svg className="eyeopen position-absolute r-2 t-1" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 31.937 21.446">
                                                <g id="Group_56" data-name="Group 56" transform="translate(0 0)" opacity="0.65">
                                                    <g id="password" transform="translate(0 0)">
                                                        <path id="Path_93" data-name="Path 93" d="M878.2-407.131c.228-.29.464-.574.682-.872,2.62-3.56,5.766-6.5,9.985-8.034,5.525-2.011,10.626-.952,15.309,2.451a22.867,22.867,0,0,1,5.8,6.2.882.882,0,0,1,.111.754c-2.479,4.291-5.658,7.9-10.324,9.863-5.088,2.145-9.828,1.223-14.213-1.972a28.547,28.547,0,0,1-6.984-7.546,4.836,4.836,0,0,0-.37-.444Zm22.676.8a6.669,6.669,0,0,0-6.6-6.652,6.684,6.684,0,0,0-6.712,6.622,6.686,6.686,0,0,0,6.648,6.685,6.666,6.666,0,0,0,6.669-6.661Z" transform="translate(-878.19 417.051)" fill="#686868" />
                                                        <path id="Path_94" data-name="Path 94" d="M971.814-358.949a3.951,3.951,0,0,1-3.954-4.059,3.949,3.949,0,0,1,4.059-3.953,3.948,3.948,0,0,1,3.953,4.057A3.948,3.948,0,0,1,971.814-358.949Z" transform="translate(-955.837 373.676)" fill="#686868" />
                                                    </g>
                                                </g>
                                            </svg>
                                        </div>}

                                        {toggle && <div onClick={showPasswordHandler}>
                                            <svg className="eyeclose position-absolute r-2 t-1" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 31.937 25.414">
                                                <g id="Group_56" data-name="Group 56" transform="translate(0 0.707)" opacity="0.59">
                                                    <g id="password" transform="translate(0 0)">
                                                        <path id="Path_93" data-name="Path 93" d="M878.2-407.131c.228-.29.464-.574.682-.872,2.62-3.56,5.766-6.5,9.985-8.034,5.525-2.011,10.626-.952,15.309,2.451a22.867,22.867,0,0,1,5.8,6.2.882.882,0,0,1,.111.754c-2.479,4.291-5.658,7.9-10.324,9.863-5.088,2.145-9.828,1.223-14.213-1.972a28.547,28.547,0,0,1-6.984-7.546,4.836,4.836,0,0,0-.37-.444Zm22.676.8a6.669,6.669,0,0,0-6.6-6.652,6.684,6.684,0,0,0-6.712,6.622,6.686,6.686,0,0,0,6.648,6.685,6.666,6.666,0,0,0,6.669-6.661Z" transform="translate(-878.19 417.051)" fill="#686868" />
                                                        <path id="Path_94" data-name="Path 94" d="M971.814-358.949a3.951,3.951,0,0,1-3.954-4.059,3.949,3.949,0,0,1,4.059-3.953,3.948,3.948,0,0,1,3.953,4.057A3.948,3.948,0,0,1,971.814-358.949Z" transform="translate(-955.837 373.676)" fill="#686868" />
                                                    </g>
                                                    <line id="Line_7" data-name="Line 7" y1="24" x2="24" transform="translate(4.242)" fill="none" stroke="#707070" strokeWidth="2" />
                                                </g>
                                            </svg>
                                        </div>}
                                    </div>
                                    <div className="text-danger mt-1"> {paswordval}</div>
                                </div>
                                <button className="ui button w-100 fw-100" onClick={e => ValidateSignin(e)}>Create an account</button>
                            </form>
                            <div className="signup-div text-center">
                                <p>Already have an Account?  <Link to={'/login'}>Sign in</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

