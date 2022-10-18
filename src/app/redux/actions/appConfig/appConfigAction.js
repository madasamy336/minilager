import instance from '../../../services/instance';
import request from '../../../services/request';
import { appConfigConstant } from '../../constants/appConfigConstant';

export const fetchAppConfig = () => {
    return (dispatch) => {
        dispatch(fetchAppConfigRequest());
        let config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        instance
            .get(request.common_config, config)
            .then(response => {
                const configData = response.data
                setTimeout(() => {  // to emulate some network delay
                    dispatch(fetchAppConfigSuccess(configData))
                }, 2000)
            })
            .catch(error => {
                dispatch(fetchAppConfigFailure(error.message))
            })
    }
}

export const fetchAppConfigRequest = () => {
    return {
        type: appConfigConstant.CONFIG_REQUEST
    }
}

export const fetchAppConfigSuccess = countries => {
    return {
        type: appConfigConstant.CONFIG_SUCCESS,
        payload: countries
    }
}

export const fetchAppConfigFailure = error => {
    return {
        type: appConfigConstant.CONFIG_FAILURE,
        payload: error
    }
}