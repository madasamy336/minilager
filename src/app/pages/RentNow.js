import React, { useState, useRef } from "react";
import Card from "../components/rentnow/Cards";
import { Input } from 'semantic-ui-react'
import { useTranslation } from "react-i18next";
import { useEffect } from 'react';
import instance from '../services/instance';
import request from '../services/request';

const RentNow = () => {
    const searchinput = useRef(null);
    const [LocationResponse, setLocationResponse] = useState(null);
    const [searchValue, setSearchValue] = useState('');

    const fetchFaciltyDetail = () => {
        let config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        let requestbody = {
            unitVisibility: 1,
            availability: 2
        }

        instance
            .post(request.facility_cities, requestbody, config)
            .then(response => {
                const location = response.data;
                if (location.result !== null && location.result !== 'undefined' && location.result !== '') {
                    setLocationResponse(location.result);
                }

                if (location.returnCode === 'NO_RECORDS_FOUND') {
                    setLocationResponse([])
                }
            })
            .catch(error => {
                console.log(error);

            })
    }

    const searchFacilityDetail = (e) => {
        let locationSearch = LocationResponse;
        let filterResult = locationSearch.filter(
            (i) =>(i.locationName !== null && i.locationName.toLowerCase().includes(searchinput.current.value.toLowerCase())) || (i.address !== null && i.address.addressLine1 !== null  && i.address.addressLine1.toLowerCase().includes(searchinput.current.value.toLowerCase())) || (i.address !== null && i.address.zipCode !== null && i.address.zipCode.includes(searchinput.current.value)));
        if (searchinput.current.value === '') {
            filterResult = [];
        }
        if (filterResult.length > 0) {
            setLocationResponse(filterResult);
        } else {
            fetchFaciltyDetail();
        }

    }
    const facilitycall = (e) => {
        e.preventDefault()
        if (searchinput.current.value === '') {
            fetchFaciltyDetail();
        }

    }
    const onChangeSearchValue = (e) => {
        e.preventDefault()
        setSearchValue(e.target.value);

    }
    const clearSearchValue = (e) => {
        e.preventDefault()
        if (searchValue.length > 0) {
            const newVotes = searchValue;
            setSearchValue('')
            fetchFaciltyDetail();
        }

    }
    // searchinput.current.addEventListener("keydown",(e)=> {
    //     if(e.code === "Enter"){
    //         console.log("test")
    //     }
    // })
    const { t } = useTranslation();
    useEffect(() => {
        fetchFaciltyDetail();
    }, [])
    useEffect(() => {
        setSearchValue(searchValue)
    }, [searchValue])


    return (
        <div className="rentnow">
            <div className="ui container fluid">
                <div className="rentNow-banner position-relative">
                    <img className='w-100' src='./assets/images/rentnow-img.png' alt="RENT NOW" />
                    <h2 className="text-white position-absolute w-100 text-center"> {t('RENT NOW')}</h2>
                </div>
                <div>
                    <div className='rentNow-units text-center'>
                        <div className="ui action left icon input bg-white align-items-center position-relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="30" viewBox="0 0 40.382 46">
                                <g id="location_new-1" data-name="location new-1" transform="translate(0.002 -0.003)">
                                    <path id="Path_3" data-name="Path 3" d="M18.033,46c-.682-.057-1.365-.118-2.048-.173a37.822,37.822,0,0,1-9.346-1.805,14.014,14.014,0,0,1-4.9-2.635A5.017,5.017,0,0,1,.185,39.075a4.143,4.143,0,0,1,1.258-4.323A11.762,11.762,0,0,1,5.71,32.18a32.594,32.594,0,0,1,6.44-1.7c.1-.017.194-.048.328-.082-.082-.145-.14-.261-.21-.37-1.547-2.417-3.124-4.815-4.636-7.253A14.182,14.182,0,0,1,5.609,12.5,14.326,14.326,0,0,1,14.4,1.287,14.054,14.054,0,0,1,28.846,2.92a14.278,14.278,0,0,1,5.823,9.009A14.352,14.352,0,0,1,32.74,22.773c-1.519,2.435-3.09,4.835-4.635,7.253-.07.109-.128.225-.21.371.9.183,1.76.338,2.613.538a21.675,21.675,0,0,1,6.956,2.645,6.07,6.07,0,0,1,2.673,3.036,3.924,3.924,0,0,1-.6,3.774,8.514,8.514,0,0,1-3.245,2.555,26.053,26.053,0,0,1-8.124,2.413c-1.816.265-3.653.386-5.481.572-.147.015-.292.048-.438.073H18.033Zm2.146-8.575c.13-.194.223-.327.309-.462,3.224-5.051,6.434-10.111,9.675-15.151a11.822,11.822,0,0,0,.783-12.384,11.444,11.444,0,0,0-9.522-6.585A11.632,11.632,0,0,0,10.394,7.8a12.155,12.155,0,0,0-.488,13.549q3.431,5.361,6.861,10.725c1.126,1.762,2.248,3.527,3.412,5.356Zm-.007,5.947c1.685-.108,3.372-.181,5.053-.332a30.47,30.47,0,0,0,8.539-1.9,8.483,8.483,0,0,0,3.4-2.1,1.461,1.461,0,0,0,0-2.228,7.043,7.043,0,0,0-2.328-1.644,27.275,27.275,0,0,0-8.359-2.223.514.514,0,0,0-.366.225c-.338.492-.651,1-.972,1.506q-1.855,2.91-3.7,5.822a1.4,1.4,0,0,1-1.495.752,1.5,1.5,0,0,1-1.024-.8q-2.283-3.593-4.57-7.185c-.158-.25-.292-.388-.634-.312-.625.138-1.27.189-1.9.306A21.391,21.391,0,0,0,4.985,35.48,8.654,8.654,0,0,0,3.16,36.9a1.363,1.363,0,0,0,0,2.076,5.576,5.576,0,0,0,.961.865,15.165,15.165,0,0,0,4.656,2.033,45.246,45.246,0,0,0,11.395,1.5Z" transform="translate(0 0)" fill="#67be5c" />
                                    <path id="Path_4" data-name="Path 4" d="M133.208,79.849a6.729,6.729,0,1,1-6.75-6.719,6.751,6.751,0,0,1,6.75,6.719Zm-2.694,0a4.035,4.035,0,1,0-4.017,4.042A4.073,4.073,0,0,0,130.514,79.852Z" transform="translate(-106.292 -64.907)" fill="#67be5c" />
                                </g>
                            </svg>
                            {/* <Input
                            ref={searchinput}
                                value={searchValue}
                                onChange={onChangeSearchValue}  
                                label={{ icon: 'remove', onClick: clearSearchValue }}
                            /> */}
                            <input ref={searchinput} value={searchValue} onChange={onChangeSearchValue} className='border-0 border-radius-0' placeholder={t('Zip,City or Address')} type="text" /> <i aria-hidden="true" style={{pointerEvents:"all"}} className={`${searchValue.length > 0 ? "cancel" : "search"} icon`} onClick={clearSearchValue} /> <button className="ui button" onClick={searchFacilityDetail} onChange={() => { facilitycall }}> {t('Search')}</button>
                        </div>
                        {LocationResponse ? <>
                           {LocationResponse.length ? <Card facilitydetails={LocationResponse} /> :
                            <div className="ui centered inline">No record found</div>}
                             </>:
                            <div className="ui active centered inline loader"></div>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default RentNow;
