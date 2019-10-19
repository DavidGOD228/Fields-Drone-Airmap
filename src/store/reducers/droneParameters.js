let initialState = [
  {
    // name: languageSettingVal === "English" ? "Area" : "Укр2",
    name: "Час польоту",
    val: 49,
    icon: "coffee",
    measuredIn: "acres"
  },
  {
    // name: languageSettingVal === "English" ? "Battery" : "Укр3",
    name: "Заряд дрона",
    val: 3900,
    icon: "coffee",
    measuredIn: "mph"
  }
];

let photoReducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPDATE_DRONE_PARAMETER":
      return state.map((el, idx) => {
        if (el.name === action.keyVal.name) {
          return {
            ...el,
            ...action.keyVal
          };
        } else {
          return el;
        }
      });
    default:
      return state;
  }
};

export default photoReducer;
