const initialState = {
  loading: false,
  countries: {},
  id: '',
  error: ''
}

const faciltyReducer = (state = initialState, action) => {
  console.log(state)
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
    case 'UNIT_GETLOCATIONID':
      return {
        ...state, id: action.payload

      }
    default: return state
  }
}

export default faciltyReducer