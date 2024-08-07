export const ADD_POSTIT= 'ADD_POSTIT';
export const RESET_BOARD = 'RESET_BOARD'

export const sendToBoard=(round,content)=>{
    return{
        type:ADD_POSTIT,
        payload:{
            content:content,
            round:round
        }
    }
}

export const resetRoundBoard = ()=>({
    type: RESET_BOARD
})