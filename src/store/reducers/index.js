import { combineReducers } from "redux";
import photosGalleryReducer from "./photosGallery";
import settingsReducer from "./settings";
import droneParametersReducer from "./droneParameters";

let rootReducer = combineReducers({
  photosData: photosGalleryReducer,
  settings: settingsReducer,
  droneParameters: droneParametersReducer
});

export default rootReducer;
