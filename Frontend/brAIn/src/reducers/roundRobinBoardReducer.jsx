import { ADD_POSTIT, RESET_BOARD } from "../actions/roundRobinBoardAction";

const initialState = {
    roundRobinBoard: [],
};

const roundRobinBoardReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_POSTIT: {
            const { round, content } = action.payload;

            // Create a copy of the roundRobinBoard
            const newBoard = state.roundRobinBoard.map((roundContent, index) => 
                index === round-1 ? [...roundContent, content] : roundContent
            );

            // If the round does not exist, initialize it with an array containing the content
            if (!newBoard[round-1]) {
                newBoard[round-1] = [content];
            }

            return {
                ...state,
                roundRobinBoard: newBoard
            };
        }

        case RESET_BOARD:
            return {
                ...state,
                roundRobinBoard: []
            }
        
        default:
            return state;
    }
};

export default roundRobinBoardReducer;
