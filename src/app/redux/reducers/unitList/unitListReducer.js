const initialState = {
    loading: false,
    filters: {},
    error: ''
}

const unitFilterListReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UNIT_FILTER_REQUEST':
            return {
                ...state,
                loading: true
            }
        case 'UNIT_FILTER_SUCCESS':
            return {
                loading: false,
                filters: action.payload,
                error: ''
            }
        case 'UNIT_FILTER_FAILURE':
            return {
                loading: false,
                filters: {},
                error: action.payload
            }
        default: return state
    }
}

export default unitFilterListReducer