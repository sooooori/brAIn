import { SET_CUR_STEP, UP_ROUND } from '../actions/conferenceActions';

const initialState = {
    curStep: 'WAIT',
    round: 1,
};

const conferenceReducer = (state = initialState, action) => {
    switch (action.type) {
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

        default:
            return state; // 알 수 없는 액션 타입인 경우 현재 상태를 반환
    }
};

export default conferenceReducer;
