export const updateDroneParameter = (name, val) => {
  return {
    type: "UPDATE_DRONE_PARAMETER",
    keyVal: { name, val }
  };
};
