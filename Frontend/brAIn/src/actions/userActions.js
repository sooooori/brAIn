export const ADD_USER = 'ADD_USER';
export const REMOVE_USER = 'REMOVE_USER';
export const SET_USERS = 'SET_USERS';
export const SET_USERNICK = 'SET_USERNICK';
export const SET_CURUSER = 'SET_CURUSER';
export const SET_NEXTUSER = 'SET_NEXTUSER';
export const UPDATE_TIMER = 'UPDATE_TIMER';

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
    return getState().user.users;
};

export const setUserNick = (nickname) => ({
    type: SET_USERNICK,
    payload: nickname,
});

// 답변 패스
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

