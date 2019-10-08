let initialState = {
  photos: []
};

let photoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PUSH_PHOTO":
      return {
        photos: [...state.photos, action.photo]
      };
    default:
      return state;
  }
};

export default photoReducer;
