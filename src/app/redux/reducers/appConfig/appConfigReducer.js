const initialState = {
  loading: false,
  config: {},
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
      console.log(action.payload.result.culture);
      sessionStorage.setItem('culture', JSON.stringify(action.payload.result.culture))
      return {
        loading: false,
        config: action.payload,
        error: ''
      }
    case 'FETCH_COFIG_FAILURE':
      return {
        loading: false,
        config: {},
        error: action.payload
      }
    default: return state
  }
}

export default appConfigReducer