const initialState = {
    loading: false,
    userid: "",
    error: ''
  }
  
  const LoginReducer = (state = initialState, action) => {
    
    switch (action.type) {
      case 'LOGIN_REQUEST':
        return {
          ...state,
          loading: true
        }
      case 'LOGIN_SUCESS':
        localStorage.setItem('userid',action.payload.result.userId);
        return {
          loading: false,
          userid: action.payload.result.userId,
          error: ''
        }
      case 'LOGIN_FAILURE':
        return {
          loading: false,
          userid: {},
          error: action.payload
        }
      default: return state
    }
  }
  
  export default LoginReducer