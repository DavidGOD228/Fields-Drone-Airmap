export const updatePhotosArray = photos => {
  return {
    type: "UPDATE_PHOTOS_ARRAYS",
    photos
  }
}

export const pushPhoto = photo => {
  return {
    type: "PUSH_PHOTO",
    photo
  }
}