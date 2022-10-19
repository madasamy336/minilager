import instance from '../../../services/instance';
import request from '../../../services/request';
import { constant } from '../../constants/constant';

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
                dispatch(fetchAppConfigSuccess(configData));
            })
            .catch(error => {
                dispatch(fetchAppConfigFailure(error.message))
            })
    }
    
}

export const fetchAppConfigRequest = () => {
    return {
        type: constant.CONFIG_REQUEST
    }
}

export const fetchAppConfigSuccess = configData => {
    return {
        type: constant.CONFIG_SUCCESS,
        payload: configData
    }
}

export const fetchAppConfigFailure = error => {
    return {
        type: constant.CONFIG_FAILURE,
        payload: error
    }
}