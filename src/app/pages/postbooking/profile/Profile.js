import React, {useState} from "react"
import { Dropdown, Input } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import countriecodes from '../../../components/CountryCode';

export default function Profile() {
  const [profileImageSrc,setprofileImageSrc]=useState({
    img:'/assets/images/post-tenant-img.png'
  })
  const[contactPhone,SetContactPhone]=useState();
  const[tenantDetails, setTenantDetails] = useState(true);
  const[tenantaddress, setTenantAddress] = useState(true);
  const EditTenantDetailsHandler = () => {
    setTenantDetails(false);
  }
  const EditTenantAddressHandler = () => {
    setTenantAddress(false);
  }


  const profileImageUpload=(e)=>{
    debugger;
    e.preventDefault();
    let img=e.target.files[0];
    if (!img.name.match(/\.(jpg|jpeg|png|svg)$/)) {
    alert('Please check the your file format,only jpg,jpeg,png,svg formats are supported')
      return false;
    }
    if(img.size>	1000000 ){
      alert('Please make sure the file size is less than 1mb and try again')
      return false;
    }
    console.log({img:URL.createObjectURL(img)})
  if(e.target.files && e.target.files[0]){
  setprofileImageSrc({img:URL.createObjectURL(img)}); 
  }
   }
   const savetenantDetails=(e)=>{
    e.preventDefault();
    setTenantDetails(true)
   }

  return (
    <>
      <div className="mx-2 mx-sm-1">
        <div className="bg-white card-boxShadow border-radius-15 py-2 mb-2">
          <div className="row dashed-bottom px-3 py-2 px-sm-2">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <h6 className="fs-6 fw-500"><svg id="Tenant_Details" data-name="Tenant Details" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 29.311 29.248">
                <path id="Path_15970" data-name="Path 15970" d="M37.378,38h.458a8.651,8.651,0,0,1,.777.463q3.061,2.275,6.111,4.563c.057.043.121.076.229.145V40.252a.725.725,0,0,1,.825-.823h2.488c.712,0,.935.224.935.941,0,1.893.005,3.787-.006,5.68a.577.577,0,0,0,.278.534c.483.34.936.722,1.425,1.052a2.841,2.841,0,0,1,1.365,1.844v.514c-.021.072-.043.144-.063.217a2.149,2.149,0,0,1-1.735,1.694,6.217,6.217,0,0,1-1.263-.014V64.922c0,.153,0,.305-.011.458a1.964,1.964,0,0,1-1.978,1.864q-9.6.008-19.2-.006a2.037,2.037,0,0,1-.857-.2,1.967,1.967,0,0,1-1.14-1.945q.007-6.454,0-12.91v-.373l-.245.067a2.128,2.128,0,0,1-2.431-.94A5.913,5.913,0,0,1,22.95,50v-.514a2.956,2.956,0,0,1,1.34-1.827q6.079-4.516,12.128-9.058C36.72,38.375,37.057,38.2,37.378,38Zm.2,28.334h9.444a1.1,1.1,0,0,0,1.26-1.261q0-6.812,0-13.624a.472.472,0,0,0-.208-.428Q43,47.215,37.933,43.39a.46.46,0,0,0-.653,0q-5.064,3.824-10.144,7.632a.471.471,0,0,0-.208.427q.007,6.813,0,13.624a1.1,1.1,0,0,0,1.26,1.261ZM50,51.108l.034-.069a1.29,1.29,0,0,0,1.258-.972,1.242,1.242,0,0,0-.546-1.39Q44.369,43.905,38,39.137c-.386-.288-.386-.288-.757-.01L30.1,44.469q-2.819,2.106-5.635,4.215A1.236,1.236,0,0,0,23.9,49.94a1.272,1.272,0,0,0,2.077.816q3.147-2.356,6.286-4.722l4.5-3.385a1.227,1.227,0,0,1,1.691,0c.161.12.321.24.48.361q5.13,3.857,10.262,7.708A4.824,4.824,0,0,0,50,51.108Zm-4.13-10.755v.337c0,.847.031,1.7-.012,2.541a1.043,1.043,0,0,0,.521,1.051c.642.421,1.239.908,1.889,1.394V40.353Z" transform="translate(-22.95 -38)" fill="#328128" />
                <path id="Path_15971" data-name="Path 15971" d="M197.321,309.9h-.2l-.025-.005a1.6,1.6,0,0,1-.739-.229,1.672,1.672,0,0,1-.8-1.162c-.011-.063-.018-.128-.026-.192v-.2a.259.259,0,0,1,.006-.035c.011-.076.017-.147.032-.219a1.691,1.691,0,1,1,2.924,1.468,1.661,1.661,0,0,1-.978.55Zm-.363-1.413-.185-.17c-.094-.085-.185-.173-.282-.254a.162.162,0,0,0-.258.087.176.176,0,0,0,.061.181l.547.5a.169.169,0,0,0,.259-.007l1.051-1.043a.331.331,0,0,0,.027-.029.169.169,0,0,0-.021-.237.151.151,0,0,0-.025-.018.172.172,0,0,0-.218.04l-.928.928-.027.026Z" transform="translate(-182.359 -286.029)" fill="#328128" />
                <path id="Path_15972" data-name="Path 15972" d="M141.978,199.827c.044.022.082.043.122.06a6.319,6.319,0,0,1,3.84,5.037,11.357,11.357,0,0,1,.063,1.565.608.608,0,0,1-.545.588,1.289,1.289,0,0,1-.2.011H133.886a.656.656,0,0,1-.736-.572,6.966,6.966,0,0,1,.5-3.217,6.415,6.415,0,0,1,3.406-3.416c.032-.014.065-.026.1-.041.008,0,.013-.015.026-.031a3.819,3.819,0,0,1-1.45-3.253,3.74,3.74,0,0,1,1.258-2.638,3.87,3.87,0,1,1,4.994,5.907Zm2.758,5.968a5.022,5.022,0,0,0-2.566-4.426,4.916,4.916,0,0,0-5.665.312,4.971,4.971,0,0,0-2.085,4.112Zm-2.593-9.012a2.568,2.568,0,1,0-.748,1.829A2.571,2.571,0,0,0,142.143,196.783Z" transform="translate(-124.726 -181.096)" fill="#328128" />
              </svg>
                <span className="veritical-align-text-top ml-1">Tenant Details</span></h6>
            </div>
            {tenantDetails && <div className="col-lg-6 col-md-6 col-sm-6 text-right cursor-pointer" onClick={EditTenantDetailsHandler}>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 28.419 28.276">
                <g id="edit_copy" data-name="edit copy" opacity="0.55">
                  <path id="Path" d="M26.23,14.991a.708.708,0,0,0-.708.708v6.284A2.125,2.125,0,0,1,23.4,24.106H3.539a2.125,2.125,0,0,1-2.123-2.123V3.539A2.126,2.126,0,0,1,3.539,1.416H9.823A.708.708,0,1,0,9.823,0H3.539A3.543,3.543,0,0,0,0,3.539V21.983a3.543,3.543,0,0,0,3.539,3.539H23.4a3.543,3.543,0,0,0,3.539-3.539V15.7A.708.708,0,0,0,26.23,14.991Z" transform="translate(0 2.754)" fill="#393939" />
                  <path id="Shape" d="M.207,20.557a.71.71,0,0,1-.182-.69l1.66-5.995a.708.708,0,0,1,.182-.312L14.5.933a3.184,3.184,0,0,1,4.5,0l.83.831a3.188,3.188,0,0,1,0,4.5L7.2,18.9a.71.71,0,0,1-.311.182L.9,20.738a.709.709,0,0,1-.69-.182Z" transform="translate(7.657)" fill="#393939" />
                </g>
              </svg>
            </div>}
          </div>
          <div className="py-4 px-3">
            {!tenantDetails && <div className="ui form w-100">
              <div className="row reverse-sm">
                <div className="col-lg-6 col-md-6 col-sm-12 px-2">
                  <div className="field my-3">
                    <label className="text-dark fs-7 fw-500">First Name<span className="error">*</span></label>
                    <input type="text" />
                  </div>
                  <div className="field my-3">
                    <label className="text-dark fs-7 fw-500">Last Name</label>
                    <input type="text" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 px-2">
                  <div className="edit-profile-img position-relative">
                    <img src={profileImageSrc.img} className="ui medium circular image object-fit-cover TenantDetailsProfileImage mx-auto" alt="Profile" />
                    <div className="edit-icon position-absolute text-center l-18 r-0 t-1">
                      <label className="cursor-pointer" for='profileImageUpload'>
                        <img width='50' height='50' className="" src="/assets/images/edit-photo.svg" alt="Edit" />
                      </label>  
                      <input id="profileImageUpload" onChange={(e) => profileImageUpload(e)} hidden type='file' />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12 px-2">
                  <div className="field w-100 datePicker my-3">
                    <label className="text-dark fs-7 fw-500">Date of Birth<span className="error">*</span></label>
                    <SemanticDatepicker placeholder='Select date' className='w-100' />
                  </div>
                  <div className="field my-3">
                    <label className="text-dark fs-7 fw-500">Phone Number<span className="error">*</span></label>
                    <Input value={contactPhone} onChange={e => SetContactPhone(e.target.value)} className="noCounterNumber" type="text" placeholder="Enter Mobile Number"
                      label={<Dropdown defaultValue='+91' search options={countriecodes} />}
                      labelPosition='left' />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 px-2">
                  <div className="field my-3">
                    <label className="text-dark fs-7 fw-500">Email<span className="error">*</span></label>
                    <input type="text" />
                  </div>
                  <div className="field my-3">
                    <label className="text-dark fs-7 fw-500">Social Security Number</label>
                    <input type="text" />
                  </div>
                </div>
              </div>
              <div className="mt-2 text-center">
                <button className="ui button text-dark fs-7 fw-400 px-5 mx-1 mb-sm-1" onClick={setTenantDetails}>CANCEL</button>
                <button className="ui button bg-success-dark text-white fs-7 fw-400 px-5 mx-1 mb-sm-1" onClick={(e)=>savetenantDetails(e)}>SAVE</button>
              </div>
            </div>}

            {tenantDetails && <div className="row reverse-sm">
              <div className="col-lg-9 col-md-9 col-sm-12">
                <div className="row">
                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <p className="fs-7 fw-500 text-dark mb-2">Name</p>
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-8">
                    <p className="fs-7 mb-2">Peter John</p>
                  </div>

                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <p className="fs-7 fw-500 text-dark mb-2">Date of Birth</p>
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-8">
                    <p className="fs-7 mb-2">18-08-2022</p>
                  </div>

                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <p className="fs-7 fw-500 text-dark mb-2">Email</p>
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-8">
                    <p className="fs-7 mb-2">peterjohn@yopmail.com</p>
                  </div>

                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <p className="fs-7 fw-500 text-dark mb-2">Phone Number</p>
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-8">
                    <p className="fs-7 mb-2">+47 123456780</p>
                  </div>

                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <p className="fs-7 fw-500 text-dark mb-2">Social Security Number</p>
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-8">
                    <p className="fs-7 mb-2">12346789090</p>
                  </div>

                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <p className="fs-7 fw-500 text-dark">Company Registration Number</p>
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-8">
                    <p className="fs-7">34567890</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-3 col-sm-12 mb-2">
                <div className="post-tenant-img">
                  <img src={profileImageSrc.img} className="ui medium circular object-fit-cover image TenantDetailsProfileImage mx-auto" alt="Profile" />
                </div>
                <p className="text-center mt-1"> <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 12.426 18.378">
                  <g id="owner" transform="translate(0)">
                    <path id="Path_14951" data-name="Path 14951" d="M2013.729-471.76c.242.058.489.1.726.177a3.541,3.541,0,0,1,2.461,3.317,11.133,11.133,0,0,1-.072,1.841,3.523,3.523,0,0,1-3.45,2.9,3.506,3.506,0,0,1-3.484-2.774,5.719,5.719,0,0,1,.153-3.2,3.455,3.455,0,0,1,2.848-2.232.786.786,0,0,0,.1-.031Z" transform="translate(-2007.112 471.76)" fill="#328128" />
                    <path id="Path_14952" data-name="Path 14952" d="M1944.777-216.085c.1-.408.194-.771.284-1.134q.81-3.279,1.619-6.557c.058-.234.171-.294.395-.2,1.076.455,2.157.909,3.232,1.373a1,1,0,0,1,.64,1.032c-.017,2.1-.007,4.2-.007,6.3,0,.06,0,.12,0,.179a.241.241,0,0,1-.263.255c-.167,0-.334,0-.5,0h-11.253c-.347,0-.4-.055-.4-.408v-6.424a1.041,1.041,0,0,1,.747-1.1q1.563-.6,3.129-1.194c.285-.108.374-.061.448.232q.949,3.779,1.9,7.559C1944.746-216.159,1944.752-216.148,1944.777-216.085Z" transform="translate(-1938.52 233.215)" fill="#328128" />
                    <path id="Path_14953" data-name="Path 14953" d="M2077.969-231.344c.167,0,.334-.009.5,0a.622.622,0,0,1,.5.956c-.569.751-.4.909-.334,1.7a4.1,4.1,0,0,0,.069.551,1.054,1.054,0,0,1-.083.643c-.112.277-.21.557-.311.839a.368.368,0,0,1-.371.279.363.363,0,0,1-.371-.276c-.13-.359-.264-.717-.391-1.077a.522.522,0,0,1-.023-.21c.037-.452.074-.905.129-1.356a1.125,1.125,0,0,0-.184-.783c-.055-.085-.115-.167-.168-.254a.647.647,0,0,1,.513-1.011C2077.621-231.355,2077.8-231.344,2077.969-231.344Z" transform="translate(-2071.693 240.273)" fill="#328128" />
                  </g>
                </svg>
                  <span className="text-success-dark ml-1 fw-500">Personal User</span></p>
              </div>
            </div>}
          </div>
        </div>

        <div className="bg-white card-boxShadow border-radius-15 py-2 mb-2">
          <div className="row dashed-bottom px-3 py-2 px-sm-2">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <h6 className="fs-6 fw-500"><svg id="location-svgrepo-com_1_" data-name="location-svgrepo-com (1)" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 21.924 29.667">
                <g id="Group_6994" data-name="Group 6994" transform="translate(0)">
                  <g id="Group_6993" data-name="Group 6993">
                    <path id="Path_19673" data-name="Path 19673" d="M52.065,0A10.975,10.975,0,0,0,41.1,10.962c0,5.852,9.994,17.938,10.419,18.45a.706.706,0,0,0,1.086,0c.426-.512,10.419-12.6,10.419-18.45A10.975,10.975,0,0,0,52.065,0Zm0,27.839c-.886-1.107-2.727-3.464-4.549-6.159-3.271-4.839-5-8.545-5-10.718a9.55,9.55,0,0,1,19.1,0c0,2.173-1.729,5.879-5,10.718C54.792,24.375,52.951,26.733,52.065,27.839Z" transform="translate(-41.103)" fill="#328128" />
                    <path id="Path_19674" data-name="Path 19674" d="M154.3,212.791a.706.706,0,0,0-.981.19c-.953,1.411-2.021,2.89-3.174,4.4a.706.706,0,1,0,1.122.859c1.17-1.528,2.254-3.029,3.223-4.463A.706.706,0,0,0,154.3,212.791Z" transform="translate(-139.744 -192.641)" fill="#328128" />
                    <path id="Path_19675" data-name="Path 19675" d="M101.792,57.5a5.792,5.792,0,1,0,5.792,5.792A5.8,5.8,0,0,0,101.792,57.5Zm0,10.171a4.379,4.379,0,1,1,4.379-4.379A4.384,4.384,0,0,1,101.792,67.671Z" transform="translate(-90.83 -52.085)" fill="#328128" />
                  </g>
                </g>
              </svg>
                <span className="veritical-align-text-top ml-1">Address</span></h6>
            </div>
            {tenantaddress && <div className="col-lg-6 col-md-6 col-sm-6 text-right cursor-pointer" onClick={EditTenantAddressHandler}>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 28.419 28.276">
                <g id="edit_copy" data-name="edit copy" opacity="0.55">
                  <path id="Path" d="M26.23,14.991a.708.708,0,0,0-.708.708v6.284A2.125,2.125,0,0,1,23.4,24.106H3.539a2.125,2.125,0,0,1-2.123-2.123V3.539A2.126,2.126,0,0,1,3.539,1.416H9.823A.708.708,0,1,0,9.823,0H3.539A3.543,3.543,0,0,0,0,3.539V21.983a3.543,3.543,0,0,0,3.539,3.539H23.4a3.543,3.543,0,0,0,3.539-3.539V15.7A.708.708,0,0,0,26.23,14.991Z" transform="translate(0 2.754)" fill="#393939" />
                  <path id="Shape" d="M.207,20.557a.71.71,0,0,1-.182-.69l1.66-5.995a.708.708,0,0,1,.182-.312L14.5.933a3.184,3.184,0,0,1,4.5,0l.83.831a3.188,3.188,0,0,1,0,4.5L7.2,18.9a.71.71,0,0,1-.311.182L.9,20.738a.709.709,0,0,1-.69-.182Z" transform="translate(7.657)" fill="#393939" />
                </g>
              </svg>
            </div>}
          </div>
          <div className="py-4 px-3">
            {!tenantaddress && <div className="ui form w-100">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12 px-2">
                  <div className="field my-2">
                    <label className="text-dark fs-7 fw-500">Address Line 1<span className="error">*</span></label>
                    <input type="text" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 px-2">
                  <div className="field my-2">
                    <label className="text-dark fs-7 fw-500">Address Line 2<span className="error">*</span></label>
                    <input type="text" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 px-2">
                  <div className="field my-2">
                    <label className="text-dark fs-7 fw-500">City<span className="error">*</span></label>
                    <input type="text" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 px-2">
                  <div className="field my-2">
                    <label className="text-dark fs-7 fw-500">State/Province<span className="error">*</span></label>
                    <input type="text" />
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 px-2">
                  <div className="field my-2">
                    <label className="text-dark fs-7 fw-500">Zip/Postal Code<span className="error">*</span></label>
                    <input type="text" />
                  </div>
                </div>
              </div>
              <div className="mt-2 text-center">
                <button className="ui button text-dark fs-7 fw-400 px-5 mx-1 mb-sm-1" onClick={setTenantAddress}>CANCEL</button>
                <button className="ui button bg-success-dark text-white fs-7 fw-400 px-5 mx-1 mb-sm-1 ">SAVE</button>
              </div>
            </div>}

            {tenantaddress && <div className="row reverse-sm">
              <div className="col-lg-9 col-md-9 col-sm-12">
                <div className="row">
                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <p className="fs-7 fw-500 text-dark mb-2">Address Line 1</p>
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-8">
                    <p className="fs-7 mb-2">Address Line 1</p>
                  </div>

                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <p className="fs-7 fw-500 text-dark mb-2">Address Line 2</p>
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-8">
                    <p className="fs-7 mb-2">Dummy Addresss</p>
                  </div>

                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <p className="fs-7 fw-500 text-dark mb-2">City</p>
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-8">
                    <p className="fs-7 mb-2">Dummy</p>
                  </div>

                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <p className="fs-7 fw-500 text-dark mb-2">State/Province</p>
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-8">
                    <p className="fs-7 mb-2">Dummy</p>
                  </div>

                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <p className="fs-7 fw-500 text-dark">Zip/Postal Code</p>
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-8">
                    <p className="fs-7">1234678</p>
                  </div>
                </div>
              </div>
            </div>}
          </div>
        </div>

        <div className="bg-white card-boxShadow border-radius-15 py-2 mb-2">
          <div className="row dashed-bottom px-3 py-2 px-sm-2">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h6 className="fs-6 fw-500"><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 26.873 27.793">
                <g id="ec" transform="translate(-0.008 -0.005)">
                  <path id="Path_19732" data-name="Path 19732" d="M7.077,110.133a7.082,7.082,0,0,1-.794-.16,11.345,11.345,0,0,1-1.24-.462.561.561,0,0,0-.519-.026A3.322,3.322,0,0,1,.1,107.955c-.165-.3-.117-.569.128-.709a.471.471,0,0,1,.674.25,2.363,2.363,0,0,0,1.9,1.356,8.537,8.537,0,0,0,1.2-.072c-.106-.141-.151-.2-.2-.262a2.789,2.789,0,0,1-.643-2.275,1.724,1.724,0,0,1,1.73-1.427A1.68,1.68,0,0,1,6.483,106.3a2.652,2.652,0,0,1-.595,2.178c-.073.091-.152.178-.228.268,1.29,1.042,4.526.3,5.509-1.282l-.244-.149a16.553,16.553,0,0,1-7.343-8.555,9.158,9.158,0,0,1-.361-5.7,7.79,7.79,0,0,1,2.205-3.644,2.206,2.206,0,0,1,2.7-.308,9.028,9.028,0,0,1,3.329,3.348,2.169,2.169,0,0,1-.582,2.86,2.491,2.491,0,0,0-.9,2.928,5.477,5.477,0,0,0,3.97,3.768,2.4,2.4,0,0,0,2.626-.929,2.182,2.182,0,0,1,3.013-.552,9.106,9.106,0,0,1,3.217,3.238,2.217,2.217,0,0,1-.334,2.767,8,8,0,0,1-7.343,2.326c-.16-.025-.321-.053-.479-.091a.464.464,0,1,1,.178-.91c.439.059.875.148,1.316.179a6.97,6.97,0,0,0,4.594-1.236c.052-.036.1-.079.2-.161-.44-.566-.856-1.145-1.319-1.683-.383-.444-.818-.844-1.24-1.253-.3-.289-.355-.544-.144-.768s.471-.181.762.075a14.717,14.717,0,0,1,2.494,2.852c.039.059.083.115.124.173a1.288,1.288,0,0,0,.427-1.743A8.094,8.094,0,0,0,19,101.261a1.243,1.243,0,0,0-1.614.285,3.393,3.393,0,0,1-4.045,1.259,6.4,6.4,0,0,1-4.315-4.539,3.261,3.261,0,0,1,.441-2.779c.092-.138.049-.222-.025-.334a13.727,13.727,0,0,0-2.648-3c-.09-.076-.183-.149-.266-.231a.456.456,0,0,1-.056-.635.447.447,0,0,1,.653-.059,15.379,15.379,0,0,1,1.354,1.251c.562.623,1.065,1.3,1.592,1.953.049.062.1.126.141.187a1.186,1.186,0,0,0,.5-1.6,7.714,7.714,0,0,0-3.2-3.193,1.165,1.165,0,0,0-1.408.228,6.821,6.821,0,0,0-2.221,4.713,10.144,10.144,0,0,0,1.49,5.69,16.05,16.05,0,0,0,6.565,6.34c.471.249.531.472.231.906a5.376,5.376,0,0,1-3.9,2.379.91.91,0,0,0-.152.046H7.077Zm-2.214-1.858a8.437,8.437,0,0,0,.583-.849,1.423,1.423,0,0,0,.052-1.211.69.69,0,0,0-1.219-.191,1.286,1.286,0,0,0-.219.753,2.077,2.077,0,0,0,.8,1.5Z" transform="translate(0 -82.337)" fill="#328128" />
                  <path id="Path_19733" data-name="Path 19733" d="M187.889,7.224a7.585,7.585,0,0,1-1.818,5.049,8.478,8.478,0,0,1-4.185,2.486c-.46.131-.931.22-1.4.319a.514.514,0,0,1-.6-.184c-.194-.3-.013-.639.374-.721.433-.091.87-.168,1.3-.287a7.591,7.591,0,0,0,3.918-2.346,6.6,6.6,0,0,0,1.465-4.6,6.2,6.2,0,1,0-12.342.951,6.033,6.033,0,0,0,2.2,4.01c.343.287.394.405.229.818-.144.36-.318.707-.493,1.054-.147.292-.1.424.207.527a.459.459,0,0,1,.361.572.464.464,0,0,1-.573.326,1.21,1.21,0,0,1-.873-1.748c.115-.226.231-.45.358-.669.1-.17.059-.279-.086-.411A6.97,6.97,0,0,1,173.766,8.6a7.129,7.129,0,1,1,14.011-2.619c.07.408.076.827.112,1.241Z" transform="translate(-161.008 0)" fill="#328128" />
                  <path id="Path_19734" data-name="Path 19734" d="M222.274,58.8c-.67,0-1.329.072-1.81-.5a1.853,1.853,0,0,1-.329-1.332,1.394,1.394,0,0,1,.678-1.222c.443-.285.946-.162,1.459-.209,0-.223,0-.436,0-.65a1.4,1.4,0,0,1,1.48-1.48,3.208,3.208,0,0,1,.728.049,1.361,1.361,0,0,1,1.034,1.3c.007.252,0,.5,0,.791.252,0,.485,0,.716,0a1.375,1.375,0,0,1,1.425,1.335,4.354,4.354,0,0,1,0,.515,1.391,1.391,0,0,1-1.405,1.392c-.234.009-.468,0-.738,0,0,.244,0,.467,0,.69a1.382,1.382,0,0,1-1.452,1.446,3.649,3.649,0,0,1-.649-.023,1.393,1.393,0,0,1-1.142-1.388c-.007-.226,0-.451,0-.722Zm2.318.155h0c0-.181,0-.362,0-.543.006-.367.165-.532.528-.538s.724.005,1.086,0a.474.474,0,0,0,.527-.52c.005-.108,0-.217,0-.326-.012-.382-.172-.541-.552-.545-.335,0-.67,0-1,0-.425,0-.582-.163-.585-.6,0-.326,0-.651,0-.977,0-.4-.159-.557-.556-.567-.1,0-.2,0-.3,0-.363.012-.527.17-.535.537s0,.706,0,1.058c-.007.38-.17.54-.552.544-.362,0-.724,0-1.086,0a.46.46,0,0,0-.5.487c0,.108,0,.217,0,.326,0,.411.162.572.578.577.326.005.651,0,.977,0,.435,0,.578.149.583.592,0,.235,0,.471,0,.706,0,.767.094.859.86.839.027,0,.054,0,.081,0a.458.458,0,0,0,.448-.456c.01-.2,0-.4,0-.6Z" transform="translate(-204.159 -49.531)" fill="#328128" />
                </g>
              </svg>
                <span className="veritical-align-text-top ml-1">Emergency Contact</span></h6>
            </div>
          </div>
          <div className="py-4 px-3">
            <div className="row reverse-sm">
              <div className="col-lg-9 col-md-9 col-sm-12">
                <div className="row">
                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <p className="fs-7 fw-500 text-dark mb-2">Name</p>
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-8">
                    <p className="fs-7 mb-2">Peter John</p>
                  </div>

                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <p className="fs-7 fw-500 text-dark mb-2">Email</p>
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-8">
                    <p className="fs-7 mb-2">peterjohn@yopmail.com</p>
                  </div>

                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <p className="fs-7 fw-500 text-dark">Phone Number</p>
                  </div>
                  <div className="col-lg-8 col-md-8 col-sm-8">
                    <p className="fs-7">+47 123456780</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
