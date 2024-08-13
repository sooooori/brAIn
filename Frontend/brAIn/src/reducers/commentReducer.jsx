import { ADD_COMMENTS, INIT_COMMENT, INIT_VOTE, NEXT_ITEM } from "../actions/commentsAction";

const initialState = {
    vote:[],
    comments: [],
    curIndex:0,
};

const commentReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_COMMENTS: { // 액션 타입은 문자열로 적어야 합니다.
            const content = action.payload; 
            const updatedComments = [...state.comments, content]; // 기존 상태를 수정하지 않고 새로운 배열 생성

            return {
                ...state, // 기존 상태를 복사
                comments: updatedComments // 새로운 댓글 배열로 덮어쓰기
            };
        }
        case INIT_VOTE: {
            const vote=action.payload;

            return{
                ...state,
                vote:vote
            };
        }
        case NEXT_ITEM: {
            
            return{
                ...state,
                curIndex:state.curIndex+1
            }
        }
        case INIT_COMMENT: {

            const initComment = action.payload;

            return{
                ...state,
                comments:initComment
            }
        }
        default:
            return state; // 기본으로 현재 상태를 반환
    }
};

export default commentReducer;