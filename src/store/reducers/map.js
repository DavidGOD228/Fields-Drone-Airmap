let initialState = {
  mapPath: "",
  invertedPath: "",
  jimpMap: {}
};

let mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_MAP_PATH":
      return {
        ...state,
        mapPath: action.mapPath
      };
    case "SET_JIMP_MAP":
      return {
        ...state,
        jimpMap: action.jimpMap
      };
    case "SET_INVERTED_PATH":
      return {
        ...state,
        invertedPath: action.invertedPath
      };
    default:
      return state;
  }
};

export default mapReducer;
