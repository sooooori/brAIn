import { ADD_USER, REMOVE_USER, SET_USERS } from '../actions/userActions';

const initialState = {
    users: [],
    nickname: ''
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USERS:
            return {
                ...state,
                users: action.payload,
            };
        case ADD_USER:
            return {
                ...state,
                users: [...state.users, action.payload],
            };
        case REMOVE_USER:
            return {
                ...state,
                users: state.users.filter(user => user.id !== action.payload),
            };
        case SET_USERNICK:
            return{
                ...state,
                nickname: action.payload,
            }
        default:
            return state;
    }
};

export default userReducer;
