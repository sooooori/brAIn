export const ADD_POSTIT= 'ADD_POSTIT';


const sendToBoard=(round,content)=>{
    return{
        type:ADD,
        payload:{
            content:content,
            round:round
        }
    }
}