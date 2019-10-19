let initialState = [];

let photoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PUSH_PHOTO":
      return [...state, action.photo];
    default:
      return state;
  }
};

export default photoReducer;
