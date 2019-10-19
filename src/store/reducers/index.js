import { combineReducers } from "redux";
import photosGalleryReducer from "./photosGallery";
import settingsReducer from "./settings";
import droneParametersReducer from "./droneParameters";
import mapReducer from "./map";

let rootReducer = combineReducers({
  photos: photosGalleryReducer,
  settings: settingsReducer,
  droneParameters: droneParametersReducer,
  map: mapReducer
});

export default rootReducer;
