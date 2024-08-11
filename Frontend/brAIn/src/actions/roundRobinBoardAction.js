export const ADD_POSTIT= 'ADD_POSTIT';
export const RESET_BOARD = 'RESET_BOARD'

// 비동기 액션 생성자
export const sendToBoard = (round, content) => {
    return async (dispatch) => {
        try {
            // API 호출 또는 비동기 작업을 여기에 넣습니다.
            // 예를 들어: await api.sendPostIt(round, content);

            // 비동기 작업이 성공적으로 완료된 후 성공 액션을 디스패치
            dispatch({
                type: ADD_POSTIT,
                payload: {
                    content,
                    round
                }
            });
        } catch (error) {
            // 오류 발생 시 실패 액션을 디스패치
            console.error('Failed to send post-it:', error);
        }
    };
};

// 동기 액션 생성자
export const resetRoundBoard = () => ({
    type: RESET_BOARD
});