import * as ActionTypes from './ActionTypes';

export const comments = (state = { errMess: null, comments:[]}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_COMMENTS:
      return {...state, errMess: null, comments: action.payload};

    case ActionTypes.COMMENTS_FAILED:
      return {...state, errMess: action.payload};
          
    case ActionTypes.ADD_COMMENT:
            if (state.some(el => el === action.payload))
                return state;
            else
                return state.concat(action.payload);      

    default:
      return state;
  }
};