import instance from '../../../services/instance';
import request from '../../../services/request';
import { constant } from '../../constants/constant';

export const forgetPasswordFailure = error => {
    return {
        type: constant.LOGIN_FAILURE,
        payload: error 
    }
}

export const forgetPasswordRequest = () => {
    return {
        type: constant.LOGIN_REQUEST
    }
}

export const forgetPasswordSuccess = userid => {
    return {
        type: constant.LOGIN_SUCESS,
        payload: userid
    }
}