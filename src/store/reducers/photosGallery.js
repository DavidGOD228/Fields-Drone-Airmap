let initialState = {
  photos: []
};

let photoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "PUSH_PHOTO":
      // console.log("PUSH_PHOTO", {
      //   ...state,
      //   photos: [...state.photos, action.photo],
      // });
      return {
        ...state,
        // photos: [...state.photos, action.photo]
        photos: state.photos.concat(action.photo)
      };
    // return [...state.photos, action.photo];
    case "SET_MAP_PATH":
      // console.log("SET_MAP_PATH", {
      //   ...state,
      //   mapPath: action.mapPath,
      // });
      // return {
      //   ...state,
      //   mapPath: action.mapPath,
      // };
      return {
        ...state,
        mapPath: action.mapPath
      };
    default:
      return state;
  }
};

export default photoReducer;
