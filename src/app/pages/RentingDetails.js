import React, { useState } from 'react'
import PreBookingBreadcrumb from '../components/prebooking breadcrumb/PreBookingBreadcrumb'
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import { Dropdown, Modal } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
export default function RentingDetails() {
  const navigate=useNavigate()
  const [applyDiscountModal,SetApplyDiscountModal]=useState({
    open: false,
    dimmer: undefined,
  })
  const navigateAddon=(e)=>{
    e.preventDefault();
    navigate('/preBooking/addOns')

  }
  const invoicePeriodSelectOption = [
    {
      key: 1,
      text: 'Monthly',
      value: 'Monthly'
    },
    {
      key: 2,
      text: 'Semi-Annually',
      value: 'Semi-Annually',
    },
    {
      key: 3,
      text: 'Annually',
      value: 'Annually',
    },
  ]
  const invoiceRecurringSelectOption = [
    {
      key: 1,
      text: 'First of month',
      value: 'First of month'
    },
    {
      key: 2,
      text: 'Anniversary',
      value: 'Anniversary',
    },

  ]
  return (
    <>
      <div>
        <PreBookingBreadcrumb activeStep='1' />
        <div className='ui container responsive'>
          <div className='row'>
            <div className='col-12 col-md-7 pr-1 pr-sm-0 mb-3'>
              <div className='bg-white px-0 py-2 border-radius-15 card-boxshadow'>
                <h6 className='text-dark fw-500 fs-6 px-4 pb-2 px-sm-2 card-border-bottom'><svg
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
                </svg><span className='veritical-align-text-top ml-1'>Renting Details</span></h6>
                <div className="ui form px-4 px-sm-2">
                  <div className="field w-100 datePicker my-3">
                    <label className='fw-500 fs-7 mb-2' >Move-In Date</label>
                    <SemanticDatepicker placeholder='Select date' className='w-100' />
                  </div>
                  <div className="field w-100  my-3">
                    <label className='fw-500 fs-7 mb-2'>Invoice Period</label>
                    <Dropdown placeholder='Select Invoice Period' clearable fluid search selection options={invoicePeriodSelectOption} />
                  </div>
                  <div className="field w-100  my-3">
                    <label className='fw-500 fs-7 mb-2'>Invoice Recurring</label>
                    <Dropdown placeholder='Select Invoice Recurring' clearable fluid search selection options={invoiceRecurringSelectOption} />
                  </div>
                  <div className="field w-100 datePicker my-3">
                    <label className='fw-500 fs-7 mb-2' >Desired Move Out date</label>
                    <SemanticDatepicker placeholder='Select date' className='w-100' />
                  </div>
                </div>
              </div>
          
            </div>
            <div className='col-12 col-md-5 pl-1 pl-sm-0 mb-3'>
              <div className='bg-white px-0 py-2 border-radius-15 border-top-success-4 card-boxshadow'>
                <h6 className='text-success-dark fw-600 fs-6 px-4 pt-2 mb-1  px-sm-2'>Invoice Details</h6>
                <p className='px-4 mb-2 px-sm-2 fw-400 text-light-gray'>Please see the breakdown below</p>
                <div className='px-4  px-sm-2'>
                  <div className="py-2 card-border-secondary border-radius-10 mb-2">
                    <div className="content">
                    <p className='text-success-dark mb-1 fw-600 fs-6 px-1'>Unit-#123</p>
                      <div className="text-dark fw-500 mb-2 px-1">Billing Period ( 18-06-2021 to 17-06-2022)</div>
                      <div className='mb-2 d-flex px-1 justify-content-between text-light-gray fw-500'>
                        <span>Storage Unit-5'x10'</span><span>$90</span>
                      </div>
                      <div className='mb-2 d-flex px-1 justify-content-between text-light-gray fw-500'>
                        <span>NB HST (15%)</span><span >$14.25</span>
                      </div>
                      <p></p>
                      <div className="field w-100 px-1 mt-3 mb-2">
                        <label className='fs-6 fw-500'>Promo Code</label>
                        <div className='row mt-1'>
                          <div className='col-9 ui input'>
                            <input placeholder='Enter the code' className='border-bottom-only border-radius-0' />
                          </div>
                          <div className='col-3 d-flex align-items-end justify-content-center'>
                            <button className='ui button bg-success-dark fs-8 fw-400 text-white py-1 px-2'>Apply</button>
                          </div>
                        </div>
                      </div>
                      <p className='text-success mb-3 px-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 22 22.938">
                          <g id="offer" transform="translate(-0.012 -0.021)">
                            <path id="Path_16041" data-name="Path 16041" d="M11.235,22.959h-.448A2.634,2.634,0,0,1,9.309,22.1c-.338-.348-.7-.674-1.044-1.014a.752.752,0,0,0-.674-.22c-.568.083-1.138.159-1.706.247A2,2,0,0,1,3.47,19.438q-.17-.844-.3-1.7a.893.893,0,0,0-.521-.725c-.507-.252-1.006-.523-1.5-.793a2,2,0,0,1-.9-2.763c.25-.525.5-1.048.768-1.566a.834.834,0,0,0,0-.811C.754,10.572.5,10.055.256,9.537a2.008,2.008,0,0,1,.915-2.793c.506-.272,1.011-.545,1.523-.805a.832.832,0,0,0,.472-.66q.133-.828.283-1.653A2,2,0,0,1,5.8,1.864c.571.065,1.139.151,1.706.244A.844.844,0,0,0,8.3,1.863c.411-.412.834-.814,1.255-1.216a2,2,0,0,1,2.906,0q.648.619,1.288,1.246a.772.772,0,0,0,.695.224c.568-.084,1.137-.163,1.705-.249a2,2,0,0,1,2.4,1.669c.116.569.212,1.144.3,1.719a.864.864,0,0,0,.495.693c.5.25.99.521,1.483.784a2.013,2.013,0,0,1,.919,2.842c-.241.5-.478.995-.73,1.485a.865.865,0,0,0,0,.852c.261.511.511,1.028.758,1.546a2,2,0,0,1-.9,2.764c-.511.278-1.024.553-1.543.815a.834.834,0,0,0-.476.657c-.089.552-.185,1.1-.283,1.653A2.009,2.009,0,0,1,16.2,21.115c-.57-.07-1.139-.153-1.706-.245a.827.827,0,0,0-.774.242c-.332.334-.684.646-1.011.984a2.631,2.631,0,0,1-1.477.862Zm4.851-15.8a.739.739,0,0,0-.72-.693.759.759,0,0,0-.541.275L6.258,15.307a1.225,1.225,0,0,0-.149.166.658.658,0,0,0,.525,1.038.793.793,0,0,0,.6-.306q3.775-3.778,7.552-7.553c.338-.338.684-.667,1.009-1.017a2.8,2.8,0,0,0,.295-.476ZM13.65,12.6A2.423,2.423,0,1,0,16.079,15,2.42,2.42,0,0,0,13.65,12.6ZM8.372,10.382A2.424,2.424,0,1,0,5.944,7.974a2.424,2.424,0,0,0,2.429,2.408Z" transform="translate(0 0)" fill="#67be5c" />
                            <path id="Path_16042" data-name="Path 16042" d="M224.734,249.857a1.093,1.093,0,0,1-1.106-1.082,1.1,1.1,0,1,1,2.2-.015A1.1,1.1,0,0,1,224.734,249.857Z" transform="translate(-211.069 -233.745)" fill="#67be5c" />
                            <path id="Path_16043" data-name="Path 16043" d="M131.451,123.107a1.1,1.1,0,1,1-2.2.006,1.1,1.1,0,0,1,2.2-.006Z" transform="translate(-121.987 -115.154)" fill="#67be5c" />
                          </g>
                        </svg>
                        <span className='veritical-align-text-bottom ml-1 cursor-pointer' onClick={() => SetApplyDiscountModal({ open: true, dimmer: 'blurring' })}>Use Promocode</span></p>
                      <div className='fw-700 px-1 d-flex justify-content-between'>
                        <span>Total</span><span >$134.25</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className='row'>
          <div className='col-12 text-center my-2'>
                <button onClick={()=>  navigate('/preBooking/units')}  className="ui button  basic border-success-dark-1 fs-7 fw-400 text-dark px-5 mr-2">BACK</button>
                <button className="ui button bg-success-dark   fs-7 fw-400 text-white px-5"onClick={e=>navigateAddon(e)}>NEXT</button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        dimmer={applyDiscountModal.dimmer}
        open={applyDiscountModal.open}
        onClose={() => SetApplyDiscountModal({ open: false })}
      >
        <Modal.Header className='bg-success-dark text-white text-center fs-6 py-2 fw-400 position-relative'>PROMO CODES
     
     <svg onClick={()=>SetApplyDiscountModal({ open: false })} className='r-3 cursor-pointer position-absolute' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 17.473 17.47">
      <path id="wrong-5" d="M978.609-438.353l-2.052-2.043-4.37-4.366a1.33,1.33,0,0,1-.4-1.425,1.3,1.3,0,0,1,.833-.843,1.3,1.3,0,0,1,1.171.183,3.019,3.019,0,0,1,.353.321q3.009,3,6.009,6.01c.088.088.159.193.254.309.127-.118.217-.2.3-.281l6.156-6.156a1.332,1.332,0,0,1,1.325-.431,1.3,1.3,0,0,1,.927.828,1.3,1.3,0,0,1-.188,1.228,3.412,3.412,0,0,1-.325.35q-3,3.009-6.011,6.009a3.233,3.233,0,0,1-.317.244c.132.14.213.23.3.316q3.052,3.053,6.108,6.1a1.36,1.36,0,0,1,.441,1.387,1.305,1.305,0,0,1-2.205.564c-.59-.568-1.163-1.157-1.74-1.736l-4.487-4.491a2.068,2.068,0,0,1-.183-.248l-.142-.051a1.52,1.52,0,0,1-.191.325q-3.047,3.059-6.1,6.111a1.341,1.341,0,0,1-1.45.419,1.3,1.3,0,0,1-.851-.866,1.3,1.3,0,0,1,.235-1.19,3.215,3.215,0,0,1,.257-.274l6.034-6.033C978.386-438.167,978.484-438.245,978.609-438.353Z" transform="translate(-971.716 447.116)" fill="#fff"/>
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
