const initialState = {
    loading: false,
    countries: {},
    error: ''
  }
  
  const appConfigReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_COFIG_REQUEST':
        return {
          ...state,
          loading: true
        }
      case 'FETCH_COFIG_SUCCESS':
        return {
          loading: false,
          countries: action.payload,
          error: ''
        }
      case 'FETCH_COFIG_FAILURE':
        return {
          loading: false,
          countries: {},
          error: action.payload
        }
      default: return state
    }
  }
  
  export default appConfigReducer