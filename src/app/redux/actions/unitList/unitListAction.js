import instance from '../../../services/instance';
import request from '../../../services/request';
import { constant } from '../../constants/constant';

export const fetchUnitFilter = () => {
    return async (dispatch) => {
        dispatch(fetchUnitFilterRequest());
        let config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        instance
            .get(request.unit_filters, config)
            .then(response => {
                const unitFilterResponse = response.data;
                if (typeof unitFilterResponse !== 'undefined' && unitFilterResponse !== null && unitFilterResponse !== '' && unitFilterResponse.isSuccess === true && unitFilterResponse.result.length > 0) {
                    let data = constructFilterValues(unitFilterResponse.result);
                    localStorage.setItem("Units", JSON.stringify(data));
                    dispatch(fetchUnitFilterSuccess(data));
                } else {
                    dispatch(fetchUnitFilterFailure('No records found'));
                }
            })
            .catch(error => {
                dispatch(fetchUnitFilterFailure(error.message))
            })
    }
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

export const fetchUnitFilterRequest = () => {
    return {
        type: constant.UNIT_FILTER_REQUEST
    }
}

export const fetchUnitFilterSuccess = filterResult => {
    return {
        type: constant.UNIT_FILTER_SUCCESS,
        payload: filterResult
    }
}

export const fetchUnitFilterFailure = error => {
    return {
        type: constant.UNIT_FILTER_FAILURE,
        payload: error
    }
}