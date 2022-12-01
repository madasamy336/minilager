
import { constant } from '../../constants/constant';

export const rentDetailAction = (value) => {
    return (dispatch) => {
        dispatch(StoreRentDetails(value));
       
    }
    
}

export const StoreRentDetails =(value) => {
    return {
        type: constant.RENT_DETAILS,
        payload: value
    }
}

