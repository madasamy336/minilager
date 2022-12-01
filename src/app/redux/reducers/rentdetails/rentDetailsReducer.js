const initialState = {
    renDetails: {},
    error: ''
}

const rentDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'RENT_DETAILS':
            return {
                renDetails: action.payload,
            }
       
        default: return state
    }
}

export default rentDetailsReducer