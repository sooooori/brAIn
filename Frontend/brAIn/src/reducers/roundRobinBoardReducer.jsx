import { ADD_POSTIT } from "../actions/roundRobinBoardAction";

const initialState={
    roundRobinBoard:[]
}

const roundRobinBoardReducer=(state=initialState,action)=>{

    switch(action.type){
        case ADD_POSTIT:{
            const {content,round}=action.payload;

            const newBoard=[...state.roundRobinBoard];

            if(!newBoard[round]){
                newBoard[round]=[];
            }

            newBoard[round].push(content);

            return {
                ...state,roundRobinBoard:newBoard
            };
        }

        default:
            return state;
            
    } 
    
}

export default roundRobinBoardReducer;