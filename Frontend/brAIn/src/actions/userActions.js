export const ADD_USER = 'ADD_USER';
export const REMOVE_USER = 'REMOVE_USER';
export const SET_USERS = 'SET_USERS';
export const SET_USERNICK = 'SET_USERNICK';
export const SET_CURUSER = 'SET_CURUSER';
export const SET_NEXTUSER = 'SET_NEXTUSER';
export const UPDATE_TIMER = 'UPDATE_TIMER';
export const RESET_STATE = 'RESET_STATE';
export const UPDATE_PASS_STATUS = 'UPDATE_PASS_STATUS';
export const RESET_PASS_STATUS = 'RESET_PASS_STATUS';
export const UPDATE_READY_STATUS = 'UPDATE_READY_STATUS';
export const RESET_READY_STATUS = 'RESET_READY_STATUS';
export const EXIT_USER='EXIT_USER';

export const addUser = (user) => ({
    type: ADD_USER,
    payload: user,
});

export const removeUser = (userId) => ({
    type: REMOVE_USER,
    payload: userId,
});

export const setUsers = (users) => (dispatch, getState) => {
    dispatch({
        type: SET_USERS,
        payload: users
    });

    const updatedUsers = getState().user.users;
    return updatedUsers
};

export const setUserNick = (nickname) => ({
    type: SET_USERNICK,
    payload: nickname,
});

export const setCuruser = (curUser) => ({
    type: SET_CURUSER,
    payload: curUser,
});

// 답변 패스
export const setNextuser = (nextUser) => ({
    type: SET_NEXTUSER,
    payload: nextUser,
});

// 타이머 시간 설정
export const updateTimer = (time) => ({
    type: UPDATE_TIMER,
    payload: time,
});

export const resetUser = () => ({
    type: RESET_STATE
});

export const updatePassStatus = (nickname) => ({
    type: UPDATE_PASS_STATUS,
    payload: nickname,
});
  
export const resetPassStatus = () => ({
    type: RESET_PASS_STATUS,
});

export const updateReadyStatus = (nickname) => ({
    type: UPDATE_READY_STATUS,
    payload: nickname,
});

export const resetReadyStatus = () => ({
    type: RESET_READY_STATUS,
});


export const passStepUser = (stepPassUser) => async (dispatch, getState) => {
    try {
        const { client, roomId, round } = getState().conference;

        if (client) {
            // 1. 서버에 패스 정보를 전송합니다.
            await client.publish({
                destination: `/app/state.user.pass.${roomId}`,
                headers: {
                    Authorization: localStorage.getItem('roomToken'),
                },
                body: JSON.stringify({
                    curRound: round,
                    userNickname: stepPassUser, // 패스한 사용자의 닉네임
                }),
            });
        }

    } catch (error) {
        console.error('Error during user pass:', error);
        // 필요에 따라 오류 처리 로직을 추가할 수 있습니다.
    }
};

export const exitUser=(user)=>({
    type:EXIT_USER,
    payload:user,
})