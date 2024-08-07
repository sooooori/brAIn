export const ADD_ITEM='ADD_ITEM'
export const REORDER_ITEMS='REORDER_ITEMS'

export const addItem=(round,index,content)=>({
    type:ADD_ITEM,
    payload:{
        round,
        index,
        content
    }
})

export const reorder=(items)=>({
    type:REORDER_ITEMS,
    payload:{items}
})
