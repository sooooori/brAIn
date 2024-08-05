export const SET_CUR_STEP = 'WAIT';
export const UP_ROUND = 0

export const setCurStep = (step) => ({
    type: SET_CUR_STEP,
    payload: step,
});

export const upRound = () => ({
    type: UP_ROUND,
});