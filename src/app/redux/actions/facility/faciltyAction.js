import instance from '../../../services/instance';
import request from '../../../services/request';
import { constant } from '../../constants/constant';

export const fetchFacilty = () => {
    return (dispatch) => {
        dispatch(fetchAppConfigRequest());
        let config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        instance
            .post(request.facility_cities, config,{})
            .then(response => {
                const configData = response.data;
                if(configData.result !== null && configData.result !== 'undefined'&& configData.result !== ''){
                   // to emulate some network delay
                        dispatch(fetchAppConfigSuccess(configData))
               
                }else{
                    dispatch(fetchAppConfigFailure('There is no record found'))
                }
            })
            .catch(error => {
                dispatch(fetchAppConfigFailure(error.message))
            })
    }
    
}
export const GetFacilityId = (locationId) => {
    return (dispatch) => {
        if(locationId !== null && locationId !== 'undefined'&& locationId !== ''){
            localStorage.setItem('locationid',locationId);
            dispatch(getLocationId(locationId));    
        }

    }

}

export const fetchAppConfigRequest = () => {
    return {
        type: constant.FACILITY_REQUEST
    }
}

export const fetchAppConfigSuccess = countries => {
    return {
        type: constant.FACILITY_SUCESS,
        payload: countries
    }
}

export const getLocationId = id => {
    return {
        type: constant.UNIT_GETLOCATIONID,
        payload: id,
    }
}
export const fetchAppConfigFailure = error => {
    return {
        type: constant.FACILITY_FAILURE,
        payload: error 
    }
}