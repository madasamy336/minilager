import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from 'react-redux';
import instance from '../services/instance';
import request from '../services/request';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = (props) => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    // Username value
    const [username, setUserName] = useState({ userName: '' });
    const { userName } = username;
    // Validation messege
    const [validations, setValidations] = useState({ userName: '' });
    const { userName: nameVal } = validations;

    
    const ValidateSignin = (e) => {
        e.preventDefault();
        if(props.callingfrom === 'prebooking'){
            navigate('/preBooking/sign-in')
        }else{
            navigate('/login');
        }
       
    }
    const handleChange = (e) => {
        e.persist();
        const { name, value } = e.target;
        setUserName({ ...userName, [name]: value });

    }

    const validateOne = (e) => {

        const { name } = e.target
        const value = username[name]
        let message = ''

        if (!value) {
            console.log(name === 'userName');
            if(name === 'userName'){
                message = `${t('Email is required')}`;
            }else{
                message = `${name} is required`
            }
            //message = `${name} is required`
        }
        setValidations({ ...validations, [name]: message })
        console.log(validations);

    }
    const passWordReset = (e) => {

        e.preventDefault();
        const validations = { userName: '' };
        let isValid = true;
        if (!userName) {
            validations.userName = `${t('UserName is required')}`;
            isValid = false;
        }
        if (!isValid) {

            setValidations(validations);
        } else {
            forgotCall()
            //SetPassSuccessMsg({show:true, animation:'fly left',duration:1000});


        }

    }

    //forgot password Api call 
    const forgotCall = () => {
        let config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        instance
            .post(request.forgot_password, username, config)
            .then(response => {
                const configData = response.data
                if ( configData.isSuccess === true && configData.returnCode === "SUCCESS" &&  configData.returnMessage === "SUCCESS") {
                    // to emulate some network delay

                    toast.success(`${t('Password has been sent successfully. Please check your inbox for the password')}`, {
                        position: "top-right",
                        autoClose: 3000,
                        duration:100,
                        className:"bg-toast-success toast-success",
                        hideProgressBar: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        });
                   
                } else {

                    toast.error(`${('Email not exist. Please verify your email')}`, {
                        position: "top-right",
                        autoClose: 3000,
                        duration:100,
                        hideProgressBar: true,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        });

                }
            })
            .catch(error => {
                console.log(error);

            })


    }

    return (
        <div className="forgot-password pt-2 pb-5">
            <div className="ui container">
                <div className="actionMsgContainer" >
                <ToastContainer  />
                </div>
                <div className="row justify-content-center mt-3">
                    <div className="col-12 col-lg-4">
                        <div className='bg-white card-boxshadow px-0 pt-2 pb-4 border-radius-15 border-top-success-4'>
                            <h6 className='text-success-dark text-center fw-500 fs-6 px-4 pt-2 mb-1  px-sm-2'>{t("FORGOT PASSWORD")}</h6>
                            <div className='px-4 px-sm-2'>
                                <div className="forgot-img text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 274 182.092">
                                        <g id="undraw_forgot_password_re_hxwm" transform="translate(0 0)">
                                            <path id="Path_19702" data-name="Path 19702" d="M438.05,427.527c9.39-16.518,27.3-29.2,46.262-27.979a87.543,87.543,0,0,0-23.024,55.519c-.311,7.963.171,16.851-5.115,22.814-3.29,3.71-8.318,5.507-13.262,5.884s-9.887-.516-14.765-1.406l-1.183.363C426.513,463.726,428.66,444.045,438.05,427.527Z" transform="translate(-339.766 -322.732)" fill="#f0f0f0" />
                                            <path id="Path_19703" data-name="Path 19703" d="M484.319,399.066A74.827,74.827,0,0,0,451,430.837a32.223,32.223,0,0,0-3.527,9.46,18.481,18.481,0,0,0,.961,9.679c1.042,2.9,2.442,5.738,2.762,8.837a11.316,11.316,0,0,1-3.029,8.745c-2.647,2.966-6.2,4.8-9.741,6.48-3.929,1.861-8.04,3.732-10.823,7.206-.337.421-.971-.127-.634-.547,4.842-6.044,13.13-7.18,18.877-12.049,2.682-2.272,4.7-5.366,4.568-8.991-.111-3.17-1.553-6.1-2.633-9.025a19.72,19.72,0,0,1-1.293-9.429,29.787,29.787,0,0,1,3.15-9.56A72.591,72.591,0,0,1,462.992,413.3a76.153,76.153,0,0,1,21.056-15.023c.484-.233.752.561.271.792Z" transform="translate(-339.744 -321.853)" fill="#fff" />
                                            <path id="Path_19704" data-name="Path 19704" d="M506.725,459.976a11.226,11.226,0,0,1-3.388-14.136c.245-.48,1-.121.757.359a10.4,10.4,0,0,0,3.178,13.143C507.709,459.659,507.159,460.291,506.725,459.976Z" transform="translate(-393.317 -355.587)" fill="#fff" />
                                            <path id="Path_19705" data-name="Path 19705" d="M498.307,553.343a21.638,21.638,0,0,0,13.7-7.809c.339-.42.972.128.634.547a22.506,22.506,0,0,1-14.272,8.1c-.534.077-.593-.759-.061-.835Z" transform="translate(-390.335 -426.618)" fill="#fff" />
                                            <path id="Path_19706" data-name="Path 19706" d="M573.209,432.436a6.354,6.354,0,0,0,5.68,2.025c.533-.083.591.752.061.835a7.121,7.121,0,0,1-6.288-2.226.433.433,0,0,1-.043-.591A.421.421,0,0,1,573.209,432.436Z" transform="translate(-443.437 -346.133)" fill="#fff" />
                                            <path id="Path_19707" data-name="Path 19707" d="M520.232,554.93c-.332.061-.663.123-1,.191a83.684,83.684,0,0,0-13.084,3.617c-.331.115-.665.237-.992.361a88.225,88.225,0,0,0-27.747,16.886,85.677,85.677,0,0,0-8.987,9.418c-3.8,4.644-7.553,9.982-12.52,13.01a14.7,14.7,0,0,1-1.6.867l-28.614-11.869c-.052-.06-.106-.113-.158-.173l-1.164-.422c.13-.183.268-.371.4-.554.075-.107.156-.211.231-.317.052-.07.1-.14.147-.207.017-.023.035-.047.049-.064.043-.066.09-.123.13-.183q1.158-1.574,2.342-3.138c0-.007,0-.007.012-.01A125.976,125.976,0,0,1,448.134,560.7c.231-.187.464-.381.708-.563a81.755,81.755,0,0,1,11.051-7.475,72.288,72.288,0,0,1,6.555-3.241,60.1,60.1,0,0,1,18.209-4.644c12.51-1.162,25.253,1.691,34.848,9.55C519.75,554.524,519.989,554.723,520.232,554.93Z" transform="translate(-337.959 -426.006)" fill="#f0f0f0" />
                                            <path id="Path_19708" data-name="Path 19708" d="M521,576.211a74.826,74.826,0,0,0-45.73,5.309,32.223,32.223,0,0,0-8.512,5.43,18.481,18.481,0,0,0-5.06,8.307c-.912,2.94-1.5,6.052-3.116,8.719a11.316,11.316,0,0,1-7.683,5.159c-3.9.774-7.844.1-11.679-.691-4.258-.879-8.667-1.86-12.98-.762-.523.133-.7-.686-.177-.818,7.5-1.911,14.807,2.172,22.327,1.745,3.509-.2,6.979-1.457,9.061-4.428,1.82-2.6,2.434-5.807,3.332-8.792a19.72,19.72,0,0,1,4.645-8.307,29.788,29.788,0,0,1,8.271-5.737,72.594,72.594,0,0,1,21.7-6.611,76.152,76.152,0,0,1,25.857.682c.527.105.263.9-.261.8Z" transform="translate(-338.942 -446.951)" fill="#fff" />
                                            <path id="Path_19709" data-name="Path 19709" d="M612.042,558.956a11.226,11.226,0,0,1,5.806-13.327c.485-.235.873.507.388.742a10.4,10.4,0,0,0-5.376,12.408c.158.515-.661.689-.819.177Z" transform="translate(-471.231 -426.761)" fill="#fff" />
                                            <path id="Path_19710" data-name="Path 19710" d="M549.864,642.414a21.638,21.638,0,0,0,15.64,2.013c.523-.131.7.687.177.819a22.506,22.506,0,0,1-16.27-2.128C548.937,642.857,549.393,642.155,549.864,642.414Z" transform="translate(-426.84 -495.66)" fill="#fff" />
                                            <path id="Path_19711" data-name="Path 19711" d="M694.355,575.259a6.355,6.355,0,0,0,3.316,5.036c.476.255.019.957-.454.7a7.121,7.121,0,0,1-3.68-5.563.433.433,0,0,1,.321-.5A.421.421,0,0,1,694.355,575.259Z" transform="translate(-529.589 -447.654)" fill="#fff" />
                                            <path id="Path_19712" data-name="Path 19712" d="M252.148,525.587c-4.007-19.376-9.016-25.836-9.016-25.836l-1.914-1.484-2.3-1.788.011-.23-.546-.185-.128-.1-.21-.161-.034.036-.071.074-10.414-3.54-13.211-4.488-6.117-7.952a10.581,10.581,0,0,0-8.465-4.129l-19.538.145a10.582,10.582,0,0,0-7.118,2.823l-12.842,11.912-20.01,9.557-.034-.034-.21.15-3.092,1.478.128.664-1.914,1.381s-5.009,6.011-9.016,24.04c-1.019,4.587-1.521,14.428-1.7,26.554a4.629,4.629,0,0,0,4.627,4.7H249.228a4.629,4.629,0,0,0,4.627-4.693C253.678,541.285,253.177,530.562,252.148,525.587Z" transform="translate(-124.382 -377.082)" fill="#3f3d56" />
                                            <path id="Path_19713" data-name="Path 19713" d="M576.8,191.732a15.679,15.679,0,0,0,0,31.357H693.639a15.678,15.678,0,1,0,0-31.357Z" transform="translate(-435.317 -174.835)" fill="#e5e5e5" />
                                            <path id="Path_19714" data-name="Path 19714" d="M584.638,202.747a12.506,12.506,0,0,0,0,25.011H701.482a12.506,12.506,0,1,0,0-25.011Z" transform="translate(-443.16 -182.677)" fill="#fff" />
                                            <circle id="ab6171fa-7d69-4734-b81c-8dff60f9761b" cx="25.597" cy="25.597" r="25.597" transform="translate(43.052 40.191)" fill="#9e616a" />
                                            <path id="Path_19715" data-name="Path 19715" d="M339.163,444.182q-.164-.361-.327-.725c.042,0,.083.007.125.008Z" transform="translate(-277.063 -354.051)" fill="#2f2e41" />
                                            <path id="Path_19716" data-name="Path 19716" d="M246.579,246.652a7.125,7.125,0,0,1,4.463-1.93c1.655.053,3.334,1.548,2.991,3.168a26.3,26.3,0,0,1,31.655-11.87c4.114,1.451,8.148,4.355,9.093,8.614a7.758,7.758,0,0,0,.977,3.18,3.63,3.63,0,0,0,3.863.979l.041-.012a1.209,1.209,0,0,1,1.461,1.707l-1.164,2.171a9.328,9.328,0,0,0,4.444-.095,1.208,1.208,0,0,1,1.283,1.88,21.062,21.062,0,0,1-16.794,8.632c-4.651-.028-9.349-1.631-13.876-.562a12.053,12.053,0,0,0-8.107,16.92c-1.391-1.521-4.078-1.161-5.5.33a7.544,7.544,0,0,0-1.647,5.773,26.783,26.783,0,0,0,2.75,8.991,26.877,26.877,0,0,1-15.932-47.877Z" transform="translate(-204.239 -205.297)" fill="#2f2e41" />
                                            <path id="Path_19717" data-name="Path 19717" d="M87.464,495.253l7.179,39.061,4.308.375Z" transform="translate(-62.27 -352.598)" opacity="0.2" />
                                            <path id="Path_19718" data-name="Path 19718" d="M333.615,485.026,326.436,527l-4.308.4Z" transform="translate(-229.34 -345.317)" opacity="0.2" />
                                            <path id="Path_19719" data-name="Path 19719" d="M256.966,161.278a2.552,2.552,0,0,1-3.415-1.5,2.591,2.591,0,0,1,1.358-3.535,2.722,2.722,0,0,1,2.057,5.033Zm-2.637-7.916-1.095.457a1.181,1.181,0,0,1-1.5-.55l-.054-.106a9.574,9.574,0,0,1-.4-7.668c.847-2.658,1.2-4.527.491-6.221-.818-1.958-2.563-2.571-4.79-1.683a4.069,4.069,0,0,0-1.818,1.029,1.56,1.56,0,0,1-1.129.459,1.508,1.508,0,0,1-1.079-.473,1.54,1.54,0,0,1-.011-2.1,11.965,11.965,0,0,1,4.046-2.778c4.783-2,7.191.951,8.293,3.59,1.078,2.581.472,4.976-.5,8.078-.816,2.577-.769,4.487.159,6.386a1.175,1.175,0,0,1-.612,1.582Z" transform="translate(-208.503 -133.069)" fill="#328128" />
                                            <path id="Path_19720" data-name="Path 19720" d="M646.305,269.354H623.058a.56.56,0,0,1,0-1.12h23.247a.56.56,0,1,1,0,1.12Z" transform="translate(-479.018 -229.301)" fill="#328128" />
                                            <path id="Path_19721" data-name="Path 19721" d="M748.686,270H725.439a.56.56,0,1,1,0-1.12h23.247a.56.56,0,0,1,0,1.12Z" transform="translate(-551.908 -229.762)" fill="#328128" />
                                            <path id="Path_19722" data-name="Path 19722" d="M851.068,270.65H827.821a.56.56,0,0,1,0-1.12h23.247a.56.56,0,0,1,0,1.12Z" transform="translate(-624.799 -230.223)" fill="#328128" />
                                            <path id="Path_19723" data-name="Path 19723" d="M953.446,271.3H930.2a.56.56,0,0,1,0-1.12h23.247a.56.56,0,0,1,0,1.12Z" transform="translate(-697.688 -230.685)" fill="#328128" />
                                            <circle id="Ellipse_248" data-name="Ellipse 248" cx="4.321" cy="4.321" r="4.321" transform="translate(151.292 26.259)" fill="#328128" />
                                            <circle id="Ellipse_249" data-name="Ellipse 249" cx="4.321" cy="4.321" r="4.321" transform="translate(180.961 26.259)" fill="#328128" />
                                            <circle id="Ellipse_250" data-name="Ellipse 250" cx="4.321" cy="4.321" r="4.321" transform="translate(210.629 26.259)" fill="#328128" />
                                            <circle id="Ellipse_251" data-name="Ellipse 251" cx="4.321" cy="4.321" r="4.321" transform="translate(240.298 26.259)" fill="#328128" />
                                        </g>
                                    </svg>
                                </div>
                                <div className="form-control mb-2">
                                    <label className="d-block mb-1">{t("Email")} <span className="requiredfield">*</span></label>
                                    <div className="ui input w-100 position-relative">
                                        <input type="text" className="pl-5" placeholder={t("Enter Email")} name="userName" value={userName} onChange={(e) => { handleChange(e) }} onBlur={validateOne} />
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
                                <div className="text-center mb-2 mt-4">
                                    <button onClick={e => passWordReset(e)} className="ui button bg-success-dark text-white fw-100 py-1">{t("Submit")}</button>
                                </div>
                                <div className="signup-div text-center">
                                    <p className="fs-8">{t("Already have an Account?")} <a href="/" onClick={e => ValidateSignin(e)}>{t("Sign in")}</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ForgotPassword;