import React from "react"
import UpdatePasswordForm from "../../../components/updatepasswordform/UpdatePasswordForm";

export default function Updatepassword() {
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
                <span className="veritical-align-text-top ml-1">Update password</span></h6>
            </div>
          </div>
          <div className="py-4 px-3">
              <UpdatePasswordForm placeholdertext="Old Password" />
              <UpdatePasswordForm placeholdertext="New Password" />
              <UpdatePasswordForm placeholdertext="Confirm Password" />
              <div className="mt-2 text-left">
                  <button className="ui button text-dark fs-7 fw-400 px-5 mx-1 mb-sm-1 px-sm-3">Cancel</button>
                  <button className="ui button bg-success-dark text-white fs-7 fw-400 px-5 mx-1 mb-sm-1 px-sm-3">Update</button>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
