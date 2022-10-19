import instance from '../../../services/instance';
import request from '../../../services/request';
import { constant } from '../../constants/constant';

export const fetchUnitFilter = () => {
    return (dispatch) => {
        dispatch(fetchUnitFilterRequest());
        let config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        instance
            .get(request.unit_filters, config)
            .then(response => {
                const configData = response.data
                setTimeout(() => {  // to emulate some network delay
                    dispatch(fetchUnitFilterSuccess(configData))
                }, 2000)
            })
            .catch(error => {
                dispatch(fetchUnitFilterFailure(error.message))
            })
    }
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