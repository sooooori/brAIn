import axios from 'axios';

export const ADD_ITEM='ADD_ITEM'
export const REORDER_ITEMS='REORDER_ITEMS'

// export const addItem=(round,index,content)=>({
//     type:ADD_ITEM,
//     payload:{
//         round,
//         index,
//         content
//     }
// })

// export const reorder=(items)=>({
//     type:REORDER_ITEMS,
//     payload:{items}
// })


export const addItem = (round,index,content) => async (dispatch, getState) => {
    // 서버에 아이템을 보내는 로직이 필요하다면 여기서 처리할 수 있습니다.
    
    dispatch({
      type: ADD_ITEM,
      payload: {
        round,
        index,
        content,
      }
    });
  
    // 상태가 업데이트된 후 실행할 로직
    const state = getState();
    const votedItems = state.votedItem.items;
    
    // 업데이트된 상태로 후속 작업 수행
    if (votedItems.length > 0) {
      console.log('Updated votedItems:', votedItems);
      // 추가 로직을 여기서 처리할 수 있습니다.
    }
  };
  
  // 아이템 순서 재정렬 액션 생성자
  export const reorderItems = (items) => {
    return {
      type: REORDER_ITEMS,
      payload: { items }
    };
  };