export const setMapPath = mapPath => {
  return {
    type: "SET_MAP_PATH",
    mapPath
  };
};

export const setInvertedPath = invertedPath => {
  return {
    type: "SET_INVERTED_PATH",
    invertedPath
  };
};

export const setJimpMap = jimpMap => {
  return {
    type: "SET_JIMP_MAP",
    jimpMap
  };
};
