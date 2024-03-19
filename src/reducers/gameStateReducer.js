export const initialState = {
  round: 0,
  currentGuess: Array(5).fill(""),
  pastGuesses: [],
};

export const gameStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INITIALIZE_GAME":
      return action.payload;
    case "SET_ROUND":
      return {
        ...state,
        round: action.payload.round,
      };
    case "UPDATE_CURRENT_GUESS":
      return {
        ...state,
        currentGuess: action.payload,
      };
    case "ADD_GUESS":
      return {
        ...state,
        pastGuesses: [...state.pastGuesses, action.payload],
      };
    default:
      return state;
  }
};
