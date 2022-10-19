import instance from '../../../services/instance';
import request from '../../../services/request';
import { appConfigConstant } from '../../constants/constant';

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

export const fetchAppConfigRequest = () => {
    return {
        type: appConfigConstant.FACILITY_REQUEST
    }
}

export const fetchAppConfigSuccess = countries => {
    return {
        type: appConfigConstant.FACILITY_SUCESS,
        payload: countries
    }
}

export const fetchAppConfigFailure = error => {
    return {
        type: appConfigConstant.FACILITY_FAILURE,
        payload: error
    }
}