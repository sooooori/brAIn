export const ADD_COMMENTS="ADD_COMMENTS"
export const INIT_VOTE='INIT_VOTE'
export const NEXT_ITEM='NEXT_ITEM'
export const INIT_COMMENT='INIT_COMMENT'

export const addComments=(content)=>({
    type:ADD_COMMENTS,
    payload:content
});

export const initVote=(votes)=>({
    type:INIT_VOTE,
    payload: votes
})

export const nextItem=()=>({
    type:NEXT_ITEM,
})

export const initComment=(comments)=>({
    type:INIT_COMMENT,
    payload:comments
})