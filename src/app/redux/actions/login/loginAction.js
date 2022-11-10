import { constant } from '../../constants/constant';

export const fetchLoginFailure = error => {
    return {
        type: constant.LOGIN_FAILURE,
        payload: error 
    }
}

export const fetchLoginRequest = () => {
    return {
        type: constant.LOGIN_REQUEST
    }
}

export const fetchLoginSuccess = userid => {
    return {
        type: constant.LOGIN_SUCESS,
        payload: userid
    }
}