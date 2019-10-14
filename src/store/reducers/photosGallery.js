let initialState = {
  photos: []
};

let photoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PUSH_PHOTO":
      console.log({
        ...state,
        photos: [...state.photos, action.photo],
      });
      return {
        ...state,
        photos: [...state.photos, action.photo],
      };
    case "SET_MAP_PATH":
      console.log({
        mapPath: action.mapPath,
        ...state
      });
      return {
        mapPath: action.mapPath,
        ...state
      };
    default:
      return state;
  }
};

export default photoReducer;
