import { ADD_ITEM, REORDER_ITEMS } from "../actions/votedItemAction";


const initialState={
    // items:[{round:1,index:3,content:'데모1'},{round:2,index:4,content:'데모2'},{round:4,index:3,content:'데모3'}]
    items: []
}

const votedItemReducer=(state=initialState,action)=>{

    switch(action.type){
        case ADD_ITEM:{
            const {round,index,content} =action.payload;
            const item={
                round:round,
                index:index,
                content:content
            }

            const newItems=[...state.items];
            if(newItems.length<3){
                newItems.push(item);
            }

            return { ...state, items: newItems };
            
        }

        case REORDER_ITEMS:{
            return { ...state, items: action.payload.items };
        }
        
        default:
      return state;
    }
}

export default votedItemReducer
