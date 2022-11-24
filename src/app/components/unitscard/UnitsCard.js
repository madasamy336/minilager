import { useEffect, useState, React } from 'react';
import PopupExampleInverted from '../unitstooltip/UnitsTooltip';
import { useNavigate } from 'react-router-dom';
import { Popup } from 'semantic-ui-react';
import instance from '../../services/instance';
import request from '../../services/request';
import Helper from "../../helper";
import PlaceholderLoader from "../placeholder/Placeholder";
let helper = new Helper();
const UnitsCard = (props) => {
    console.log(props.storageTypevalue)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    let unicount = [1, 2, 3];
    let unitList;
    // useEffect(() => {
    //     sixStorageLoadUnitList(props.storageTypevalue);
    // },[props.storageTypevalue])

    const rentNow = (e,unitid) => {
        e.preventDefault();
        navigate(`/preBooking/rentingDetails`)
    }
    
    const sixStorageLoadUnitList = (storageTypeid) => {
        let config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        let requestbody = {
            storageTypeId: [storageTypeid],
            locationId: null,
            buildingId: null,
            unitTypeId: null,
            amenityId: null,
            pageNumber: 1,
            pageSize: 10,
            isBusinessUser: false,
            unitSort: "UnitNumber",
            unitVisibility: 1,
            availability: 2
        }
        instance
            .post(request.user_search, requestbody, config)
            .then(response => {
                props.setUnitResponse(response.data.result);
                props.setLoading(true);
            })
            .catch(error => {

            })

    }

    return (
        <>
         {/* <PlaceholderLoader key="" cardCount={} />   */}
            {typeof props.UnitResponse !== 'undefined' && props.UnitResponse !== null &&
            
                props.UnitResponse.map(details => {
                    console.log(details);
                    return <div key={details.unitTypeId} className='col-lg-4 col-md-6 col-sm-12 2 px-2 '>
                        <div key="" className='card my-2'>
                            <div className='card-img text-center position-relative'>
                                {typeof details.imageUrl !== 'undefined' && details.imageUrl !== null ? (
                                    <img src={details.imageUrl} alt='Units' />

                                ) : <img src='/assets/images/units.png' alt='Units' />}

                                {typeof details.discounts !== 'undefined' && details.discounts !== null && details.discounts.length > 0 ? (
                                    details.discounts.map((item) => {
                                        console.log(item);
                                        return <Popup key="" wide inverted size='tiny'
                                            trigger={<p className='position-absolute t-2 r-0'>{item.name}</p>}
                                            content={item.description}
                                            hideOnScroll />
                                    })


                                ) : ''

                                }

                            </div>
                            <div className='card-body'>
                                <div className='card-title'>
                                    <div className='row align-items-center'>
                                        <div className='col-lg-12 col-md-12 col-sm-12'>

                                            <div className='d-flex align-items-center justify-content-between'>
                                                <h2 className='fw-700 mb-1'>{helper.displayMeasurementSize(details.unitMeasurement)} <small className='fw-500'>{details.unitTypeName}</small></h2>
                                                <div className='units-left'>
                                                    <p className='error'>{`Only ${details.unitIds.length} Units left`}</p>
                                                </div>
                                            </div>
                                            <div className='d-flex align-items-start'>
                                                <svg className='min-width-1' xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 13.68 18.951">
                                                    <path id="Location_" data-name="Location " d="M-233.385-421.251a6.829,6.829,0,0,1,1.987-4.839,6.641,6.641,0,0,1,3.848-1.94,6.643,6.643,0,0,1,4.759,1.054,6.62,6.62,0,0,1,2.866,4.039,6.635,6.635,0,0,1-.878,5.358q-2.546,4-5.12,7.978c-.034.052-.065.1-.1.156a.618.618,0,0,1-1.046,0c-.19-.271-.363-.556-.539-.835q-2.357-3.678-4.712-7.357A6.543,6.543,0,0,1-233.385-421.251Zm9.946-.024a3.118,3.118,0,0,0-3.114-3.107,3.118,3.118,0,0,0-3.1,3.1,3.119,3.119,0,0,0,3.1,3.117,3.118,3.118,0,0,0,3.113-3.11Z" transform="translate(233.386 428.108)" fill="#67be5c" />
                                                </svg>
                                                <span>{details.location.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='card-desc'>
                                    {typeof details.amenities !== 'undefined' && details.amenities !== null && details.amenities.length > 0 ?
                                        <div className='d-flex flex-wrap units-amenitiy'>
                                            {details.amenities.map((item) => {
                                                console.log(item)
                                                return <div key="" className='d-flex align-items-center my-1'>
                                                    <img src={item.imageUrl} alt='amenities' style={{ width: "10px", height: "10px" }} />
                                                    <span>{item.name}</span>
                                                </div>


                                            })

                                            }
                                        </div>


                                        : ""

                                    }

                                </div>
                                <div className='card-charges' style={{ display: "none" }}>
                                    <p className='d-flex align-items-center'><img src='/assets/images/Unloaded.png' alt='Unloaded and Loaded' /> <span className='fw-600'>Loading And Unloading Charges</span></p>
                                </div>
                                <div className='card-text'>
                                    {typeof details.description !== 'undefined' && details.description !== null ? (
                                        <Popup wide inverted size='tiny'
                                            trigger={<p>{details.description}</p>}
                                            content={details.description}
                                            on='click'
                                            hideOnScroll
                                        />
                                    ) : ""
                                    }

                                </div>
                                <div className='card-actions'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <h2 className='fw-700'>{helper.displayCurrency(details.netAmount)} <PopupExampleInverted img={<img src='/assets/images/tooltip.png' alt='Price' />} tooltip={`Rent :${helper.displayCurrency(details.unitPrice)} Tax(${helper.displayPercent(details.taxPercentage)}): ${helper.displayCurrency(details.taxAmount)}`} /></h2>
                                        <button className='ui button btn-success d-inline-flex align-items-center' onClick={e => rentNow(e,details.unitTypeId)}><img src='/assets/images/password-img.png' alt='Rent Now' /><span>Rent Now</span></button>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                })
            }
              
              {
             
              
              }
        
            
        </>
    )
}

export default UnitsCard