import { combineReducers } from 'redux'
import photosGalleryReducer from './photosGallery'
import settingsReducer from './settings'

let rootReducer = combineReducers({
  photos: photosGalleryReducer,
  settings: settingsReducer
})

export default rootReducer