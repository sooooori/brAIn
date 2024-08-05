import { ADD_USER, REMOVE_USER, SET_USERS, SET_USERNICK, SET_CURUSER, SET_NEXTUSER, UPDATE_TIMER} from '../actions/userActions';

const initialState = {
    users: [],
    nickname: "",
    // 답변 패스
    currentUser: "",
    nextUser: "",
    // 타이머
    timer: 0,
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
        case SET_CURUSER:
            return{
                ...state,
                currentUser: action.payload,
            }
        case SET_NEXTUSER:
            return{
                ...state,
                nextUser: action.payload,
            }
        case UPDATE_TIMER:
            return {
                ...state,
                timer: action.payload,
            }

        default:
            return state;
    }
};

export default userReducer;
