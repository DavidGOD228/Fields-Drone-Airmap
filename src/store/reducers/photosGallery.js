let initialState = {
  photos: []
}

let photoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_SELECTED_FEED_LENGTH_SUCCESS":
      console.log("action: ", action);
        return {
          ...state,
          photos: action.photos
        };
    case "PUSH_PHOTO":
      return {
        photos: [...state.photos, action.photo]
      }
    default:
      return state;
  }
}

export default photoReducer