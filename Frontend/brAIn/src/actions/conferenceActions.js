export const SET_CUR_STEP = 'SET_CUR_STEP';
export const UP_ROUND = 'UP_ROUND';
export const SET_ROUND = 'SET_ROUND';
export const RESET_STATE = 'RESET_STATE';
export const SET_ROOM='SET_ROOM';
export const SET_STEP_TIME = 'SET_STEP_TIME';

export const setCurStep = (step) => ({
    type: SET_CUR_STEP,
    payload: step,
});

export const upRound = () => ({
    type: UP_ROUND,
});

export const setRound = (round) =>({
    type: SET_ROUND,
    payload: round,
});

export const resetConference = ()=>({
    type: RESET_STATE
});

export const setRoom=(roomId)=>({
    type:SET_ROOM,
    payload:roomId,
});

export const setStepTime= (step, time) => ({
    type:SET_STEP_TIME,
    payload: {step, time}
});