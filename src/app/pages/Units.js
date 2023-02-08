import React from 'react'
import AccordionExampleStyled from '../components/unitsfilter/UnitsFilter'
import { Dropdown, Header, Pagination, Icon, Modal } from 'semantic-ui-react'
import UnitsCard from '../components/unitscard/UnitsCard'
import { useEffect, useState } from 'react';
import PlaceholderLoader from "../components/placeholder/Placeholder";
import instance from '../services/instance';
import request from '../services/request';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from "react-i18next";
import 'react-toastify/dist/ReactToastify.css';

let isBussinessUser;
let totatCount;
let pagesizepagination = 10;
let pages = 0;

const Units = () => {
    const [tenantTypes, setTenantTypes] = useState(null);
    const [tenantTypeError, setTenantTypeError] = useState(false);
    const [SortByPriceRange, setSortByPriceRange] = useState("Ascending");
    const [unitLoadMoreButtonVal, setUnitLoadMoreButtonVal] = useState();
    const [pageNumber, setPageNumber] = useState(1);
    const [noUnits, setNoUnits] = useState(false);
    const [isRendered, setIsRendered] = useState(false);

    const [UnitResponse, setUnitResponse] = useState(null);
    const [storageTypeValue, setStorageTypeValue] = useState('');
    //const [tenantTypeError, setTenantTypeError] = useState('');
    const [filterRequest, setFilterRequest] = useState('')
    const [loader, setLoading] = useState(true);
    const [filtercall, setFilterCall] = useState(false);
    const { t, i18n } = useTranslation();


    const [unitTypeModal, SetunitTypeModal] = useState({
        open: false,
        dimmer: undefined,
        size: undefined
    });
    const filters = JSON.parse(localStorage.getItem('Units'));
    let locationId = localStorage.getItem('locationid');
    let userInfo = JSON.parse(localStorage.getItem('tenantInfo'));
    useEffect(() => {
        if (!isRendered) {
            fetchUnitFilter(locationId);
            setIsRendered(true);
        }
    }, [storageTypeValue]);

    useEffect(() => {

        if (typeof userInfo !== "undefined" && userInfo !== null && userInfo !== "") {
            if (userInfo.businessUser === true) {
                setTenantTypes(tenantTypeOptions[1].value);
                sessionStorage.setItem("isBussinessUser", tenantTypeOptions[1].value);
            } else {
                setTenantTypes(tenantTypeOptions[0].value);
                sessionStorage.setItem("isBussinessUser", tenantTypeOptions[0].value);
            }
            sessionStorage.removeItem("applypromo");
        }
        sixStorageLoadUnitList(storageTypeValue);
    }, [pageNumber]);

    const fetchUnitFilter = (loactionid) => {
        let config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        instance
            .get(request.unit_filters + `&LocationId=${loactionid} `, config)
            .then(response => {
                const unitFilterResponse = response.data;
                if (unitFilterResponse.returnMessage === "NO_RECORDS_FOUND" && unitFilterResponse.isSuccess === true) {
                    setNoUnits(true);
                    setLoading(false);
                }
                if (typeof unitFilterResponse !== 'undefined' && unitFilterResponse !== null && unitFilterResponse !== '' && unitFilterResponse.isSuccess === true && unitFilterResponse.result.length > 0) {
                    let data = constructFilterValues(unitFilterResponse.result);
                    localStorage.setItem("Units", JSON.stringify(data));
                    if (typeof data !== 'undefined' && data !== null && data !== '' && typeof data.storageType !== 'undefined' && data.storageType !== null && data.storageType !== "" && data.storageType.length > 0) {
                        if (typeof storageTypeValue === "undefined" || storageTypeValue === null || storageTypeValue === "") {
                            setStorageTypeValue(data.storageType[0].storageTypeId);
                            sixStorageLoadUnitList(data.storageType[0].storageTypeId);
                        } else {
                            setStorageTypeValue(storageTypeValue);
                            sixStorageLoadUnitList(storageTypeValue);
                        }
                    }
                }
            })
            .catch(error => {

            })
    }

    const constructFilterValues = (unitFilterResponse) => {
        let storageTypeValues = [];
        let storageFacilityValues = [];
        let storageBuildingValues = [];
        let storageUnitTypeValues = [];
        let storageAmenityValues = [];
        let storagePriceRangeValues = [];

        unitFilterResponse.forEach(filtersResponse => {
            storageTypeValues.push({
                storageTypeId: filtersResponse.storageTypeId,
                storageTypeName: filtersResponse.storageTypeName,
            });

            let storagefacility = filtersResponse.facilities;
            let storageunitresponse = filtersResponse.unitTypes;

            if (typeof storagefacility !== 'undefined' && storagefacility !== null && storagefacility !== "" && storagefacility.length > 0) {
                storagefacility.forEach((locationresponse) => {
                    storageFacilityValues.push({
                        storageTypeId: filtersResponse.storageTypeId,
                        locationId: locationresponse.locationId,
                        locationName: locationresponse.locationName,
                    });
                    let storagebuilding = locationresponse.buildings;
                    if (typeof storagebuilding !== "undefined" && storagebuilding !== null && storagebuilding !== "" && storagebuilding.length > 0) {
                        storagebuilding.forEach((storagebuildingresponse) => {
                            storageBuildingValues.push({
                                locationId: locationresponse.locationId,
                                storageTypeId: filtersResponse.storageTypeId,
                                buildingId: storagebuildingresponse.buildingId,
                                buildingName: storagebuildingresponse.buildingName
                            });
                        })
                    }
                });
            }

            if (typeof storageunitresponse !== 'undefined' && storageunitresponse !== null && storageunitresponse !== "" && storageunitresponse.length > 0) {
                storageunitresponse.forEach((storageunitresponse) => {

                    let amenities = storageunitresponse.amenities;
                    let price = storageunitresponse.price;
                    storageUnitTypeValues.push({
                        storageTypeId: filtersResponse.storageTypeId,
                        unitTypeId: storageunitresponse.unitTypeId,
                        unitTypeName: storageunitresponse.unitTypeName,
                        unitMeasurement: storageunitresponse.unitMeasurement,
                        measurementType: storageunitresponse.measurementType
                    });

                    if (typeof amenities !== 'undefined' && amenities !== null && amenities !== "" && amenities.length > 0) {
                        amenities.forEach((amenityresponse) => {
                            storageAmenityValues.push({
                                storageTypeId: filtersResponse.storageTypeId,
                                id: amenityresponse.id,
                                name: amenityresponse.name
                            });
                        })
                    }

                    if (typeof price === 'undefined' || price === null || price === "") {
                        storagePriceRangeValues.push({
                            storageTypeId: filtersResponse.storageTypeId,
                            MinPrice: 0,
                            MaxPrice: 0,
                        });
                    } else {
                        storagePriceRangeValues.push({
                            storageTypeId: filtersResponse.storageTypeId,
                            MinPrice: price.minPrice,
                            MaxPrice: price.maxPrice
                        });
                    }
                });
            }

        })

        const storageUnitDimensionValues = storageUnitTypeValues.reduce((groups, item) => ({
            ...groups,
            [item.unitTypeName]: [...(groups[item.unitTypeName] || []), item]
        }), {});

        let filteredFinalData = {
            storageType: storageTypeValues,
            location: storageFacilityValues,
            building: storageBuildingValues,
            unitType: storageUnitTypeValues,
            amenityValue: storageAmenityValues,
            priceRangeValue: storagePriceRangeValues,
            unitDimensionValue: storageUnitDimensionValues,
        }

        return filteredFinalData;
    }

    const sixStorageLoadUnitList = (storageTypeid, searchFilterValues) => {
        let buidingId;
        let unitTypeId;
        let amenitiesId;
        let minvalues;
        let maxvalues;
        if (typeof searchFilterValues !== "undefined" && searchFilterValues !== null && searchFilterValues !== "") {
            buidingId = searchFilterValues.buildingid;
            unitTypeId = searchFilterValues.unitTypeid;
            amenitiesId = searchFilterValues.amenitiesid;
            if (typeof searchFilterValues.priceRange !== "undefined" && searchFilterValues.priceRange !== null && searchFilterValues.priceRange !== "") {
                minvalues = searchFilterValues.priceRange[0];
                maxvalues = searchFilterValues.priceRange[1];
            }
        }
        setLoading(true);

        let config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        let requestbody = {
            storageTypeId: [storageTypeid],
            locationId: [locationId],
            buildingId: buidingId,
            unitTypeId: unitTypeId,
            amenityId: amenitiesId,
            priceRange: {
                minPrice: minvalues,
                maxPrice: maxvalues
            },
            sortDirection: SortByPriceRange,
            pageNumber: pageNumber,
            pageSize: 10,
            isBusinessUser: isBussinessUser === "true" ? true : false,
            unitSort: "UnitPrice",
            unitVisibility: 1,
            availability: 2
        }
        instance
            .post(request.user_search, requestbody, config)
            .then(response => {
                setUnitResponse(response.data.result);
                let loadmoreUnitCount = response.data.totalCount - response.data.pageCount;
                totatCount = response.data.totalCount;
                let quotient = Math.floor(totatCount / pagesizepagination);
                let remainder = totatCount % pagesizepagination;
                if (remainder > 0) {
                    pages = quotient + 1;
                } else {
                    pages = quotient;

                }
                setUnitLoadMoreButtonVal(loadmoreUnitCount);
                setLoading(false);
                setFilterCall(true);
            })
            .catch(error => {

            })

    }

    const tenantTypeOptions = [
        {
            key: 1,
            text: `${t("Personal User")}`,
            value: 'false'
        },
        {
            key: 2,
            text: `${t("Business User")}`,
            value: 'true',
        },
    ]


    const tenantInfoChange = (event, data) => {
        console.log(data)
        setTenantTypes(data.value);
        if (data.value === "true" || data.value === "false") {
            document.getElementById('tenantTypeError').style.display = 'none'
        } else {
            document.getElementById('tenantTypeError').style.display = 'block'
        }
        sessionStorage.setItem("isBussinessUser", data.value);
        isBussinessUser = sessionStorage.getItem('isBussinessUser');
    }

    const tenantTypeValidation = (data) => {
        setTenantTypeError(data);
    }

    const sortByPriceRange = (event_, data) => {
        setSortByPriceRange(data.value);
        sixStorageLoadUnitList(storageTypeValue);
    }

    const PaginationHandleChange = (event, value) => {
        window.scroll(0, 300);
        setPageNumber(value.activePage);
    }

    const storageTypeOptions = typeof filters !== 'undefined' && filters !== null && filters !== '' && typeof filters.storageType !== 'undefined' && filters.storageType !== null && filters.storageType !== "" && filters.storageType.length > 0 ?
        filters.storageType.map(storageType => {
            return {
                key: storageType.storageTypeId,
                text: storageType.storageTypeName,
                value: storageType.storageTypeId
            }
        }
        ) : '';

    const changeStorageType = (e, data) => {
        setUnitResponse([]);
        setStorageTypeValue(data.value);
    }
    const filterValue = (data) => {
        setFilterRequest(data);

    }
    const checkTenantType = () => {
        document.getElementById('tenantTypeError').classList.remove('d-none')
        document.querySelector('#root').scrollIntoView({
            behavior: 'smooth'
        }, 500)
    }

    const sortUnitOptions = [
        {
            key: 'Ascending',
            text: `${t("Price Low to High")}`,
            value: 'Ascending',
            content: `${t("Price Low to High")}`,
        },
        {
            key: 'Descending',
            text: `${t("Price High to Low")}`,
            value: 'Descending',
            content: `${t("Price High to Low")}`,
        }
    ]

    return (
        <div className="units-wrapper">
            <ToastContainer />
            <div className="ui container fluid">
                <div className="units-banner position-relative">
                    <img className='w-100' src='/assets/images/rentnow-img.png' alt="Storage Units" />
                    <div className='dropdown-div mx-auto position-absolute'>
                        <h2 className='text-center'>{t("Find Your Storage Place")}</h2>
                        <div className='row'>
                            <div className='col-lg-6 col-md-6 col-sm-12'>
                                {typeof tenantTypeOptions !== "undefined" && tenantTypeOptions !== null && tenantTypeOptions !== "" && tenantTypeOptions.length > 0 ? <Dropdown placeholder={`${t("Choose Tenant Type")}`} clearable fluid selection options={tenantTypeOptions} value={tenantTypes} onChange={tenantInfoChange} /> : null}
                            </div>
                            <div className='col-lg-6 col-md-6 col-sm-12'>
                                {storageTypeOptions !== null && typeof storageTypeOptions !== 'undefined' && storageTypeOptions !== '' && typeof storageTypeOptions[0].value !== 'undefined' && storageTypeOptions[0].value !== null && storageTypeOptions[0].value !== '' ?
                                    <Dropdown placeholder="Choose Storage Type" value={storageTypeValue} clonChange={changeStorageType} fluid selection options={storageTypeOptions} className={`opacity-1`} disabled={storageTypeOptions.length === 1} />
                                    : ''}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="units-row">
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <div className="filters-div">
                                <AccordionExampleStyled filterValue={filterValue} unitsearchFilters={(items) => sixStorageLoadUnitList(storageTypeValue, items)} storageTypeValue={storageTypeValue} modal={() => SetunitTypeModal({ open: true, size: 'tiny', dimmer: 'blurring' })} />
                            </div>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12">
                            <div className="units-container-div">
                                <p id="tenantTypeError" className='text-center error py-1 d-none'>{t("Please Select Tenant Type")}</p>
                                <div className='sort-div text-right py-1'>
                                    <Header as='h4'>
                                        <Header.Content>
                                            {t("Sort by")}:{' '}
                                            <Dropdown
                                                floating
                                                inline
                                                options={sortUnitOptions}
                                                defaultValue={sortUnitOptions[0].value}
                                                onChange={sortByPriceRange}
                                            />
                                        </Header.Content>
                                    </Header>
                                </div>
                                <div className='units-div'>
                                    <div className='row'>
                                        {noUnits ? <div className='col-12'><p id="nounits-available" className='text-center error py-1'>No Units Available</p></div> : ""}

                                        {loader ? (<div>
                                            <PlaceholderLoader cardCount={7} />
                                        </div>) : (<UnitsCard tenantType={tenantTypes} checkTenantType={() => checkTenantType()} filterRequest={filterRequest} storageTypevalue={storageTypeValue} UnitResponse={UnitResponse} setUnitResponse={setUnitResponse} setLoading={setLoading} />)}

                                    </div>
                                </div>
                                {!loader && typeof unitLoadMoreButtonVal !== 'undefined' && unitLoadMoreButtonVal !== null && unitLoadMoreButtonVal !== '' && unitLoadMoreButtonVal > 0 && unitLoadMoreButtonVal !== 0 ? (
                                    <div className='pagination-div mt-2 mb-3 text-center'>
                                        <Pagination ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                                            firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                                            lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                                            prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                            nextItem={{ content: <Icon name='angle right' />, icon: true }} defaultActivePage={1} totalPages={pages} onPageChange={PaginationHandleChange} />
                                    </div>
                                ) : ''}
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    dimmer={unitTypeModal.dimmer}
                    open={unitTypeModal.open}
                    size={unitTypeModal.size}
                    onClose={() => SetunitTypeModal({ open: false })}
                >
                    <Modal.Header className='bg-success-dark text-white text-center fs-6 py-2 fw-400 position-relative'>Choose Dimensions
                        <svg onClick={() => SetunitTypeModal({ open: false })} className='r-3 cursor-pointer position-absolute' xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 17.473 17.47">
                            <path id="wrong-5" d="M978.609-438.353l-2.052-2.043-4.37-4.366a1.33,1.33,0,0,1-.4-1.425,1.3,1.3,0,0,1,.833-.843,1.3,1.3,0,0,1,1.171.183,3.019,3.019,0,0,1,.353.321q3.009,3,6.009,6.01c.088.088.159.193.254.309.127-.118.217-.2.3-.281l6.156-6.156a1.332,1.332,0,0,1,1.325-.431,1.3,1.3,0,0,1,.927.828,1.3,1.3,0,0,1-.188,1.228,3.412,3.412,0,0,1-.325.35q-3,3.009-6.011,6.009a3.233,3.233,0,0,1-.317.244c.132.14.213.23.3.316q3.052,3.053,6.108,6.1a1.36,1.36,0,0,1,.441,1.387,1.305,1.305,0,0,1-2.205.564c-.59-.568-1.163-1.157-1.74-1.736l-4.487-4.491a2.068,2.068,0,0,1-.183-.248l-.142-.051a1.52,1.52,0,0,1-.191.325q-3.047,3.059-6.1,6.111a1.341,1.341,0,0,1-1.45.419,1.3,1.3,0,0,1-.851-.866,1.3,1.3,0,0,1,.235-1.19,3.215,3.215,0,0,1,.257-.274l6.034-6.033C978.386-438.167,978.484-438.245,978.609-438.353Z" transform="translate(-971.716 447.116)" fill="#fff" />
                        </svg>
                    </Modal.Header>
                    <Modal.Content className='mh-400 overflow-y-auto'>
                        <div className='row mb-3'>
                            <div className='col-lg-6'>
                                <p className='fw-600'>LARGE</p>
                            </div>
                            <div className='col-lg-6 text-right'>
                                <p className='text-success-dark'><a href='/'>CLEAR ALL</a></p>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-3 col-md-3 col-sm-6 mb-2'>
                                <label><input className="mr-1 mb-1" type="checkbox" />10x8x8</label>
                            </div>
                            <div className='col-lg-3 col-md-3 col-sm-6 mb-2'>
                                <label><input className="mr-1 mb-1" type="checkbox" />10x8x8</label>
                            </div>
                            <div className='col-lg-3 col-md-3 col-sm-6 mb-2'>
                                <label><input className="mr-1 mb-1" type="checkbox" />10x8x8</label>
                            </div>
                            <div className='col-lg-3 col-md-3 col-sm-6 mb-2'>
                                <label><input className="mr-1 mb-1" type="checkbox" />10x8x8</label>
                            </div>
                            <div className='col-lg-3 col-md-3 col-sm-6 mb-2'>
                                <label><input className="mr-1 mb-1" type="checkbox" />10x8x8</label>
                            </div>
                            <div className='col-lg-3 col-md-3 col-sm-6 mb-2'>
                                <label><input className="mr-1 mb-1" type="checkbox" />10x8x8</label>
                            </div>
                            <div className='col-lg-3 col-md-3 col-sm-6 mb-2'>
                                <label><input className="mr-1 mb-1" type="checkbox" />10x8x8</label>
                            </div>
                            <div className='col-lg-3 col-md-3 col-sm-6 mb-2'>
                                <label><input className="mr-1 mb-1" type="checkbox" />10x8x8</label>
                            </div>

                        </div>
                        <div className='text-center mt-1'>
                            <button className='ui button bg-success-dark text-white' >Apply</button>
                        </div>
                    </Modal.Content>
                </Modal>
            </div>
        </div>
    )
}

export default Units;