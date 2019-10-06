import { combineReducers } from 'redux'
import photosGalleryReducer from './photosGallery'

let rootReducer = combineReducers({
  photos: photosGalleryReducer
})

export default rootReducer