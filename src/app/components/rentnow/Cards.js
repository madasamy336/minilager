import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { GetFacilityId } from '../../redux/actions/facility/faciltyAction'
import { fetchAppConfig } from '../../redux/actions/appConfig/appConfigAction';
const Card = (props) => {
    let facilityDetailResponse = props;
    const clientDataconfig = JSON.parse(sessionStorage.getItem("configdata"));
    // const recurringDefaultValue = clientDataconfig.recurringTypes[0].recurringTypeId;
    // sessionStorage.setItem("recurringData", (recurringDefaultValue));
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchAppConfig())
    }, [])

    const { t } = useTranslation();
    // facilityDetailResponse.facilitydetails.map(response => {
    //     console.log(response)
    // })
    const navigate = useNavigate()
    const navigateUnits = (e, id, address) => {
        dispatch(GetFacilityId(id));
        sessionStorage.setItem('facilityaddress', JSON.stringify(address))
        e.preventDefault();
        navigate('/preBooking/units')
    }
    return (
        <>
            {typeof facilityDetailResponse.facilitydetails !== 'undefined' && facilityDetailResponse.facilitydetails !== null ? (
                facilityDetailResponse.facilitydetails.length > 0 ?
                    <div className='rentNow-container'>
                        {facilityDetailResponse.facilitydetails.map(details => {
                            let facilityaddress = details.address;
                            return <div key={""} className='rentNow-card bg-white'>
                                <div className='row'>
                                    {/* <div className='col-lg-3 col-md-3 col-sm-12'>
                                    <div className='rentNow-card-img h-100'>
                                        <img className='w-100 h-100' src="./assets/images/Minilager-Container.png" alt='' />
                                    </div>
                                </div> */}
                                    <div className='col-lg-10 col-md-10 col-sm-12'>
                                        <div className='rentNow-card-desc text-left'>
                                            <h2 className='text-success fw-500'><svg xmlns="http://www.w3.org/2000/svg" width="18.046" height="18" viewBox="0 0 18.046 25">
                                                <path id="Location_" data-name="Location " d="M-233.385-419.062a9.008,9.008,0,0,1,2.622-6.383A8.76,8.76,0,0,1-225.687-428a8.763,8.763,0,0,1,6.278,1.39,8.733,8.733,0,0,1,3.78,5.328,8.752,8.752,0,0,1-1.158,7.068q-3.359,5.27-6.754,10.525c-.045.068-.086.137-.137.205a.816.816,0,0,1-1.38,0c-.251-.357-.479-.733-.711-1.1q-3.11-4.852-6.217-9.705A8.632,8.632,0,0,1-233.385-419.062Zm13.12-.031a4.113,4.113,0,0,0-4.108-4.1,4.113,4.113,0,0,0-4.093,4.086,4.114,4.114,0,0,0,4.094,4.112,4.114,4.114,0,0,0,4.107-4.1Z" transform="translate(233.386 428.108)" fill="#67be5c" />
                                            </svg>
                                                {details.locationName}
                                            </h2>
                                            <p className='text-dark'>{details.address.addressLine1}</p>
                                            <p className='text-dark'>{details.address.addressLine2}</p>
                                            {console.log(details.address.city)}
                                            <p className='text-dark'>
                                                {details.address.city}
                                                {details.address.city && details.address.state ? ', ' : ''}
                                                {details.address.state}
                                                {(details.address.city || details.address.state) && details.address.country ? ', ' : ''}
                                                {details.address.country}
                                                {(details.address.city || details.address.state || details.address.country) && details.address.zipCode ? ', ' : ''}
                                                {details.address.zipCode}
                                            </p>                                        <div className='d-flex flex-wrap unit-amenities-col d-none'>
                                                <div className='d-flex align-items-end unit-amenity'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 21">
                                                        <g id="Group_715" data-name="Group 715" transform="translate(-2.011 2.928)">
                                                            <path id="Path_145" data-name="Path 145" d="M667.517,894.882a6.405,6.405,0,0,1-1.079-.46,2.389,2.389,0,0,1-1.063-2h-4.8a.638.638,0,0,1-.732-.741,5.954,5.954,0,0,1,.622-2.873,7.019,7.019,0,0,1,.788-1.145,4.509,4.509,0,0,0,1.046-3.01c.005-.889,0-1.777,0-2.666a5.532,5.532,0,0,1,3.792-5.36c.031-.011.061-.027.1-.047a1.847,1.847,0,1,1,3.282,0c.074.029.146.059.219.086a5.543,5.543,0,0,1,3.675,5.177c.007.937-.006,1.873.007,2.809a4.353,4.353,0,0,0,.373,1.936,5.645,5.645,0,0,0,.733,1.129,5.9,5.9,0,0,1,1.349,4.067.619.619,0,0,1-.672.639h-4.845a5.044,5.044,0,0,1-.081.528,2.437,2.437,0,0,1-1.961,1.893.956.956,0,0,0-.11.04Zm7.108-3.7c-.082-.412-.141-.808-.241-1.194a4.652,4.652,0,0,0-1.024-1.709,5.084,5.084,0,0,1-1.165-3.069c-.045-1.078-.026-2.159-.047-3.238a5.891,5.891,0,0,0-.081-.916,4.3,4.3,0,0,0-8.53.9c0,.916.008,1.832-.006,2.747a5.617,5.617,0,0,1-1.28,3.677,6.876,6.876,0,0,0-.651.917,3.926,3.926,0,0,0-.5,1.88Zm-5.558,1.254h-2.444a1.222,1.222,0,1,0,2.444,0Zm-1.23-17.324a.615.615,0,1,0,.623.6A.623.623,0,0,0,667.837,875.109Z" transform="translate(-657.836 -876.81)" fill="#67be5c" />
                                                            <path id="Path_146" data-name="Path 146" d="M659.845,898.708a7.959,7.959,0,0,1,3.958-6.661.612.612,0,0,1,.874.2.626.626,0,0,1-.27.873,6.82,6.82,0,0,0-3.337,5.831.614.614,0,0,1-1.222.088A2.514,2.514,0,0,1,659.845,898.708Z" transform="translate(-657.83 -893.881)" fill="#67be5c" />
                                                            <path id="Path_147" data-name="Path 147" d="M866.86,898.735a1.631,1.631,0,0,1-.017.286.612.612,0,0,1-1.212-.137,6.676,6.676,0,0,0-.469-2.439,6.753,6.753,0,0,0-2.864-3.372.617.617,0,0,1-.147-1.026.6.6,0,0,1,.759-.04,7.942,7.942,0,0,1,3.373,3.917A8.084,8.084,0,0,1,866.86,898.735Z" transform="translate(-848.85 -893.832)" fill="#67be5c" />
                                                        </g>
                                                    </svg>
                                                    <span>Alarm</span>
                                                </div>
                                                <div className='d-flex align-items-end unit-amenity'>
                                                    <svg id="roolup" xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 15.155 24.693">
                                                        <path id="Path_13" data-name="Path 13" d="M842.323-974.223a.807.807,0,0,1-.472-1.008c-.106-.007-.182-.016-.258-.016-.37,0-.74,0-1.109,0a.659.659,0,0,1-.719-.722c0-.241,0-.483,0-.724a1.436,1.436,0,0,1,.718-1.26.362.362,0,0,0,.2-.36q-.008-6.161,0-12.323v-.242c0-.3.136-.469.364-.465s.359.174.359.477V-980.1c.085-.053.144-.085.2-.125.694-.508,1.383-1.022,2.081-1.523a.451.451,0,0,0,.214-.415c-.007-2.082,0-4.164,0-6.246,0-.492.081-.573.574-.573h5.789c.44,0,.535.1.536.538v1.465l.585-.424c.58-.429,1.168-.853,1.746-1.289a.4.4,0,0,0,.153-.264c.009-1.945.006-3.89.006-5.836,0-.046-.009-.091-.015-.147H841.413c0,.085-.012.169-.012.254v2.1a.821.821,0,0,1-.025.238.328.328,0,0,1-.386.249.342.342,0,0,1-.312-.386v-2.452c-.1-.005-.173-.011-.25-.014a.643.643,0,0,1-.663-.674c-.005-.289,0-.58,0-.868a.658.658,0,0,1,.737-.748c.852-.006,1.7,0,2.556,0h2.518c.258-1.1.856-1.662,1.75-1.666s1.5.546,1.772,1.666h4.961c.644,0,.857.214.857.848v.675a.669.669,0,0,1-.738.773c-.047,0-.094.007-.175.013v12.005c0,.285-.135.442-.364.439s-.358-.167-.358-.451v-4.937c-.082.05-.14.081-.193.12-.709.515-1.41,1.039-2.121,1.552a.391.391,0,0,0-.18.359q.007,2.882,0,5.764c0,.489-.083.571-.577.571h-5.787c-.439,0-.532-.1-.534-.541q0-.422-.005-.844a.282.282,0,0,0-.023-.064,1.793,1.793,0,0,0-.158.094c-.713.522-1.429,1.041-2.135,1.574a.48.48,0,0,0-.161.308c-.023.261-.008.525-.008.8h11.867c0-.081.012-.164.012-.249v-2.8a1.036,1.036,0,0,1,.009-.217.34.34,0,0,1,.371-.306.33.33,0,0,1,.341.336c.007.072,0,.144,0,.217v2.918a.322.322,0,0,0,.177.322,1.45,1.45,0,0,1,.739,1.3q0,.349,0,.7a.661.661,0,0,1-.719.722c-.362.007-.724,0-1.086,0h-.267c.034.448-.019.844-.488,1.025h-2.845a.886.886,0,0,1-.482-1.009h-3.387a.854.854,0,0,1-.47,1.009Zm7.732-14.024h-5.419v7.982h5.419Zm4.139,12.274v-.559c0-.644-.285-.928-.923-.928H841.238a.721.721,0,0,0-.709.55,6.7,6.7,0,0,0-.056.936c.444,0,.838.006,1.229-.006a.28.28,0,0,0,.185-.136.678.678,0,0,1,.626-.376h2.435a.689.689,0,0,1,.631.369.321.321,0,0,0,.227.143q1.532.014,3.063,0a.3.3,0,0,0,.215-.129.709.709,0,0,1,.669-.386c.8,0,1.592,0,2.387,0a.682.682,0,0,1,.644.381c.032.058.106.129.163.129.407.017.807.012,1.246.012Zm-.009-20.54H840.5v.807h13.686Zm-9.273,20.759h-2.337v.789h2.337Zm7.2.006h-2.341v.786h2.341Zm-3.777-21.52a1,1,0,0,0-1.052-.928.972.972,0,0,0-.927.928Z" transform="translate(-839.763 998.91)" fill="#67be5c" />
                                                        <path id="Path_14" data-name="Path 14" d="M914.676-908.839h2.384a1.45,1.45,0,0,1,.24.01.327.327,0,0,1,.3.326.329.329,0,0,1-.28.365,1.406,1.406,0,0,1-.288.02h-4.746c-.387,0-.566-.118-.564-.368s.169-.356.57-.356Z" transform="translate(-907.083 914.643)" fill="#67be5c" />
                                                        <path id="Path_15" data-name="Path 15" d="M930.713-883.354h-1.278a1.537,1.537,0,0,1-.215-.007.343.343,0,0,1-.328-.374.328.328,0,0,1,.34-.335q1.494-.01,2.988,0a.329.329,0,0,1,.251.1.33.33,0,0,1,.09.256.347.347,0,0,1-.38.351c-.489.01-.98,0-1.469,0Z" transform="translate(-923.149 891.474)" fill="#67be5c" />
                                                    </svg>
                                                    <span>Rollup Door</span>
                                                </div>
                                                <div className='d-flex align-items-end unit-amenity'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 18.496 18.5">
                                                        <g id="ground" transform="translate(0 0)">
                                                            <path id="Path_16" data-name="Path 16" d="M752.994-1018.279h2.081a1.3,1.3,0,0,1,.2.006.312.312,0,0,1,.27.32.307.307,0,0,1-.266.3.944.944,0,0,1-.2.008h-17.64c-.248,0-.395-.127-.39-.327s.146-.31.385-.31H739.6v-17.5a.328.328,0,0,1,.432-.349l5.211,1.041,7.28,1.455c.431.086.473.132.473.579v14.774Zm-12.744-6.052v6.036h12.1v-6.036Zm0-.66h12.1v-4.442h-12.1Zm0-5.1h12.113c0-.944,0-1.874-.005-2.8a.189.189,0,0,0-.121-.131c-.251-.062-.506-.107-.759-.16l-9.9-1.979-1.331-.263Z" transform="translate(-737.048 1036.14)" fill="#67be5c" />
                                                            <path id="Path_17" data-name="Path 17" d="M886.822-790.464a.384.384,0,0,1-.058-.064q-.492-.885-.98-1.77a1.17,1.17,0,0,1-.148-.716,1.172,1.172,0,0,1,.675-.968,1.159,1.159,0,0,1,1.207.081,1.162,1.162,0,0,1,.527.845,1.182,1.182,0,0,1-.142.755q-.49.888-.981,1.774a.385.385,0,0,1-.058.064Zm.025-3.036a.608.608,0,0,0-.61.6.608.608,0,0,0,.6.616.608.608,0,0,0,.433-.173.608.608,0,0,0,.183-.428.607.607,0,0,0-.173-.433.608.608,0,0,0-.43-.183Z" transform="translate(-879.623 807.958)" fill="#67be5c" />
                                                        </g>
                                                    </svg>
                                                    <span>Ground Floor</span>
                                                </div>
                                                <div className='d-flex align-items-end unit-amenity'>
                                                    <svg id="inside" xmlns="http://www.w3.org/2000/svg" width="18" height="14" viewBox="0 0 17.537 17.539">
                                                        <path id="Path_5" data-name="Path 5" d="M696.13-1009.709a2.461,2.461,0,0,1,.454-1.074,2.157,2.157,0,0,1,1.595-.851c.108-.008.217-.009.325-.009h7.21a2.242,2.242,0,0,1,.256.009.587.587,0,0,1,.521.582.587.587,0,0,1-.51.593,2.066,2.066,0,0,1-.256.01h-7.278a1.116,1.116,0,0,0-.7.187,1.013,1.013,0,0,0-.424.87q0,3.982,0,7.963v3.459a1,1,0,0,0,1.08,1.074c3.773,0,7.546-.009,11.319.009a1.087,1.087,0,0,0,1.161-1.168c-.019-2.42-.008-4.84-.006-7.261a1.281,1.281,0,0,1,.028-.322.587.587,0,0,1,.614-.418.586.586,0,0,1,.544.524,1.631,1.631,0,0,1,.007.171v7.4a2.175,2.175,0,0,1-1.576,2.171,2.45,2.45,0,0,1-.657.09q-5.737.008-11.474,0a2.19,2.19,0,0,1-2.2-1.84.438.438,0,0,0-.03-.078Z" transform="translate(-696.13 1013.237)" fill="#67be5c" />
                                                        <path id="Path_6" data-name="Path 6" d="M897.434-1054.22l.131.072a.6.6,0,0,1,.3.405.6.6,0,0,1-.119.491,1.934,1.934,0,0,1-.153.163q-3.928,3.931-7.858,7.857a1.287,1.287,0,0,1-.166.12l.032.064h3.666a.587.587,0,0,1,.6.739.559.559,0,0,1-.456.435,1.256,1.256,0,0,1-.256.017H888.5c-.112,0-.228.006-.342.009a.624.624,0,0,1-.466-.176.622.622,0,0,1-.189-.461q0-2.534.009-5.068a.605.605,0,0,1,.5-.67.587.587,0,0,1,.459.114.589.589,0,0,1,.227.415c.005.068,0,.137,0,.206v3.586c.079-.075.127-.118.172-.164q3.9-3.9,7.8-7.795a5.226,5.226,0,0,1,.446-.359Z" transform="translate(-880.341 1054.22)" fill="#67be5c" />
                                                    </svg>
                                                    <span>Inside</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-2 col-md-2 col-sm-12'>
                                        <div className='rentNow-card-action d-flex justify-content-center align-items-center h-100'>
                                            <button className="ui button btn-success" onClick={e => navigateUnits(e, details.locationId, details.address)}> {t("View Units")}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })
                        }
                    </div> : <div className='col-lg-2 col-md-2 col-sm-12'>
                        No Location found

                    </div>


            ) : <div className="ui active centered inline loader"></div>
            }
        </>
    )
}

export default Card