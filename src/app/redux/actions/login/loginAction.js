import instance from '../../../services/instance';
import request from '../../../services/request';
import { constant } from '../../constants/constant';

// export const loginCall = (value) => {
//     return (dispatch) => {
//         debugger
//         dispatch(fetchLoginRequest());
//         let config = {
//             headers: {
//                 "Content-Type": "application/json",
//             },
//         };
//         instance
//             .post(request.user_login,value,config)
//             .then(response => {
//                 console.log(response)
//                 const configData = response.data
//                 console.log(configData.result)
//                 if(typeof configData.result !== null && configData.result !== 'undefined'&& configData.result !== ''){
//                    // to emulate some network delay
//                         dispatch(fetchLoginSuccess(configData))
               
//                 }else{
//                     dispatch(fetchLoginFailure('There is no record found'))
//                 }
//             })
//             .catch(error => {
//                 dispatch(fetchLoginFailure(error.message))
//             })
//     }
    
// }

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