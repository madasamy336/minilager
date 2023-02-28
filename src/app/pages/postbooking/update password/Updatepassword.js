import UpdatePasswordForm from "../../../components/updatepasswordform/UpdatePasswordForm";
import { Button, Message, Icon, Transition } from 'semantic-ui-react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from "react";
import instance from '../../../services/instance';
import requests from '../../../services/request';
import Helper from "../../../helper";
import { useTranslation } from "react-i18next";


export default function Updatepassword() {
  let helper = new Helper();

  const [password, updatePassword] = useState({
    currentPassword: "",
    newPassword: "",
    conformNewPassword: "",
    currentPasswordErr: false,
    newPasswordErr: false,
    conformNewPasswordErr: false,
  })
  const [loadingButton, setLoadingButton] = useState(false);
  const [isDisabled, setButtonDisabled] = useState(false);

  const { t, i18n } = useTranslation();

  const handleOnChange = (e) => {
    const { name, value } = e.target
    console.log(name, value)
    updatePassword({ ...password, [name]: value });
  }

  const handleOnSubmit = (e) => {
    setLoadingButton(true);
    setButtonDisabled(true)
    e.preventDefault();
    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let userId = localStorage.getItem('userid');

    const [html] = document.getElementsByTagName("html")
    const lang = html.getAttribute("lang");
    let password_details = {
      'currentPassword': password.currentPassword,
      'newPassword': password.newPassword,
      'conformNewPassword': password.conformNewPassword,
      'userId': userId,
      'content-language': lang
    }

    instance
      .post(requests.update_user_password + "/" + userId + "/update", password_details, config)
      .then((response) => {
        console.log("response", response)
        const res = response.data;
        console.log("res", res)
        if (res.isSuccess === true && res.returnCode === "SUCCESS") {
          setLoadingButton(false);
          setButtonDisabled(false)
          toast.success('Password Updated Successfully',{
            position: "top-right",
            autoClose: 5000,
            className:"bg-toast-success toast-success",
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          })
          updatePassword({currentPassword:'',newPassword:'', conformNewPassword:''})

          // updatePassword({ ...password, ['currentPassword']: '' });
          // updatePassword({ ...password, ['newPassword']: '' });
          // updatePassword({ ...password, ['conformNewPassword']: '' });
        } else {
          toast.error(res.returnMessage, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          })
          updatePassword({currentPassword:'',newPassword:'', conformNewPassword:''})
          setButtonDisabled(false)
          setLoadingButton(false);
        }
      })
      .catch((err) => {
        setButtonDisabled(false)
        setLoadingButton(false);
        console.log(err);
      });
  }

  const clearOnSumbit = (e) => {
    setLoadingButton(true);
    setButtonDisabled(true)
    e.preventDefault();
    updatePassword({ ...password, ['currentPassword']: '' });
    updatePassword({ ...password, ['newPassword']: '' });
    updatePassword({ ...password, ['conformNewPassword']: '' });
    setLoadingButton(false);
    setButtonDisabled(false)

  }

  return (
    <div className="mx-2 mx-sm-1">
      <div>
        <div className="bg-white card-boxShadow border-radius-15 py-2 mb-2">
          <div className="row dashed-bottom px-4 py-2 px-sm-2">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <h6 className="fs-6 fw-500"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 18.646 27.078">
                <g id="password-svgrepo-com" transform="translate(-31.62)">
                  <path id="Path_19671" data-name="Path 19671" d="M47.933,9.764h-.441V6.548a6.549,6.549,0,0,0-13.1,0V9.764h-.441A2.336,2.336,0,0,0,31.62,12.1V24.744a2.336,2.336,0,0,0,2.333,2.333h13.98a2.336,2.336,0,0,0,2.333-2.333V12.1A2.336,2.336,0,0,0,47.933,9.764ZM36.394,6.548a4.549,4.549,0,0,1,9.1,0V9.764h-9.1Zm11.872,18.2a.338.338,0,0,1-.333.333H33.953a.338.338,0,0,1-.333-.333V12.1a.338.338,0,0,1,.333-.333h13.98a.338.338,0,0,1,.333.333Z" transform="translate(0)" fill="#328128" />
                  <path id="Path_19672" data-name="Path 19672" d="M95.047,116.309a1,1,0,0,0-1,1v3.828a1,1,0,1,0,2,0v-3.828A1,1,0,0,0,95.047,116.309Z" transform="translate(-54.104 -100.802)" fill="#328128" />
                </g>
              </svg>
                <span className="veritical-align-text-top ml-1">{t("Update password")}</span></h6>
            </div>
          </div>
          <div className="py-4 px-3">
            <UpdatePasswordForm placeholder="Old Password" id="currentPassword" name="currentPassword" value={password.currentPassword} onChange={handleOnChange} />
            {password.currentPasswordErr && <span className="errorMessage">Please Enter the current Password</span>}
            <UpdatePasswordForm placeholder="New Password" id="newPassword" name="newPassword" value={password.newPassword} onChange={handleOnChange} />
            {password.newPasswordErr && <span className="errorMessage">Please Enter the current Password</span>}
            <UpdatePasswordForm placeholder="Confirm Password" id="conformNewPassword" name="conformNewPassword" value={password.conformNewPassword} onChange={handleOnChange} />
            {password.conformNewPasswordErr && <span className="errorMessage">Please Enter the current Password</span>}

            <div className="mt-2 text-left">
              <Button className="ui button text-dark fs-7 fw-400 px-5 mx-1 mb-sm-1 px-sm-3" onClick={clearOnSumbit} disabled={isDisabled || password.currentPassword.length == 0 || password.conformNewPassword.length == 0 || password.newPassword.length == 0}>Cancel</Button>
              <Button className="ui Button bg-success-dark text-white fs-7 fw-400 px-5 mx-1 mb-sm-1 px-sm-3" disabled={isDisabled || loadingButton || password.currentPassword.length == 0 || password.conformNewPassword.length == 0 || password.newPassword.length == 0} onClick={handleOnSubmit} loading={loadingButton}>Update</Button>
            </div>

            <ToastContainer />
            {/* {ErrorMessage.length !== 0 && <Message className="mt-2" compact attached='bottom' warning>
              {ErrorMessage}
            </Message>}
            <Transition.Group animation='fly left' duration='500'> {SuccessMessage.length !== 0 && <Message className="mt-2" compact attached='bottom' success>
              {SuccessMessage}
            </Message>}
            </Transition.Group> */}


          </div>
        </div>
      </div>
    </div>
  )
}
