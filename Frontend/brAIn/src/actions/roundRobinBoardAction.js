export const ADD_POSTIT= 'ADD_POSTIT';


export const sendToBoard=(round,content)=>{
    return{
        type:ADD_POSTIT,
        payload:{
            content:content,
            round:round
        }
    }
}
