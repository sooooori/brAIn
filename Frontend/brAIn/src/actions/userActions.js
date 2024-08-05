export const ADD_USER = 'ADD_USER';
export const REMOVE_USER = 'REMOVE_USER';
export const SET_USERS = 'SET_USERS';
export const SET_USERNICK = 'SET_USERNICK'

export const addUser = (user) => ({
    type: ADD_USER,
    payload: user,
});

export const removeUser = (userId) => ({
    type: REMOVE_USER,
    payload: userId,
});

export const setUsers = (users) => ({
    type: SET_USERS,
    payload: users,
});

export const setUserNick = (nickname) => ({
    type: SET_USERNICK,
    payload: nickname,
});