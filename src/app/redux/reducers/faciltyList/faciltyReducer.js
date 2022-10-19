const initialState = {
    loading: false,
    countries: {},
    error: ''
  }
  
  const faciltyReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_FACILITY_REQUEST':
        return {
          ...state,
          loading: true
        }
      case 'FETCH_FACILITY_SUCESS':
        return {
          loading: false,
          countries: action.payload,
          error: ''
        }
      case 'FETCH_FACILITY_FAILURE':
        return {
          loading: false,
          countries: {},
          error: action.payload
        }
      default: return state
    }
  }
  
  export default faciltyReducer