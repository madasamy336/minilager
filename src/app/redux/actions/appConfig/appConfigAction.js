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
                const configData = response.data.result;
                const culture = response.data.result.culture;
                configData.invoicePeriods.map((value) => {
                    if (value.preferred) {
                        sessionStorage.setItem("invoiceData", (value.invoicePeriodId));
                    }
                })
                sessionStorage.setItem("recurringData", (configData.recurringTypes[0].recurringTypeId));

                sessionStorage.setItem('configdata', JSON.stringify(configData));
                sessionStorage.setItem('culture', JSON.stringify(culture));
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