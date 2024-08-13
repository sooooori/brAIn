import { SET_CUR_STEP, UP_ROUND, SET_ROUND, RESET_STATE,SET_ROOM, SET_STEP_TIME } from '../actions/conferenceActions';

const initialState = {
    roomId:1,
    curStep: 'WAIT',
    round: 1,
    timeSetting:{
        STEP_1 : 1 * 60 * 1000,
        STEP_2 : 1 * 60 * 1000,
        STEP_3 : 1 * 60 * 1000,
    },
};

const conferenceReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ROOM:
            return{
                ...state,
                roomId:action.payload,
            }

        case SET_CUR_STEP:
            return {
                ...state,
                curStep: action.payload, // payload로 전달된 값으로 curStep 업데이트
            };

        case UP_ROUND:
            return {
                ...state,
                round: state.round + 1, // round 값을 1 증가
            };
        case SET_ROUND:
            return {
                ...state,
                round: action.payload, // payload로 전달된 값으로 curStep 업데이트
            };
        case RESET_STATE:
            return initialState;

        case SET_STEP_TIME:
            return{
                ...state,
                timeSetting:{
                    ...state.timeSetting,
                    [action.payload.step]: action.payload.time,
                },
            };

        default:
            return state; // 알 수 없는 액션 타입인 경우 현재 상태를 반환
    }
};

export default conferenceReducer;
