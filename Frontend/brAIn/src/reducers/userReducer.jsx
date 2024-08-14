import { ADD_USER, REMOVE_USER, SET_USERS, SET_USERNICK, SET_CURUSER, SET_NEXTUSER, UPDATE_TIMER, RESET_STATE, UPDATE_PASS_STATUS, RESET_PASS_STATUS, UPDATE_READY_STATUS, RESET_READY_STATUS, EXIT_USER, } from '../actions/userActions';

const initialState = {
    users: [],
    nickname: "",
    currentUser: "",
    nextUser: "",
    timer: 0,
    passStatus: {},
    readyStatus: {},
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USERS':
            return {
                ...state,
                users: action.payload.map(nickname => ({
                    nickname: nickname,
                    ready: false
                }))
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
            return {
                ...state,
                nickname: action.payload,
            }
        case SET_CURUSER:
            return {
                ...state,
                currentUser: action.payload,
            }
        case SET_NEXTUSER:
            return {
                ...state,
                nextUser: action.payload,
            }
        case UPDATE_TIMER:
            return {
                ...state,
                timer: action.payload,
            }
        case RESET_STATE:
            return initialState;

        case UPDATE_PASS_STATUS:
            return {
                ...state,
                passStatus: {
                    ...state.passStatus,
                    [action.payload]: true, // 해당 사용자의 패스 상태를 true로 설정
                },
            };

        case RESET_PASS_STATUS:
            return {
                ...state,
                passStatus: {}, // 패스 상태 초기화
            };

        case UPDATE_READY_STATUS:
            return {
                ...state,
                readyStatus: {
                    ...state.readyStatus,
                    [action.payload]: true,
                },
            };

        case RESET_READY_STATUS:
            return {
                ...state,
                readyStatus: {},
            };
        
        case EXIT_USER:{
            const {exitUser,nextUser}=action.payload;
            console.log("나간유저",exitUser);
            
            const updatedUsers = state.users.filter(user => user.nickname !== exitUser);
            console.log("현재유저",state.currentUser)
            
            if(state.currentUser==exitUser){
                if(nextUser==state.users[0].nickname){
                    return {
                        ...state,
                        users: updatedUsers,
                        currentUser:nextUser,
                        passStatus:{},
                    };
                }
                return {
                    ...state,
                    users: updatedUsers,
                    currentUser:nextUser,
                };
            }
            return {
                ...state,
                users: updatedUsers,
            };

        }
            


        default:
            return state;
    }
};

export default userReducer;
